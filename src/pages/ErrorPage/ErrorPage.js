import React, { Component } from 'react';

/* import PageHeader from '../../components/Header/Header'; */
import { Container, Message } from 'semantic-ui-react';

class ErrorPage extends Component {
  render() { 
    return ( 
    <React.Fragment>
        {/* <PageHeader /> */}
        <Container style={{ marginTop: '7em' }}>
            <Message negative>
                <Message.Header>Hiba!</Message.Header>
                <p>A keresett oldal nem található!</p>
            </Message>
        </Container>
    </React.Fragment> );
  }
}
 
export default ErrorPage;