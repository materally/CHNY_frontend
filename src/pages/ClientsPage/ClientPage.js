import React, { Component } from 'react';
import { Container, Button, Tab, Card, Icon, Form, Table, Confirm, Popup } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import Swal from 'sweetalert2';

import PageHeader from '../../components/Header/Header';
import '../../components/Font.css';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import EditMaintenanceModal from './EditMaintenanceModal';
import NewMaintenanceModal from './NewMaintenanceModal';
import PageFooter from '../../components/Footer/Footer';

class ClientPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        client_id: this.props.match.params.client_id,
        data: [],
        cegnev: '',
        szekhely: '',
        szamlazasi_cim: '',
        kapcs_nev: '',
        kapcs_telefon: '',
        kapcs_email: '',
        kamra_latitude: 0,
        kamra_longitude: 0,
        kamra_cim: '',
        saveHutokamraBtn: true,
        saveClientBtn: true,
        buttonLoader: false,
        editMaintenanceId: 0,
        openModalEditMaintenance: false,
        editMaintenance: [],
        deleteMaintenanceConfirmWindow: false,
        deleteMaintenanceId: 0,
        openModalNewMaintenance: false,
        confirmDelete: false,
        deleteClientBtn: true,

        checkedConfirm: false,
        checkedId: 0
    }
    this.getData();
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }

  closeModalMaintenance = () => {
    this.setState({ openModalEditMaintenance: false, openModalNewMaintenance: false });
  }

  getData(){
    API.get(`clients/${this.state.client_id}`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
          this.setState({ data: response, kamra_latitude: response.kamra_latitude, kamra_longitude: response.kamra_longitude, kamra_cim: response.kamra_cim, utolso_karbantartas: response.utolso_karbantartas, cegnev: response.cegnev, szekhely: response.szekhely, szamlazasi_cim: response.szamlazasi_cim, kapcs_nev: response.kapcs_nev,  kapcs_telefon: response.kapcs_telefon, kapcs_email: response.kapcs_email});
        }else{
          this.backToClients()
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  backToClients(){
    this.props.history.push("/clients");
  }

  pageInfo(){
    return(  
      <Card.Group>
        <Card color='blue'>
          <Card.Content>
            <Card.Header>{this.state.data.cegnev}</Card.Header>
            <Card.Description><b>Székhely:</b> {this.state.data.szekhely}</Card.Description>
            <Card.Description><b>Számlázási cím:</b> {this.state.data.szamlazasi_cim}</Card.Description>
          </Card.Content>
        </Card>
        <Card color='blue'>
          <Card.Content>
            <Card.Header>Kapcsolattartó</Card.Header>
            <Card.Description style={{ paddingBottom: '10px' }}><b>{this.state.data.kapcs_nev}</b></Card.Description>
            <Card.Description><Icon name='mail' /> {this.state.data.kapcs_email}</Card.Description>
            <Card.Description><Icon name='phone' /> {this.state.data.kapcs_telefon}</Card.Description>
          </Card.Content>
        </Card>
        <Card color='blue'>
          <Card.Content>
            <Card.Header>Hűtőkamra</Card.Header>
            <Card.Meta><b>Utolsó karbantartás: </b>{this.state.data.utolso_karbantartas}</Card.Meta>
            <Card.Meta><b>Következő karbantartás: </b>{this.state.data.kovetkezo_karbantartas}</Card.Meta>
            <Card.Description><Icon name='point' /><b>{this.state.data.kamra_cim}</b></Card.Description>
            <Card.Description><Icon name='pin' /> {this.state.data.kamra_latitude}</Card.Description>
            <Card.Description><Icon name='pin' /> {this.state.data.kamra_longitude}</Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    )
  }

  saveClient(){
    this.setState({ saveClientBtn: false, buttonLoader: true })
    const { cegnev, szekhely, szamlazasi_cim, kapcs_nev, kapcs_email, kapcs_telefon } = this.state;
    if(cegnev.trim().length === 0 || szekhely.trim().length === 0 || szamlazasi_cim.trim().length === 0){
        this.setState({ saveClientBtn: true, buttonLoader: false }, () => {
          Swal.fire({
            title: 'Hiba',
            text: 'A csillaggal jelölt mezők kitöltése kötelező!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
          })
        });
        return;
    }else{
        this.setState({ saveClientBtn: false })
    }
    API.post('clients/updateClient/'+this.state.client_id, 'cegnev='+encodeURIComponent(cegnev)+'&szekhely='+encodeURIComponent(szekhely)+'&szamlazasi_cim='+encodeURIComponent(szamlazasi_cim)+'&kapcs_nev='+encodeURIComponent(kapcs_nev)+'&kapcs_email='+encodeURIComponent(kapcs_email)+'&kapcs_telefon='+encodeURIComponent(kapcs_telefon)+'&API_SECRET='+API_SECRET)
      .then(res => {
        var response = res.data
        if(response.success){
          this.setState({ saveClientBtn: true, buttonLoader: false }, () => {
            this.getData();
            Swal.fire({
              title: 'Sikeres',
              text: response.success,
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            })
          })
          
        }else{
          this.setState({ saveClientBtn: true, buttonLoader: false }, () => {
            Swal.fire({
              title: 'Hiba',
              text: response.error,
              icon: 'error',
              showConfirmButton: false,
              timer: 2000
            })
          });
        }  
      })
      .catch(error => {
          this.setState({ saveClientBtn: true, buttonLoader: false }, () => console.log(error));
      });
  }

  deleteClient(){
    API.post('clients/delete/', 'client_id='+this.state.client_id+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        if(response.success){
          this.backToClients()
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  pageBeallitasok(){
    return (
      <React.Fragment>
        <Form>
          <Form.Field required>
              <label>Cégnév</label>
              <input placeholder='Cégnév' name='cegnev' value={this.state.cegnev} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field required>
              <label>Székhely</label>
              <input placeholder='Székhely' name='szekhely' value={this.state.szekhely} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field required>
              <label>Számlázási cím</label>
              <input placeholder='Számlázási cím' name='szamlazasi_cim' value={this.state.szamlazasi_cim} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
              <label>Kapcsolattartó neve</label>
              <input placeholder='Kapcsolattartó neve' name='kapcs_nev' value={this.state.kapcs_nev} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
              <label>Kapcsolattartó telefonszáma</label>
              <input placeholder='Kapcsolattartó telefonszáma' name='kapcs_telefon' value={this.state.kapcs_telefon} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
              <label>Kapcsolattartó e-mail címe</label>
              <input placeholder='Kapcsolattartó e-mail címe' name='kapcs_email' value={this.state.kapcs_email} onChange={this.handleChange}/>
          </Form.Field>
          <div style={{ textAlign: 'center' }}>
          <Button type='submit'
                    color='red'
                    icon='trash'
                    labelPosition='left'
                    content="Ügyfél törlése"
                    onClick={ () => this.setState({ confirmDelete: true }) }
                    disabled={!this.state.deleteClientBtn}
                    loading={!this.state.deleteClientBtn}
            />
            <Button type='submit'
                    color='blue'
                    icon='save'
                    labelPosition='right'
                    content="Módosítások mentése"
                    onClick={ () => this.saveClient() }
                    disabled={!this.state.saveClientBtn}
                    loading={this.state.buttonLoader}
            />
          </div>
      </Form>
    </React.Fragment>
    )
  }

  saveHutokamra(){
    this.setState({ saveHutokamraBtn: false, buttonLoader: true })
    const { kamra_latitude, kamra_longitude, kamra_cim } = this.state;
    if(kamra_latitude.trim().length === 0 || kamra_longitude.trim().length === 0 || kamra_cim.trim().length === 0){
        this.setState({ saveHutokamraBtn: true, buttonLoader: false }, () => {
          Swal.fire({
            title: 'Hiba',
            text: 'A csillaggal jelölt mezők kitöltése kötelező!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
          })
        });
        return;
    }else{
        this.setState({ saveHutokamraBtn: false })
    }
    API.post('clients/updateHutokamra/'+this.state.client_id, 'kamra_cim='+encodeURIComponent(kamra_cim)+'&kamra_latitude='+kamra_latitude+'&kamra_longitude='+kamra_longitude+'&API_SECRET='+API_SECRET)
      .then(res => {
        var response = res.data
        if(response.success){
          this.setState({ saveHutokamraBtn: true, buttonLoader: false }, () => {
            this.getData();
            Swal.fire({
              title: 'Sikeres',
              text: response.success,
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            })
          })
          
        }else{
          this.setState({ messageHidden: false, messageText: res.error, saveHutokamraBtn: true, buttonLoader: false }, () => {
            Swal.fire({
              title: 'Hiba',
              text: response.error,
              icon: 'error',
              showConfirmButton: false,
              timer: 2000
            })
          });
        }  
      })
      .catch(error => {
          this.setState({ saveHutokamraBtn: true, buttonLoader: false }, () => console.log(error));
      });
  }

  pageHutokamra(){
    return (
      <React.Fragment>
        <Form style={{ paddingTop: '20px' }}>
          <Form.Group widths='equal'>
            <Form.Field required>
                <label>Földrajzi szélességi fok</label>
                <input placeholder='Földrajzi szélességi fok' name='kamra_latitude' value={this.state.kamra_latitude} onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field required>
                <label>Földrajzi hosszúsági fok</label>
                <input placeholder='Földrajzi hosszúsági fok' name='kamra_longitude' value={this.state.kamra_longitude} onChange={this.handleChange}/>
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field required>
                <label>Kamra címe</label>
                <input placeholder='Kamra címe' name='kamra_cim' value={this.state.kamra_cim} onChange={this.handleChange}/>
            </Form.Field>
          </Form.Group>
          <div style={{ textAlign: 'center' }}>
            <Button type='submit'
                    color='blue'
                    icon='save'
                    labelPosition='right'
                    content="Módosítások mentése"
                    onClick={ () => this.saveHutokamra() }
                    disabled={!this.state.saveHutokamraBtn}
                    loading={this.state.buttonLoader}
            />
          </div>
        </Form>
      </React.Fragment>
    )
  }

  deleteMaintenance(){
    API.post('maintenance/delete/', 'maintenance_id='+this.state.deleteMaintenanceId+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        if(response.success){
          this.setState({ deleteMaintenanceId: 0, deleteMaintenanceConfirmWindow: false }, () => this.getData());
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  checkedMaintenance(){
    API.post('maintenance/checked/'+this.state.checkedId, '&API_SECRET='+API_SECRET)
    .then(res => {
      console.log(res)
        var response = res.statusText;
        if(response === "OK"){
          this.setState({ checkedId: 0, checkedConfirm: false }, () => this.getData());
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  pageKarbantartasok(){
    return (
      <React.Fragment>
        {/* <Button floated='right' compact labelPosition='right' icon='plus square' color='green' content='Új karbantartás hozzáadása' onClick={ () => this.setState({ openModalNewMaintenance: !this.state.openModalNewMaintenance})  }/> */}
          {
            (this.state.data.client_maintenances.length !== 0) ? (
              <Table striped style={{ marginTop: '60px' }}>
                  <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Dátum</Table.HeaderCell>
                      <Table.HeaderCell>Elvégezve</Table.HeaderCell>
                      {/* <Table.HeaderCell>Munkatárs</Table.HeaderCell> */}
                      <Table.HeaderCell>Karbantartási listán</Table.HeaderCell>
                      <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                  </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      {
                          this.state.data.client_maintenances.map((maintenance) => (
                              <Table.Row key={maintenance.maintenance_id} style={{ backgroundColor: (maintenance.elvegezve === 0) ? 'antiquewhite' : 'darkseagreen' }}>
                                  <Table.Cell>{maintenance.datum}</Table.Cell>
                                  <Table.Cell>{maintenance.elvegezve_datum}</Table.Cell>
                                  {/* <Table.Cell>{maintenance.list_info.munkatars}</Table.Cell> */}
                                  <Table.Cell>
                                    {
                                      (maintenance.list_id !== -1) ? <a href={`../list/${maintenance.list_info.list_id}`}>lista megtekintés</a> : null
                                    }</Table.Cell>
                                  <Table.Cell style={{ textAlign: 'right' }}>
                                    {/* <Icon link name='edit' color='blue' onClick={ () => this.setState({ editMaintenanceId: maintenance.maintenance_id, openModalEditMaintenance: true, editMaintenance: maintenance }) }/> */}
                                    {/* <Icon link name='trash' color='red' onClick={ () => this.setState({ deleteMaintenanceConfirmWindow: true, deleteMaintenanceId: maintenance.maintenance_id }) }/> */}
                                    {
                                      (maintenance.elvegezve === 0) ? <Popup content='Karbantartás elvégezve' trigger={<Button icon='check' className="green" onClick={ () => this.setState({ checkedConfirm: true, checkedId: maintenance.maintenance_id }) }/>} /> : null
                                    }
                                    
                                  </Table.Cell>
                              </Table.Row>
                          ))
                      }
                  </Table.Body>
              </Table>
          ) : <h1>Még nincs karbantartás!</h1>
        }
      </React.Fragment>
    )
  }

  renderInfo(){
    const menus = [
      {
        menuItem: 'Információk',
        render: () => this.pageInfo(),
      },
      {
        menuItem: 'Hűtőkamra',
        render: () => this.pageHutokamra(),
      },
      {
        menuItem: 'Karbantartások',
        render: () => this.pageKarbantartasok(),
      },
      {
        menuItem: 'Beállítások',
        render: () => this.pageBeallitasok(),
      }
    ]
    return (
    <React.Fragment>
      <h1 className='CH_Font_Title' style={{ marginTop: '6px' }}>{this.state.data.cegnev}</h1>
      <Tab menu={{ secondary: true, pointing: true }} panes={menus}/>
    </React.Fragment>
    )
  }

  render() { 
    return ( 
      <div className="Site">
      <Container className="Site-content">
        <PageHeader />
        <p style={{ marginTop: '6em' }}></p>
        <Icon name='chevron circle left' size='large' color='blue' onClick={ () => this.backToClients() } className='hoverEffect'/>
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          {(this.state.data.length !== 0) ? this.renderInfo() : <PlaceholderComponent /> }
        </div>

        <NewMaintenanceModal 
          openModal={this.state.openModalNewMaintenance} 
          closeModal={this.closeModalMaintenance} 
          getData={() => this.getData()} 
          client_id={this.state.client_id}
        />

        <EditMaintenanceModal 
          openModal={this.state.openModalEditMaintenance} 
          closeModal={this.closeModalMaintenance} 
          getData={() => this.getData()} 
          maintenance_id={this.state.editMaintenanceId} 
          maintenance={this.state.editMaintenance}
        />

        <Confirm
          content='Biztos vagy benne? A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.deleteMaintenanceConfirmWindow}
          onCancel={ () => this.setState({ deleteMaintenanceConfirmWindow: false }) }
          onConfirm={ () => this.deleteMaintenance() }
        />

        <Confirm
          content='Biztos vagy benne? A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.confirmDelete}
          onCancel={ () => this.setState({ confirmDelete: false }) }
          onConfirm={ () => this.deleteClient() }
        />

        <Confirm
          content='Biztos vagy benne? A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.checkedConfirm}
          onCancel={ () => this.setState({ checkedConfirm: false }) }
          onConfirm={ () => this.checkedMaintenance() }
        />

      </Container>
      <PageFooter />
      </div>
    );
  }
}
 
export default ClientPage;