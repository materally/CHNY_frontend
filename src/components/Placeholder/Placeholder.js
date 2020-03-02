import React, { Component } from 'react';
import { Placeholder } from 'semantic-ui-react'

class PlaceholderComponent extends Component {
    render() { 
        return ( 
            <Placeholder style={{ margin: '0 auto' }}>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder>
        );
    }
}
export default PlaceholderComponent;