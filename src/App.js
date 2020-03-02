import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContext from './context/auth-context';

// PAGES
import HomePage from './pages/HomePage/HomePage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import ClientPage from './pages/ClientsPage/ClientPage';
import NewListPage from './pages/ListPage/NewListPage';
import ListPage from './pages/ListPage/ListPage';
import ListListPage from './pages/ListPage/ListListPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: localStorage.getItem('email'),
      user_id: localStorage.getItem('user_id'),
      token: localStorage.getItem('token'),
      scope: localStorage.getItem('scope'),
      name: localStorage.getItem('name')
    }
  }

  login = (email, user_id, token, scope, name) => {
    this.setState({ email: email, user_id: user_id, token: token, scope: scope, name: name });
  }

  logout = () => {
    this.setState({ email: null, user_id: null, token: null, scope: null, name: null });
    localStorage.clear();
    window.location.replace("/login");
  }

  render() { 
    const ScrollToTop = () => {
      window.scrollTo(0, 0);
      return null;
    };
    return ( 
      <BrowserRouter>
        <AuthContext.Provider value={{ email: this.state.email, user_id: this.state.user_id, token: this.state.token, scope: this.state.scope, login: this.login, logout: this.logout }}>
          <Route component={ScrollToTop} />
          <Switch>
            {/* NINCS BEJELENTKEZVE: */}
            {!this.state.token && <Redirect exact from="/" to="/login" />}
            {!this.state.token && <Redirect exact from="/home" to="/login" />}
            {!this.state.token && <Redirect exact from="/clients" to="/login" />}
            {!this.state.token && <Redirect exact from="/clients/:client_id" to="/login" />}
            {!this.state.token && <Redirect exact from="/new_list" to="/login" />}
            {!this.state.token && <Redirect exact from="/list" to="/login" />}
            {!this.state.token && <Redirect exact from="/list/:list_id" to="/login" />}
            {!this.state.token && (
              <Route path="/login" component={LoginPage} exact/>
            )}
            
            {/* BEJELENTKEZETT FELHASZNÁLÓ: */}
            {this.state.token && <Redirect exact from="/" to="/home"/>}
            {this.state.token && <Redirect exact from="/login" to="/home"/>}
            {this.state.token && (
              <Route path="/home" component={HomePage} exact/>
            )}
            {this.state.token && (
              <Route path="/clients" component={ClientsPage} exact/>
            )}
            {this.state.token && (
              <Route path="/clients/:client_id" component={ClientPage} exact/>
            )}
            {this.state.token && (
              <Route path="/new_list" component={NewListPage} exact/>
            )}
            {this.state.token && (
              <Route path="/list" component={ListListPage} exact/>
            )}
            {this.state.token && (
              <Route path="/list/:list_id" component={ListPage} exact/>
            )}

            <Route component={ErrorPage}/>
            
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}
 
export default App;