import {Nav, Navbar,NavDropdown,Container} from 'react-bootstrap'
import './Navigation.css'
export default function Navigation(){
    let username = "Test"
    let showLogin = false;
    return (      
        <Navbar expand="lg">
            <Container>
            <Navbar.Brand href="/">List App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="" className="justify-content-end">
                <Nav>
                    {showLogin ? <Nav.Link href="/login">Login</Nav.Link>:
                    <NavDropdown title={username} id="basic-nav-dropdown">
                        <NavDropdown.Item href="logout">Logout</NavDropdown.Item>
                    </NavDropdown>}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}