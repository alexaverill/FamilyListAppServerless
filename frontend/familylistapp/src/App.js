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
import CreateList from './Components/CreateList/CreateList';
import AuthRoute from './Components/Auth/Auth';
import ViewList from './Components/ViewList/ViewList';
import { UserContext, UserContextProvider } from './Components/UserContext/UserContext';
function App() {

  return (
    <>
      <UserContextProvider>
        <Navigation />
        <Container className="innerContent">
          <Routes>
            <Route path="/" element={
              <AuthRoute>
                <EventsView />
              </AuthRoute>
            } />
            <Route path="/event/:id" element={<AuthRoute><EventView /></AuthRoute>} />
            <Route path="/event/:id/create" element={<AuthRoute><CreateList /></AuthRoute>} />
            <Route path="/event/:id/:userid" element={<AuthRoute><ViewList /></AuthRoute>} />
            <Route path="/admin" element={<AuthRoute><Admin /></AuthRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>

        </Container>
      </UserContextProvider>
    </>

  );
}

export default App;
