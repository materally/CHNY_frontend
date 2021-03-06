import React, { Component } from 'react';
import { Container, Table, Header, Button, Input } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeader from '../../components/Header/Header';
import PageFooter from '../../components/Footer/Footer';
import '../../components/Footer/Footer.css';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import '../../components/Font.css';

import './ClientsPage.css';
import NewClientModal from '../../components/NewClientModal/NewClientModal';

class ClientsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        query: '',
        data: [],
        loadingPage: true,
        filteredData: [],
        openModal: false,
        loading: false
    }
    this.getData();
  }

  getData(){
    API.get(`clients`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            const { query } = this.state;
            const filteredData = response.filter(element => {
              return element.cegnev.toLowerCase().includes(query.toLowerCase());
            });
            this.setState({ data: response, filteredData: filteredData, loadingPage: false });
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  selectClient = (client_id) =>{
    this.props.history.push("/clients/"+client_id);
  }

  closeModal = () => {
    this.setState({ openModal: false });
  }

  handleInputChange = event => {
    this.setState({ loading: true })
    const query = event.target.value;
    this.setState(prevState => {
      const filteredData = prevState.data.filter(element => {
        return element.cegnev.toLowerCase().includes(query.toLowerCase());
      });
      return {
        query,
        filteredData
      };
    }, () => this.setState({ loading: false }));
  };

  renderList(){
    return (
      <React.Fragment>
        <Input style={{ width: '100%', marginTop: '20px' }} loading={this.state.loading} icon='search' placeholder='Keresés...' value={this.state.query} onChange={this.handleInputChange}/>
        <Table striped selectable>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Cégnév</Table.HeaderCell>
                <Table.HeaderCell>Számlázási cím</Table.HeaderCell>
                <Table.HeaderCell>Kamra címe</Table.HeaderCell>
                <Table.HeaderCell>Utolsó karbantartás</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.state.filteredData.map((client) => {
                        const count = client.client_maintenances.length;
                        const utolso_karbantartas = (count === 1) ? client.client_maintenances[0].datum : client.client_maintenances[1].datum
                        return <Table.Row key={client.client_id} onClick={ () => this.selectClient(client.client_id) } className="stripedTableTr">
                            <Table.Cell>{client.cegnev}</Table.Cell>
                            <Table.Cell>{client.szamlazasi_cim}</Table.Cell>
                            <Table.Cell>{client.kamra_cim}</Table.Cell>
                            <Table.Cell>{utolso_karbantartas}</Table.Cell>
                        </Table.Row>
                  })
                }
            </Table.Body>
        </Table>
      </React.Fragment>
    )
  }

  renderInit(){
    if(this.state.loadingPage && this.state.data.length === 0){
      return <PlaceholderComponent />
    }else if(!this.state.loadingPage && this.state.data.length === 0){
      return <h4>Még nincs ügyfél!</h4>
    }else{
      return this.renderList()
    }
  }

  render() { 
    return ( 
      <div className="Site">
        <Container className="Site-content">
          <PageHeader />
          <p style={{ marginTop: '6em' }}></p>
          <div style={{ paddingBottom: '3em' }}>
              <Header as='h2' floated='left' className='CH_Font_Title'>Ügyféltörzs</Header>
              <Button floated='right' compact labelPosition='right' icon='plus square' content='Új ügyfél létrehozása' color='blue' onClick={ () => this.setState({ openModal: !this.state.openModal})  } />
          </div>
          { this.renderInit() }
          
          <NewClientModal openModal={this.state.openModal} closeModal={this.closeModal} getData={() => this.getData() }/>
        </Container>
        <PageFooter />
      </div>
    );
  }
}
 
export default ClientsPage;