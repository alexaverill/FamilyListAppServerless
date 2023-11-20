import logo from './logo.svg';
import './App.css';
import EventCard from './Components/EventCard/EventCard'
import {Row, Container} from 'react-bootstrap'
import Navigation from './Components/Navigation/Navigation';
import EventView from './Components/EventView/EventView';
import CreateEventForm from './Components/CreateEvent/CreateEventForm';
function App() {
  return (
    <>
      <Navigation/>
      <Container className="innerContent">
        <CreateEventForm/>
      <EventView/>
      </Container>
    </>

  );
}

export default App;
