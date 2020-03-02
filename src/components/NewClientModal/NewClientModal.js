import React, { Component } from 'react';
import { Modal, Button, Form, Message, Divider, Header } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class NewClientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
            cegnev: '',
            szekhely: '',
            szamlazasi_cim: '',
            kapcs_nev: '',
            kapcs_telefon: '',
            kapcs_email: '',
            kamra_latitude: '',
            kamra_longitude: '',
            kamra_cim: '',
            utolso_karbantartas: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal });  
    }

    closeModal = () => {
        this.props.closeModal();
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    submitBtnClick(){
        this.setState({ submitBtn: false, buttonLoader: true })
        const { cegnev, szekhely, szamlazasi_cim, kapcs_nev, kapcs_telefon, kapcs_email, kamra_cim, kamra_latitude, kamra_longitude, utolso_karbantartas } = this.state;

        if(cegnev.trim().length === 0 || szekhely.trim().length === 0 || szamlazasi_cim.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }
        
        API.post('clients/create', 'cegnev='+cegnev+'&szamlazasi_cim='+szamlazasi_cim+'&szekhely='+szekhely+'&kapcs_nev='+kapcs_nev+'&kapcs_telefon='+kapcs_telefon+'&kapcs_email='+kapcs_email+'&kamra_cim='+kamra_cim+'&kamra_latitude='+kamra_latitude+'&kamra_longitude='+kamra_longitude+'&utolso_karbantartas='+utolso_karbantartas+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                var client_id = response.client_id;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, submitBtn: true, buttonLoader: false });
                    return;
                }
                if(client_id){
                    this.props.closeModal();
                    this.props.getData();
                    this.setState({ 
                        cegnev: '',
                        szekhely: '',
                        szamlazasi_cim: '',
                        kapcs_nev: '',
                        kapcs_telefon: '',
                        kapcs_email: '',
                        kamra_latitude: '',
                        kamra_longitude: '',
                        kamra_cim: '',
                        utolso_karbantartas: '',
                        submitBtn: true,
                        messageHidden: true,
                        messageText: '',
                        buttonLoader: false })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', submitBtn: true, buttonLoader: false });
            });

    }


    render(){
        return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="large" dimmer="blurring">
            <Modal.Header>Új ügyfél létrehozása</Modal.Header>
                <Modal.Content>
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
                        <Divider horizontal style={{ marginTop: '45px' }}>
                            <Header as='h4' color='blue'>
                                Hűtőkamra adatai
                            </Header>
                        </Divider>
                        <Form.Field>
                            <label>Földrajzi szélességi fok</label>
                            <input placeholder='Földrajzi szélességi fok' name='kamra_latitude' value={this.state.kamra_latitude} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Földrajzi hosszúsági fok</label>
                            <input placeholder='Földrajzi hosszúsági fok' name='kamra_longitude' value={this.state.kamra_longitude} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Cím</label>
                            <input placeholder='Cím' name='kamra_cim' value={this.state.kamra_cim} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Utolsó karbantartás</label>
                            <input type='date' placeholder='Utolsó karbantartás' name='utolso_karbantartas' value={this.state.utolso_karbantartas} onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                    <Message color='red' hidden={this.state.messageHidden}>
                        <b>Hiba!</b> <br />
                        {this.state.messageText}
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.closeModal}>Mégsem</Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Ügyfél létrehozása"
                        onClick={ () => this.submitBtnClick() }
                        disabled={!this.state.submitBtn}
                        loading={this.state.buttonLoader}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

 
export default NewClientModal;