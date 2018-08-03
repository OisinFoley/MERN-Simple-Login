import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
      // masterError: ''
    };

    this.onTextBoxChangedSignInEmail = this.onTextBoxChangedSignInEmail.bind(this);
    this.onTextBoxChangedSignInPassword = this.onTextBoxChangedSignInPassword.bind(this);
    this.onTextBoxChangedSignUpFirstName = this.onTextBoxChangedSignUpFirstName.bind(this);
    this.onTextBoxChangedSignUpLastName = this.onTextBoxChangedSignUpLastName.bind(this);
    this.onTextBoxChangedSignUpEmail = this.onTextBoxChangedSignUpEmail.bind(this);
    this.onTextBoxChangedSignUpPassword = this.onTextBoxChangedSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      fetch('/api/account/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            token, 
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      })
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onTextBoxChangedSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextBoxChangedSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onTextBoxChangedSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }

  onTextBoxChangedSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }

  onTextBoxChangedSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextBoxChangedSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  onSignIn() {
    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),      
    }).then(res => res.json())
      .then(json => {

        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,            
            signInEmail: '',
            signInPassword: '',
            token: json.token
          });
        }
        else {
          this.setState({
            signInError: json.message,
            isLoading: false
          });
        }
      });
  }

  onSignUp() {
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;


    this.setState({
      isLoading: true
    });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }),      
    }).then(res => res.json())
      .then(json => {

        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: ''
          });
        }
        else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      });      
  }

  onLogout() {
    this.setState({
      loading: true
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;

      fetch(`/api/account/logout?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }


  render() {

    const { 
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpError
    } = this.state;

    if (isLoading) {
      return (<div> <p> Loading... </p> </div>)
    }

    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : null
            }
    
            <p> Sign In </p>
            <input
              type="email"
              placeholder="Email"
              value={this.signInEmail}
              onChange={this.onTextBoxChangedSignInEmail}
            /> <br/>
            <input
              type="password"
              placeholder="Password"
              value={this.signInPassword}
              onChange={this.onTextBoxChangedSignInPassword}
            /> <br/>
            <button onClick={this.onSignIn} > Sign In </button>
          </div>

          <br/>
          <br/>

          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : null
            }
            <p> Sign Up </p>
            <input type="text"
              placeholder="First Name"
              value={this.signUpFirstName}
              onChange={this.onTextBoxChangedSignUpFirstName}
            /> <br/>
            <input
              type="text"
              placeholder="Last Name"
              value={this.signUpLastName}
              onChange={this.onTextBoxChangedSignUpLastName}
            /> <br/>
            <input
              type="email"
              placeholder="Email"
              value={this.signUpEmail}
              onChange={this.onTextBoxChangedSignUpEmail}
            /> <br/>
            <input
             type="password"
             placeholder="Password"
             value={this.signUpPassword}
             onChange={this.onTextBoxChangedSignUpPassword}
            /> <br/>

            <button onClick={this.onSignUp}> Sign Up </button>
          </div>

          
        </div>
      )
    }

    return (
      <div>
        <div> Account </div>      
        <button
          onClick={this.onLogout}
          > Logout
        </button>
      </div>
    );
  }
}

export default Home;
