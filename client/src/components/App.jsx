import React from 'react';
import axios from 'axios';
import { Link, Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';
import HomePage from './HomePage';
import Login from './Login';
import messages from '../../../sampleData';
import SignUp from './SignUp';

const cookies = new Cookies();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      profileObj: {},
      tokenId: '',
      signIn: false,
    };

    this.responseGoogle = this.responseGoogle.bind(this);
    this.logState = this.logState.bind(this);
    this.homePage = this.homePage.bind(this);
    this.checkCookies = this.checkCookies.bind(this);
    this.logout = this.logout.bind(this);
    this.onClickSignUpSmoker = this.onClickSignUpSmoker.bind(this);
  }

  componentDidMount() {
    this.checkCookies();
  }


  logout() {
    this.setState({
      loggedIn: false,
    });
  }

  responseGoogle(googleResponse) {
    console.log('googleResponse', googleResponse);
   
    cookies.set('dbd-session-cookie', googleResponse.tokenId);
    axios.post('/login', googleResponse.profileObj)
     .then((response) => {
      console.log('RESONSE IN LOGIN POST', response);
      this.setState({
        profileObj: googleResponse.profileObj,
        tokenId: googleResponse.tokenId,
      });
      if (response.data === false) {
        this.setState({ signIn: true });
      } else {
        this.setState({
          // update progress, messages, etc
          loggedIn: true,
        });
      }
    });
  }
  
  onClickSignUpSmoker(user) {
    console.log('USER in CLICK SMOKER', user);
    console.log('THIS>STATE',this.state)
    const userInfo = Object.assign(user, this.state.profileObj);
    axios.post('/signup', userInfo)
    .then((response) => {
      if (response === true) {
        console.log('USER already exists')
        // rerender signup
      } else {
        //redirect to home page
      }
    });
  }
  
  checkCookies() {
    if (cookies.get('dbd-session-cookie')) {
      axios.get('/verifyAuth')
        .then((response) => {
          console.log('Response in verify Auth client', response);
          if(response.data === false) {

          } else {
            this.setState({
              // update progress, messages, etc
              loggedIn: true,
            });
          }
        });
    }
  }

  logState() {
    console.log('Here is state');
    console.log(this.state);
  }

  homePage() {
    return (
      <HomePage messages={messages} userState={this.state} cookies={cookies} logout={this.logout} />
    )
  }

  render() {
    if (this.state.loggedIn) {
      return (     
      <div>
        <button onClick={this.logState}>
          Click to console log user credentials
        </button>
        <Switch>
          <Route exact path="/home" render={this.homePage} />
          <Redirect to="/home" />
        </Switch>
      </div>
      );
    } else if (this.state.signIn) {
      console.log('SEND TO SIGNUP');
      return <div>
          <Switch>
            <Route exact path="/signup" render={() => <SignUp createUser={this.onClickSignUpSmoker} profile={this.state.profileObj} responseGoogle={this.responseGoogle} />} />
            <Redirect to="/signup" />
          </Switch>
        </div>;
    }
    return (
    <div>
        <nav>
          <Link to="/landing" style={{ margin: "5px" }}>
            LandingPage
          </Link>

          <Login responseGoogle={this.responseGoogle} />
        </nav>
        <div>
          <Switch>
            <Route exact path="/landing" component={LandingPage} />
            <Redirect to="/" />
          </Switch>
        </div>
    </div>);
  }
}

const LandingPage = () => <h1>Future Landing Page</h1>;
const SignupPage = () => <SignUp createUser={this.onClickSignUpSmoker} />;

export default App;
