import logo from './logo.svg';
import './App.css';
import EventCard from './Components/EventCard/EventCard'
import {Row, Container} from 'react-bootstrap'
import Navigation from './Components/Navigation/Navigation';
import EventView from './Components/EventView/EventView';
import CreateEventForm from './Components/CreateEvent/CreateEventForm';
import Login from './Components/LoginComponent/Login';

function App() {

  return (
    <>
      <Navigation/>
      <Login/>
      <Container className="innerContent">
        <CreateEventForm/>
      <EventView/>
      </Container>
    </>

  );
}

export default App;
