import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import { Container,Row } from 'react-bootstrap';
import { GetEvent } from '../../API/EventAPI';
import { useParams } from 'react-router-dom';
import {fetchAuthSession } from 'aws-amplify/auth';
export default function EventView(){
    const {id} = useParams();
   const [events, setEvents] = useState([]);
useEffect(()=>{
    LoadEvent(id);
    
},[id])
const LoadEvent = async(id)=>{
    var token = await fetchAuthSession();
    console.log(token);
    let data = await GetEvent(id,token.tokens?.accessToken.toString());
    if(data){
    setEvents(data);
    console.log(data);
    }
}
    return (

        <Container className="innerContent">
            <h1>Event View</h1>
            <h1>{id}</h1>
        </Container>
    );
}