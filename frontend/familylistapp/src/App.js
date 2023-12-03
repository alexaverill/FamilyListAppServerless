import logo from './logo.svg';
import './App.css';
import EventCard from './Components/EventCard/EventCard'
import { Row, Container } from 'react-bootstrap'
import Navigation from './Components/Navigation/Navigation';
import EventsView from './Components/EventsView/EventsView';
import EventView from './Components/EventView/EventView'
import Login from './Components/LoginComponent/Login';
import { Route, Routes } from 'react-router-dom';
import Admin from './Components/Admin/Admin';

function App() {

  return (
    <>
      <Navigation />
      <Container className="innerContent">
      <Routes>
          <Route path="/" element={<EventsView/>}/>
          <Route path="/event/:id" element={<EventView/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
        
      </Container>
    </>

  );
}

export default App;
