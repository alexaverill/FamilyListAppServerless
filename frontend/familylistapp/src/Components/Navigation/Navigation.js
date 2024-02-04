import {Nav, Navbar,NavDropdown,Container} from 'react-bootstrap'
import { signOut } from 'aws-amplify/auth';
import './Navigation.css'
import { useContext } from 'react';
import { UserContext } from '../UserContext/UserContext';
export default function Navigation(){
    let {user} = useContext(UserContext);
    let showLogin = false;
    const handleSignOut = ()=>{
        try{
            signOut();
        }catch(e){
            console.log(e);
        }
    }
    return (      
        <Navbar expand="lg">
            <Container>
            <Navbar.Brand href="/">List App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="" className="justify-content-end">
                <Nav>
                    {showLogin ? <Nav.Link href="/login">Login</Nav.Link>:
                    <NavDropdown title={user.username} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={handleSignOut}>Logout</NavDropdown.Item>
                    </NavDropdown>}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}