import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import { Container,Row } from 'react-bootstrap';
import { GetEvent } from '../../API/EventAPI';
import { useParams } from 'react-router-dom';
import {fetchAuthSession } from 'aws-amplify/auth';
import CreateList from '../CreateList/CreateList';
export default function EventView(){
    const {id} = useParams();
   const [event, setEvents] = useState([]);
useEffect(()=>{
    LoadEvent(id);
    
},[id])
const LoadEvent = async(id)=>{
    var token = await fetchAuthSession();
    console.log(token);
    let data = await GetEvent(id,token.tokens?.accessToken.toString());
    if(data){
    setEvents(data[0]);
    console.log(data);
    }
}
    return (

        <Container className="innerContent">
            <h1>Event View</h1>
            <h1>{event?.name}</h1>
            <CreateList/>
        </Container>
    );
}