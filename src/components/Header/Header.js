import React, { Component } from 'react';
import { Container, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

class PageHeader extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = { 
        }
    }
    render(){
        return (
            <Menu fixed='top'>
                <Container>
                    <Menu.Item as='a' header>
                        <Image size='small' src={process.env.PUBLIC_URL + '/header.png'} />
                    </Menu.Item>

                    <Menu.Item as={Link} to="/">Térkép</Menu.Item>

                    <Menu.Item as={Link} to="/clients">Ügyféltörzs</Menu.Item>
                    <Menu.Item as={Link} to="/list">Karbantartási listák</Menu.Item>

                    <Menu.Item name='logout' as='a' onClick={ () => this.context.logout() }>Kijelentkezés</Menu.Item>
                </Container>
            </Menu>
        )
    }
}

 
export default PageHeader;