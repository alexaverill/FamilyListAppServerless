import { useState } from "react";
import { signIn } from 'aws-amplify/auth';
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username)
        signIn({
            username,
            password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH' 
            }
          }).then((result) => {
            navigate("/");
            console.log(result);
        }).catch((err) => {
            setLoginError(true);
            console.log(err);
            // Something is Wrong
        })
    }
    return (
        <Container id="login-form" className="innerContainer">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventTitle">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" onChange={(e) => { setLoginError(false); setUsername(e.target.value) }} />
                </Form.Group>

                <Form.Group controlId="eventDate">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" onChange={(e) => { setLoginError(false); setPassword(e.target.value) }} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            {loginError ? <h2>Invalid Login</h2> : ''}
        </Container>
    );

};