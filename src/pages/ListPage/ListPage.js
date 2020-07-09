import React, { Component } from 'react';
import PageHeader from '../../components/Header/Header';
import { Container, Header, Divider, Table, Button, Confirm, Popup, Icon, Input, TextArea, Label } from 'semantic-ui-react';
import API, { API_SECRET } from '../../api';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import PageFooter from '../../components/Footer/Footer';

class ListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          list_id: this.props.match.params.list_id,
          data: [],
          list: [],
          checkedConfirm: false,
          checkedId: 0,
          deleteFromList: false,
          deleteId: 0,

          editMunkatars: false,
          munkatars: '',
          editBelso: false,
          megjegyzes: '',
          editMegjegyzesMunkatars: false,
          megjegyzes_munkatars: '',

          searchIsLoading: false,
          source: [],
          searchValue: '',
          results:[],
          utvonal: ''
        }
        this.getAll();
        this.getData();
        this.checkListIsEmpty();
        this.handleChange = this.handleChange.bind(this);
    }

    createUtvonalURI(){
        //%7C - separator
        const ch_latitude = 47.3872843;
        const ch_longitude = 21.8680197;
        let uri = 'https://www.google.com/maps/dir/?api=1&'

        uri += 'origin='+ch_latitude+','+ch_longitude+'&destination='+ch_latitude+','+ch_longitude+'&travelmode=driving&waypoints='
        this.state.list && this.state.list.map( (list, index ) => (
            uri += list.client.kamra_latitude+','+list.client.kamra_longitude+'%7C'
        ));
        uri = uri.slice(0, -3);  

        API.post('maintenance/updateMap/'+this.state.list_id, 'utvonal='+encodeURIComponent(uri)+'&API_SECRET='+API_SECRET)
        .then(res => {
            this.redirectMap(uri)
        })
        .catch(error => {
            console.log(error)
        }); 
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

    getAll(){
        API.get(`clients`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ source: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    checkListIsEmpty(){
        return !this.state.list_id ? this.props.history.push("/home") : null
    }

    redirectMap(uri){
        window.open(uri, "_blank")
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
                    content="PDF készítése"
                    onClick={ () => this.openPDF() }
                />
                <Button
                    color='blue'
                    icon='map'
                    labelPosition='right'
                    content="Útvonaltervezés"
                    onClick={ () => this.createUtvonalURI() }
                />
            </div>
        ) 
    }

    checkedMaintenance(){
        API.post('maintenance/checked/'+this.state.checkedId, '&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
              this.setState({ checkedId: 0, checkedConfirm: false }, () => this.getData());
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    deleteFromList(){
        API.post('maintenance/deletefromlist/'+this.state.deleteId, 'list_id='+this.state.list_id+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
              this.setState({ deleteId: 0, deleteFromList: false }, () => this.getData());
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    saveMunkatars(){
        if(this.state.munkatars === '') return;
        API.post('maintenance/updateMunkatars/'+this.state.list_id, 'munkatars='+encodeURIComponent(this.state.munkatars)+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
              this.setState({ editMunkatars: false }, () => this.getData());
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    saveBelso(){
        API.post('maintenance/updateBelso/'+this.state.list_id, 'megjegyzes='+encodeURIComponent(this.state.megjegyzes)+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
              this.setState({ editBelso: false }, () => this.getData());
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    saveMegjegyzesMunkatars(){
        API.post('maintenance/updateMegjegyzesMunkatars/'+this.state.list_id, 'megjegyzes_munkatars='+encodeURIComponent(this.state.megjegyzes_munkatars)+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
              this.setState({ editMegjegyzesMunkatars: false }, () => this.getData());
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ searchIsLoading: true, searchValue: value })
        const query = value;
        this.setState(prevState => {
            const filteredData = prevState.source.filter(element => {
                return element.cegnev.toLowerCase().includes(query.toLowerCase());
            });
            return {
                query,
                results: filteredData
            };
        }, () => this.setState({ searchIsLoading: false }));
    }

    addToList(client_id){
        API.post('maintenance/addToList/'+this.state.list_id, 'client_id='+client_id+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.statusText;
            if(response === "OK"){
                this.getData();
                this.setState({ results: [], searchValue: '' })
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    render() {
        return(
        <div className="Site">
            <Container className="Site-content">
                <PageHeader />
                <p style={{ marginTop: '6em' }}></p>
                {
                    (this.state.data.length === 0) ? <PlaceholderComponent /> :  
                    <div style={{ backgroundColor: 'white', padding: '20px' }}>
                        <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/list") } />
                        <Divider horizontal>
                            <Header as='h4'>
                                Adatok
                            </Header>
                        </Divider>
                        <div>
                            <Header sub as='h5'>Munkatárs <Icon name="edit" size="mini" className='hoverEffect' onClick={ () => this.setState({ editMunkatars: true, munkatars: this.state.data.munkatars }) }/></Header>
                            <span>
                                {
                                    (this.state.editMunkatars) ? <><Input value={this.state.munkatars} onChange={this.handleChange} name="munkatars" placeholder="Munkatárs" /> <Button color="green" icon="save" onClick={ () => this.saveMunkatars() }/></> : this.state.data.munkatars
                                }
                            </span>

                            <Header sub as='h5'>Dátum</Header>
                            <span>{this.state.data.datum}</span>

                            <Header sub as='h5'>Belső megjegyzés <Icon name="edit" size="mini" className='hoverEffect' onClick={ () => this.setState({ editBelso: true, megjegyzes: this.state.data.megjegyzes }) }/></Header>
                            <span>
                                {
                                    (this.state.editBelso) ? <><TextArea placeholder='Belső megjegyzés' name='megjegyzes' value={this.state.megjegyzes} onChange={this.handleChange} /> <Button color="green" icon="save" onClick={ () => this.saveBelso() }/></> : this.state.data.megjegyzes
                                }
                            </span>

                            <Header sub as='h5'>Megjegyzés munkatársnak <Icon name="edit" size="mini" className='hoverEffect' onClick={ () => this.setState({ editMegjegyzesMunkatars: true, megjegyzes_munkatars: this.state.data.megjegyzes_munkatars }) }/></Header>
                            <span>
                                {
                                    (this.state.editMegjegyzesMunkatars) ? <><TextArea placeholder='Megjegyzés munkatársnak' name='megjegyzes_munkatars' value={this.state.megjegyzes_munkatars} onChange={this.handleChange} /> <Button color="green" icon="save" onClick={ () => this.saveMegjegyzesMunkatars() }/></> : this.state.data.megjegyzes_munkatars
                                }
                            </span>

                        </div>
                        <Divider horizontal>
                            <Header as='h4'>
                                Lista
                            </Header>
                        </Divider>
                        
                        Hozzáadás:
                        <Input
                            loading={this.state.searchIsLoading}
                            onChange={this.handleSearchChange}
                            value={this.state.searchValue}
                            style={{ marginLeft: '5px' }}
                        />
                        { (this.state.results.length) > 0 ? <Button icon="delete" style={{ marginLeft: '10px' }} onClick={() => this.setState({ results: [], searchValue: '' })} /> : null }
                        <div style={{ width: '350px' }}>
                            {
                                (this.state.results.length > 0) ? (
                                    this.state.results.map((r) => (
                                        <Label as='a' key={r.client_id} style={{ marginTop: '2px' }} onClick={ () => this.addToList(r.client_id) }>
                                            {r.cegnev}
                                            <Icon name='add' style={{ marginLeft: '3px' }} />
                                        </Label>
                                    ))
                                ) : null
                            }
                        </div>

                        <Table celled striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Cégnév</Table.HeaderCell>
                                    <Table.HeaderCell>Kapcsolattartó</Table.HeaderCell>
                                    <Table.HeaderCell>Kamra címe</Table.HeaderCell>
                                    <Table.HeaderCell>GPS koordináták</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    this.state.list && this.state.list.map( (list, index ) => (
                                        <Table.Row key={index} style={{ backgroundColor: (list.elvegezve === 0) ? 'antiquewhite' : 'darkseagreen' }}>
                                            <Table.Cell>{list.client.cegnev}</Table.Cell>
                                            <Table.Cell>{list.client.kapcs_nev} ({list.client.kapcs_telefon})</Table.Cell>
                                            <Table.Cell>{list.client.kamra_cim}</Table.Cell>
                                            <Table.Cell>{list.client.kamra_latitude}, {list.client.kamra_longitude}</Table.Cell>
                                            <Table.Cell>{
                                                (list.elvegezve === 0) ? (
                                                    <>
                                                        <Popup content='Karbantartás elvégezve' trigger={<Button size='mini' icon='check' className="green" onClick={ () => this.setState({ checkedConfirm: true, checkedId: list.maintenance_id }) }/>} />
                                                         
                                                        <Popup content='Törlés a listáról' trigger={<Button size='mini' icon='trash' className="red" onClick={ () => this.setState({ deleteFromList: true, deleteId: list.maintenance_id }) }/>} />
                                                    </>
                                                 ) : null
                                            }</Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                    {this.renderButtons()}
                </div>
                }
            </Container>
            <PageFooter />
            <Confirm
                content='Biztos vagy benne? A művelet nem vonható vissza!'
                size='tiny'
                cancelButton='Mégsem'
                confirmButton='Mehet'
                open={this.state.checkedConfirm}
                onCancel={ () => this.setState({ checkedConfirm: false }) }
                onConfirm={ () => this.checkedMaintenance() }
            />
            <Confirm
                content='Biztos vagy benne? A művelet nem vonható vissza!'
                size='tiny'
                cancelButton='Mégsem'
                confirmButton='Mehet'
                open={this.state.deleteFromList}
                onCancel={ () => this.setState({ deleteFromList: false }) }
                onConfirm={ () => this.deleteFromList() }
            />
        </div> 
        )
    }
}
 
export default ListPage;