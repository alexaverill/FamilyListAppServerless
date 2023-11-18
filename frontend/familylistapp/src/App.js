import logo from './logo.svg';
import './App.css';
import EventCard from './Components/EventCard/EventCard'
import {Row, Container} from 'react-bootstrap'
import Navigation from './Components/Navigation/Navigation';
function App() {
  let eventCardData = [{image:'/event_images/1.jpg',date:Date.now(),title:"Test"},
  {image:'/event_images/2.jpg',date:Date.now(),title:"Test"},
  {image:'/event_images/3.jpg',date:Date.now(),title:"Test"}];
  return (
    <div className="App">
      <Navigation/>
      <Container className="innerContent">
            <div className="homeHeader">
                <div className="headerText">
                    <h2>Events</h2>
                </div>
                
            </div>
            <Row>
                {eventCardData.map(eventData=>{
                  console.log(eventData.image);
                  return <EventCard imageUrl={eventData.image} date={eventData.date} title={eventData.title}/>
                  })}
            </Row>
            </Container>
    </div>
  );
}

export default App;
