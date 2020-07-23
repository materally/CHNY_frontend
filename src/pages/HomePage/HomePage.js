import React, { Component } from 'react';
import { Container, Button, Card, List, Icon } from 'semantic-ui-react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import API, { API_SECRET } from '../../api';
import Swal from 'sweetalert2';

import './HomePage.css';
import Pin from './Pin';

import PageHeader from '../../components/Header/Header';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      markers: [],
      viewport:{
        latitude: 47.21849190883823,
        longitude: 19.709870195569575,
        width: '100vw',
        height: '100vh',
        zoom: 6.546771844321635
      },
      popupInfo: null,
      list: []
     }
     this.getData();
  }

  getData(){
    API.get(`clients/getMarkersForMap`)
    .then(res => {
        var response = res.data;
        if(response){
          this.setState({ markers: response })
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  _onClickMarker = marker => {
    this.setState({ popupInfo: marker });
  };

  addItemToList(item){
    if(this.state.list.includes(item)){
      Swal.fire({
        title: 'Hiba',
        text: 'Már listán van!',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      this.state.markers.find(someobject => someobject.data.client_id === item.client_id).fill = "#09b500"
      this.setState({
        list: [...this.state.list, item],
        popupInfo: null
      });
    }
  }

  removeItemFromList(i, item) {
    const list = this.state.list;
    list.splice(i, 1);
    this.setState({ list });
    const original_fill = this.state.markers.find(someobject => someobject.data.client_id === item.client_id).original_fill
    this.state.markers.find(someobject => someobject.data.client_id === item.client_id).fill = original_fill
  }

  _renderPopup() {
    const {popupInfo} = this.state;
    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={parseFloat(popupInfo.data.kamra_longitude)}
          latitude={parseFloat(popupInfo.data.kamra_latitude)}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: null})}
        >
          <div style={{ marginTop: '10px' }}>
            <Card>
              <Card.Content>
                <Card.Header>{popupInfo.data.cegnev}</Card.Header>
                <Card.Meta>Utolsó karbantartás: {popupInfo.utolso_karbantartas.datum}</Card.Meta>
                <Card.Meta>Következő karbantartás: {popupInfo.kovetkezo_karbantartas}</Card.Meta>
                <Card.Description><b>Kamra címe: </b>{popupInfo.data.kamra_cim}</Card.Description>
              </Card.Content>
              <Card.Content extra style={{ textAlign: 'right' }}>
                <Button
                    color='blue'
                    compact
                    size='mini'
                    icon='plus'
                    labelPosition='right'
                    content="Listához ad"
                    type='submit' 
                    onClick={ () => this.addItemToList(popupInfo.data) }
                />
              </Card.Content>
            </Card>
          </div>
        </Popup>
      )
    );
  }

  goToListPage(){
    this.props.history.push({ pathname: "/new_list", state: this.state.list});
  }

  _renderList(){
    return (
    <React.Fragment>
      {
        this.state.list.map((listItem, i) => (
          <List key={listItem.client_id}>
            <List.Item>
              <Icon name='trash alternate outline' className='cursorHover' color='red' onClick={ () => this.removeItemFromList(i, listItem) } />
              <List.Content>
                <List.Header>{listItem.cegnev}</List.Header>
                <List.Description>{listItem.kamra_cim}</List.Description>
              </List.Content>
            </List.Item>
          </List>
        ))
      }
      <div style={{ textAlign: 'center' }}>
        <Button color='grey' compact onClick={ () => { this.setState({ list: [] }); this.getData() } }>Lista ürítése</Button>
        <Button
            color='blue'
            compact
            icon='arrow circle right'
            labelPosition='right'
            content="Lista létrehozása"
            type='submit' 
            onClick={ () => this.goToListPage() }
        />
      </div>
    </React.Fragment>
    )
  }

  render() {
    return ( 
      <React.Fragment> 
        <Container style={{ marginBottom:'100px' }}>
          <PageHeader /> 
        </Container>
        <div style={{width: '70%', height: '600px', position: 'relative', borderColor: '#0076DE', borderWidth: '1px', borderStyle: 'solid', float: 'left'}}>
          <div style={{ position: 'absolute', width:'100%', height: '100%', borderColor: '#0076DE', borderWidth: '1px', borderStyle: 'solid' }}>
            <ReactMapGL 
              {...this.state.viewport} 
              mapboxApiAccessToken="pk.eyJ1IjoibWF0ZXJhbGx5IiwiYSI6ImNrNjBlaDM5NjA2cGgzbHM2bXFxajY2a24ifQ.6U7YnT4vRVZfDt5iw1ZDlQ"
              onViewportChange={(viewport) => this.setState({viewport})}
              mapStyle="mapbox://styles/materally/ck60erobe3ppz1int84raxjta"
              width="100%"
              height="100%"
            >
              {
                this.state.markers.map( marker => {
                  return (
                  <Marker
                    key={marker.data.client_id}
                    longitude={parseFloat(marker.data.kamra_longitude)}
                    latitude={parseFloat(marker.data.kamra_latitude)}
                  >
                    <Pin onClick={() => this._onClickMarker(marker)} fill={marker.fill} />
                  </Marker>
                  )
                  })
              }
              {this._renderPopup()}
            </ReactMapGL>
          </div>
        </div>
        <div style={{ float:'right', borderLeftColor: '#d6d6d6', borderLeftWidth: '1px', borderLeftStyle: 'solid', padding: '10px', width:'29%', backgroundColor: 'white'}}>
          <h4>Karbantartási listára kijelölve:</h4>
          {
            (this.state.list.length > 0) ? this._renderList() : <h5>Még nincs kijelölt hűtőkamra!</h5>
          }
        </div>
      </React.Fragment>
    );
  }
}
 
export default HomePage;