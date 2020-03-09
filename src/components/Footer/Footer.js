import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react'

class PageFooter extends Component {
    render(){
        return (
            <Segment inverted vertical style={{  marginTop: '20px' }}>
                <Container textAlign='center' style={{ paddingTop: '10px', paddingBottom: '10px', }}>
                    <p>
                        <b>Kulcsar Solutions</b>
                    </p>
                </Container>
            </Segment>
        )
    }
} 
export default PageFooter;