import { useState } from 'react';
import {Form,Col, Row, Button} from 'react-bootstrap';
import { CreateEvent } from './CreateEventAPI';
export default function CreateEventForm(){
    const [name, setName] = useState('');
    const [date,setDate] = useState();
    const [giving,setGiving] = useState();
    const [recieving,setRecieving] = useState();
    const today = new Date().toISOString().split('T')[0];
    let items='';
    const handleSubmit = (e) =>{
        e.preventDefault();
        CreateEvent(name,date);
        console.log(e);
    }
    return (
        <>
        <h2>Create New Event</h2>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="eventTitle" as={Row}>
                <Form.Label column sm="2">Name</Form.Label>
                <Col sm="5">
                <Form.Control required type="text" name="name" value={name}  maxLength="100" onChange={change=>setName(change.target.value)} />
                <Form.Control.Feedback type="invalid">
                Please fill out the Event Name.
                </Form.Control.Feedback>
                </Col>
                
            </Form.Group>

            <Form.Group controlId="eventDate" as={Row}>
                <Form.Label column sm="2">Date</Form.Label>
                <Col sm="4" md="4">
                <Form.Control required min={today} name="date" value={date} type="date" onChange={date=>setDate(date.target.value)} />
                <Form.Control.Feedback type="invalid">
                Please enter the Event Date.
                </Form.Control.Feedback>
                </Col>
                
            </Form.Group>
            <Row className="titleRow"><Col sm="4">Name</Col>
            <Col className="titleCol">
                <input type="checkbox" id="checkAllGiving"/>
                <label for="checkAllGiving" className="checkTitle">Giving Gifts </label></Col>
            <Col className="titleCol"> 
                <input type="checkbox" id="checkAllReceiving"/>
                <label for="checkAllReceiving" className="checkTitle">Receiving Gifts</label></Col>
            </Row>
            {items}
            {false ? <Row><Col>At least one person needs to give gifts.</Col></Row> : <></>}
            {false ? <Row><Col>At least one person needs to receive gifts.</Col></Row> : <></>}
            
            <Button variant="primary" type="submit">
                Create Event
            </Button>
        </Form>
        </>
    )
}