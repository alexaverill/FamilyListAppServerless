import { useState } from 'react';
import {Form,Col, Row, Button} from 'react-bootstrap';
import {fetchAuthSession } from 'aws-amplify/auth';

export default function CreateUser(){
    
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const handleSubmit = async (event)=>{
        var token = await fetchAuthSession();
        event.preventDefault();
    }
    return(
        <Form>
            <Form.Group controlId="eventTitle"  as={Row} className="leftJustifyRow">
                <Form.Label column sm="2">Name</Form.Label>
                <Col sm="8">
                <Form.Control type="text" name="name"  maxLength="100" onChange={e=>setUsername(e.target.value)} />
                </Col>
            </Form.Group>

            <Form.Group controlId="email" className="leftJustifyRow" as={Row}>
                <Form.Label column sm="2">Email:</Form.Label>
                <Col sm="8" md="8">
                <Form.Control type="email" name="email"  maxLength="100" onChange={e => setEmail(e.target.value)} />
                </Col>
            </Form.Group>
            <Form.Group controlId="password" className="leftJustifyRow" as={Row}>
                <Form.Label column sm="2">Password:</Form.Label>
                <Col sm="8" md="8">
                <Form.Control type="text" name="password"  maxLength="100" onChange={e=>setPassword(e.target.value)} />
                </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
                Create User
            </Button>
        </Form>);
}