import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import './EventsView.css'
import { Container,Row } from 'react-bootstrap';
import { GetEvents, GetEventsByUser } from '../../API/EventAPI';
import {fetchAuthSession } from 'aws-amplify/auth';
export default function EventsView(){
   const [events, setEvents] = useState([]);
useEffect(()=>{
    LoadEvents();
},[])
const LoadEvents = async()=>{
    var token = await fetchAuthSession();
    let data = await GetEventsByUser(token.userSub,token.tokens?.accessToken.toString());
    if(data){
        console.log(data);
    setEvents(data);
    }
}
    return (

        <Container className="innerContent">
        <div className="homeHeader">
            <div className="headerText">
                <h2>Events</h2>
            </div>
            
        </div>
        <Row>
            {
            events?.map(event=> <EventCard title={event.name} date={event.date} url={'event/'+event.eventId}image={'event_images/1.jpg'}/>)}
        </Row>
        </Container>
    );
}