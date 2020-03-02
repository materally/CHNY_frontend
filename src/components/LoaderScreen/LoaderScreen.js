import React, { Component } from 'react';
import './LoaderScreen.css';

class LoaderScreen extends Component {
    render() { 
        return ( 
            <div className="loading" style={{ display: (this.props.loading) ? 'block' : 'none' }}>
                <div className="lds-dual-ring"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        );
    }
}
export default LoaderScreen;