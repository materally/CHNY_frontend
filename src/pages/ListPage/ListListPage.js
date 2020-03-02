import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Header/Header';
import { Container, Header, Table } from 'semantic-ui-react';
import API, { API_SECRET } from '../../api';

class ListListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: []
        }
        this.getData()
    }

    getData(){
        API.get(`maintenance`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    render() { 
        return ( 
        <React.Fragment>
            <Container>
                <PageHeader />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Karbantartási listák</Header>
                </div>
               {
                   (this.state.data.length === 0) ? <h4>Még nincs karbantartási lista</h4> : 
                   <Table striped selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='1'>#</Table.HeaderCell>
                                <Table.HeaderCell>Munkatárs</Table.HeaderCell>
                                <Table.HeaderCell>Útvonal</Table.HeaderCell>
                                <Table.HeaderCell>Dátum</Table.HeaderCell>
                                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                this.state.data && this.state.data.map( (list, index ) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{list.list_id}</Table.Cell>
                                        <Table.Cell>{list.munkatars}</Table.Cell>
                                        <Table.Cell><a href={list.utvonal} target='_blank' rel='noopener noreferrer'>útvonal megtekintés</a></Table.Cell>
                                        <Table.Cell>{list.datum}</Table.Cell>
                                        <Table.Cell><Link to={`list/${list.list_id}`}>lista megtekintés</Link></Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
               } 
            </Container>
        </React.Fragment> );
    }
}
 
export default ListListPage;