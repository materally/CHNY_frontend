import React, { Component } from 'react';
import PageHeader from '../../components/Header/Header';
import { Container, Header, Divider, Table, Button } from 'semantic-ui-react';
import API, { API_SECRET } from '../../api';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import PageFooter from '../../components/Footer/Footer';

class ListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          list_id: this.props.match.params.list_id,
          data: [],
          list: []
        }
        this.getData()
        this.checkListIsEmpty()
    }

    getData(){
        API.get(`maintenance/${this.state.list_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ list: response.maintenances, data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    checkListIsEmpty(){
        return !this.state.list_id ? this.props.history.push("/home") : null
    }

    redirectMap(){
        window.open(this.state.data.utvonal, "_blank")
        return
    }

    openPDF(){
        window.open(this.state.data.pdf, "_blank")
        return
    }

    renderButtons(){
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    color='blue'
                    icon='file pdf'
                    labelPosition='left'
                    content="PDF megtekintés"
                    onClick={ () => this.openPDF() }
                />
                <Button
                    color='blue'
                    icon='map'
                    labelPosition='right'
                    content="Útvonaltervezés"
                    onClick={ () => this.redirectMap() }
                />
            </div>
        ) 
    }

    render() {
        return(
        <div className="Site">
            <Container className="Site-content">
                <PageHeader />
                <p style={{ marginTop: '6em' }}></p>
                {
                    (this.state.data.length === 0) ? <PlaceholderComponent /> : 
                    <React.Fragment>
                        <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/list") } />
                        <Divider horizontal>
                            <Header as='h4'>
                                Adatok
                            </Header>
                        </Divider>
                        <div>
                            <Header sub as='h5'>Munkatárs</Header>
                            <span>{this.state.data.munkatars}</span>
                            <Header sub as='h5'>Dátum</Header>
                            <span>{this.state.data.datum}</span>
                            <Header sub as='h5'>Belső megjegyzés</Header>
                            <span>{this.state.data.megjegyzes}</span>
                            <Header sub as='h5'>Megjegyzés munkatársnak</Header>
                            <span>{this.state.data.megjegyzes_munkatars}</span>

                        </div>
                        <Divider horizontal>
                            <Header as='h4'>
                                Lista
                            </Header>
                        </Divider>
                        
                        <Table celled striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Cégnév</Table.HeaderCell>
                                    <Table.HeaderCell>Kapcsolattartó</Table.HeaderCell>
                                    <Table.HeaderCell>Kamra címe</Table.HeaderCell>
                                    <Table.HeaderCell>GPS koordináták</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    this.state.list && this.state.list.map( (list, index ) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{list.client.cegnev}</Table.Cell>
                                            <Table.Cell>{list.client.kapcs_nev} ({list.client.kapcs_telefon})</Table.Cell>
                                            <Table.Cell>{list.client.kamra_cim}</Table.Cell>
                                            <Table.Cell>{list.client.kamra_latitude}, {list.client.kamra_longitude}</Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                    {this.renderButtons()}
                </React.Fragment>
                }
            </Container>
            <PageFooter />
        </div> 
        )
    }
}
 
export default ListPage;