import React, { Component } from 'react';
import { Modal, Button, Form, Message, TextArea } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class EditMaintenanceModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            maintenance_id: this.props.maintenance_id,
            datum: this.props.maintenance.datum,
            munkatars: this.props.maintenance.munkatars,
            megjegyzes: this.props.maintenance.megjegyzes,
            
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal, maintenance_id: nextProps.maintenance_id, datum: nextProps.maintenance.datum, munkatars: nextProps.maintenance.munkatars, megjegyzes: nextProps.maintenance.megjegyzes });  
    }

    closeModal = () => {
        this.setState({ buttonLoader: false, submitBtn: true })
        this.props.closeModal();
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    submitBtnClick(){
        this.setState({ submitBtn: false, buttonLoader: true })
        const maintenance_id = this.state.maintenance_id;
        const datum = this.state.datum;
        const munkatars = this.state.munkatars;
        const megjegyzes = this.state.megjegyzes;

        if(datum.trim().length === 0 || munkatars.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }

    API.post('maintenance/update/'+maintenance_id, 'datum='+datum+'&munkatars='+encodeURIComponent(munkatars)+'&megjegyzes='+encodeURIComponent(megjegyzes)+'&API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.data;
            if(response.error){
                this.setState({ messageHidden: false, messageText: response.error, submitBtn: true, buttonLoader: false });
                return;
            }
            if(response.success){
                this.props.closeModal();
                this.props.getData();
                this.setState({ 
                    datum: '',
                    munkatars: '',
                    megjegyzes: '',
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
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="small" dimmer="blurring">
            <Modal.Header>Karbantartás szerkesztése</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Dátum</label>
                            <input name='datum' value={this.state.datum} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Munkatárs</label>
                            <input placeholder='Munkatárs' name='munkatars' value={this.state.munkatars} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Megjegyzés</label>
                            <TextArea placeholder='Megjegyzés' name='megjegyzes' value={this.state.megjegyzes} onChange={this.handleChange}/>
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
                        color='blue'
                        compact
                        icon='checkmark'
                        labelPosition='right'
                        content="Karbantartás szerkesztése"
                        type='submit' 
                        onClick={ () => this.submitBtnClick() }
                        disabled={!this.state.submitBtn}
                        loading={this.state.buttonLoader}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

 
export default EditMaintenanceModal;