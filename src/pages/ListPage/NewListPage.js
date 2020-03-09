import React, { Component } from 'react';
import PageHeader from '../../components/Header/Header';
import { Container, Form, Header, Divider, Table, Button } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import API, { API_SECRET } from '../../api';
import Swal from 'sweetalert2';

class NewListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          list: this.props.location.state,
          munkatars: '',
          megjegyzes: '',
          megjegyzes_munkatars: '',
          utvonal: '',
          saveListBtn: true,
          newId: -1
        }
        this.handleChange = this.handleChange.bind(this);
        this.checkListIsEmpty()
    }

    UNSAFE_componentWillMount(){
        this.createUtvonalURI()
    }

    checkListIsEmpty(){
        return !this.state.list || this.state.list.length === 0 ? this.props.history.push("/home") : null
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    createUtvonalURI(){
        //%7C - separator
        const ch_latitude = 47.3872843;
        const ch_longitude = 21.8680197;
        let uri = 'https://www.google.com/maps/dir/?api=1&'

        uri += 'origin='+ch_latitude+','+ch_longitude+'&destination='+ch_latitude+','+ch_longitude+'&travelmode=driving&waypoints='
        this.state.list && this.state.list.map( (list, index ) => (
            uri += list.kamra_latitude+','+list.kamra_longitude+'%7C'
        ));
        uri = uri.slice(0, -3);  

        this.setState({ utvonal: uri })
        return
    }

    redirectMap(){
        window.open(this.state.utvonal, "_blank")
        return
    }

    renderButtons(){
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    color='blue'
                    icon='save'
                    labelPosition='right'
                    content="Lista mentése"
                    onClick={ () => this.saveList() }
                    disabled={!this.state.saveListBtn}
                    loading={!this.state.saveListBtn}
                />
            </div>
        ) 
    }

    saveList(){
        const { munkatars, megjegyzes, megjegyzes_munkatars, utvonal } = this.state;
        const list = JSON.stringify(this.state.list)

        this.setState({ saveListBtn: false })

        if(munkatars.trim().length === 0){
            this.setState({ saveListBtn: true }, () => {
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
            this.setState({ saveListBtn: false })
        }
        
        API.post('maintenance/createlist/', 'list='+list+'&munkatars='+encodeURIComponent(munkatars)+'&megjegyzes='+encodeURIComponent(megjegyzes)+'&megjegyzes_munkatars='+encodeURIComponent(megjegyzes_munkatars)+'&utvonal='+encodeURIComponent(utvonal)+'&API_SECRET='+API_SECRET)
        .then(res => {
            console.log(res)
            var response = res.data;
            if(response.error){
                this.setState({ saveListBtn: true }, () => {
                    Swal.fire({
                        title: 'Hiba',
                        text: response.error,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2000
                    })
                });
                return;
            }
            if(response.success){
                this.setState({ saveListBtn: true, list: [] }, () => {
                    this.props.history.push("/list/"+response.list_id)
                })
            }
        })
        .catch(error => {
            this.setState({ saveListBtn: true }, () => {
                Swal.fire({
                    title: 'Hiba',
                    text: 'Hiba a szerver oldalon!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000
                })
            });
        });

    }

    render() { 
        return ( 
        <React.Fragment>
            <Container>
                <PageHeader />
                <p style={{ marginTop: '6em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Új lista</Header>
                </div>
                <Divider horizontal>
                    <Header as='h4'>
                        Adatok
                    </Header>
                </Divider>
                <Form>
                    <Form.Field required>
                        <label>Munkatárs</label>
                        <input placeholder='Munkatárs' name='munkatars' value={this.state.munkatars} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field 
                        control={TextareaAutosize}
                        label="Belső megjegyzés"
                        placeholder="Belső megjegyzés"
                        onChange={this.handleChange}
                        useCacheForDOMMeasurements
                        value={this.state.megjegyzes}
                        name='megjegyzes'
                    />
                    <Form.Field 
                        control={TextareaAutosize}
                        label="Megjegyzés a munkatársnak"
                        placeholder="Megjegyzés a munkatársnak"
                        onChange={this.handleChange}
                        useCacheForDOMMeasurements
                        value={this.state.megjegyzes_munkatars}
                        name='megjegyzes_munkatars'
                    />
                </Form>
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
                            <Table.HeaderCell>Kamra koordinátái</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.list && this.state.list.map( (list, index ) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{list.cegnev}</Table.Cell>
                                    <Table.Cell>{list.kapcs_nev} ({list.kapcs_telefon})</Table.Cell>
                                    <Table.Cell>{list.kamra_cim}</Table.Cell>
                                    <Table.Cell>{list.kamra_latitude}, {list.kamra_longitude}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>

                {this.renderButtons()}

            </Container>
        </React.Fragment> );
    }
}
 
export default NewListPage;