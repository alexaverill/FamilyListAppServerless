import { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { fetchAuthSession, signUp,confirmSignUp } from 'aws-amplify/auth';
const registerState = {
    ENTRY: 1,
    VALIDATE: 2,
    ERROR: 3
}
export default function CreateUser() {
    const [registerState, setRegisterState] = useState('')
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [validationCode,setValidationCode] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        var token = await fetchAuthSession();
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email
                    }
                }
            });
            setUserId(userId);
            console.log(userId);
            console.log(nextStep.signUpStep);
            if (nextStep.signUpStep == "CONFIRM_SIGN_UP") {
                setRegisterState(registerState.VALIDATE);
            }
        } catch (ex) {
            setRegisterState(registerState.ERROR);
            console.log(ex);
        }

    }
    const handleValidate = async (event)=>{
        event.preventDefault();
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
              username,
              validationCode
            });
          } catch (error) {
            console.log('error confirming sign up', error);
          }

    }
    if (registerState == registerState.VALIDATE) {
        return (
            <Form onSubmit={handleValidate}>
                <Form.Group controlId="eventTitle" as={Row} className="leftJustifyRow">
                    <Form.Label column sm="2">Code:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" name="validationCode" maxLength="100" onChange={e => setValidationCode(e.target.value)} />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Validate User
                </Button>
            </Form>
        )
    } else {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventTitle" as={Row} className="leftJustifyRow">
                    <Form.Label column sm="2">Name</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" name="name" maxLength="100" onChange={e => setUsername(e.target.value)} />
                    </Col>
                </Form.Group>

                <Form.Group controlId="email" className="leftJustifyRow" as={Row}>
                    <Form.Label column sm="2">Email:</Form.Label>
                    <Col sm="8" md="8">
                        <Form.Control type="email" name="email" maxLength="100" onChange={e => setEmail(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group controlId="password" className="leftJustifyRow" as={Row}>
                    <Form.Label column sm="2">Password:</Form.Label>
                    <Col sm="8" md="8">
                        <Form.Control type="text" name="password" maxLength="100" onChange={e => setPassword(e.target.value)} />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create User
                </Button>

            </Form>);
    }
}