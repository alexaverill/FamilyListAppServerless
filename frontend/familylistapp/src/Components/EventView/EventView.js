import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import './EventView.css'
import { Container,Row } from 'react-bootstrap';
import { GetEvents } from '../../API/EventAPI';
export default function EventView(){
   const [events, setEvents] = useState([]);
useEffect(()=>{
    LoadEvents();
    
},[])
const LoadEvents = async()=>{
    let data = await GetEvents();
    setEvents(data);
}
    return (

        <Container className="innerContent">
        <div className="homeHeader">
            <div className="headerText">
                <h2>Events</h2>
            </div>
            
        </div>
        <Row>
            {events.map(event=> <EventCard title={event.name} date={event.date} image={'event_images/1.jpg'}/>)}
        </Row>
        </Container>
    );
}