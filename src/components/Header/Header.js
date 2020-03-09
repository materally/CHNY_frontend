import React, { Component } from 'react';
import { Container, Image, Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

import './Header.css';

class PageHeader extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = { 
        }
    }
    render(){
        return (
            <Menu secondary fixed='top' style={{ background: 'white', borderBottomWidth: 2, borderBottomColor: '#0276DE', borderBottomStyle: 'solid' }}>
                <Container>
                    <Menu.Item header style={{ paddingLeft: '0px' }}>
                        <Image size='medium' src={process.env.PUBLIC_URL + '/header.png'} />
                    </Menu.Item>

                    <Menu.Item as={Link} to="/"><Icon name='map marker' /> Térkép</Menu.Item>

                    <Menu.Item as={Link} to="/clients"><Icon name='users' /> Ügyféltörzs</Menu.Item>
                    <Menu.Item as={Link} to="/list"><Icon name='list' /> Karbantartási listák</Menu.Item>

                    <Menu.Item as='a' position='right' className='logoutMenuItem'><Icon name='sign-out' /></Menu.Item>
                </Container>
            </Menu>
        )
    }
}

 
export default PageHeader;