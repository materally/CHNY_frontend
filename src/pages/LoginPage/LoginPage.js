import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import LoaderScreen from '../../components/LoaderScreen/LoaderScreen';
import AuthContext from '../../context/auth-context';

class LoginPage extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = { 
        inputEmail: '',
        inputPassword: '',
        messageHidden: true,
        messageTextEmail: '',
        messageTextPassword: '',
        submitBtn: true,
        loading: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.setState({ loading: false })
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event){
    this.setState({ submitBtn: false, loading: true })
    const email = this.state.inputEmail;
    const password = this.state.inputPassword;

      if(email.trim().length === 0 || password.trim().length === 0){
          this.setState({ messageHidden: false, messageText: 'Minden mező kitöltése kötelező!', submitBtn: true, loading: false });
          return;
      }else{
          this.setState({ messageHidden: true, messageText: '', submitBtn: false })
      }

    API.post(`users/login/${email}/${password}`, 'API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.data;
            var email = response.email;
            var user_id = response.user_id;
            var token = response.token;
            var scope = response.scope;
            var name = response.name;
            if(response.error){
                this.setState({ messageHidden: false, messageText: response.error, loading: false, submitBtn: true });
                return;
            }
            if(token){
                this.context.login(email, user_id, token, scope, name)
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('email', email);
                localStorage.setItem('scope', scope);
                localStorage.setItem('name', name);
            }
            
        })
        .catch(error => {
            this.setState({ messageHidden: false, messageText: 'A szerverrel valamilyen probléma történt!', submitBtn: true, loading: false });
            return;
        });
    
        this.setState({ loading: false })
    event.preventDefault();
  }

  render() { 
    return ( 
        <React.Fragment>
            <LoaderScreen loading={this.state.loading}/>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header textAlign='center'>
                    <Image src={process.env.PUBLIC_URL + '/header.png'} style={{ width: '100vh' }}/>
                </Header>
                <Header as='h2' color='blue' textAlign='center'>
                    Nyilvántartó bejelentkezés
                </Header>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail cím' name='inputEmail' value={this.state.inputEmail} onChange={this.handleChange} />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Jelszó'
                        type='password'
                        name='inputPassword'
                        value={this.state.inputPassword} 
                        onChange={this.handleChange}
                    />
                    <Button color='blue' fluid size='large' type='submit' disabled={!this.state.submitBtn}>
                        Bejelentkezés
                    </Button>
                    </Segment>
                </Form>
                <Message color='red' hidden={this.state.messageHidden}>
                    <b>Hiba!</b> <br />
                    {this.state.messageText}
                </Message>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
  }
}
 
export default LoginPage;