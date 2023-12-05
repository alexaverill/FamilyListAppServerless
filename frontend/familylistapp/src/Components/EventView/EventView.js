import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import { Button, Container,Row,Col } from 'react-bootstrap';
import { GetEvent } from '../../API/EventAPI';
import { Link, useParams } from 'react-router-dom';
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
const lists = [];
const isRecieving = true;
let btnText = 'Create Your List';
let btnClasses = "header-btn btn btn-primary fullWidthBtn";
let url = document.URL+"/create";
    return (

        <Container className="innerContent">
            <Container className="innerContent">
                <Row> <Link href="/">
                <a className="backlink"> &lsaquo;&lsaquo; Return to All Events</a></Link> </Row> 
            <div className="header-column">
                <div className="headerText">
                    <h2>{event.name}</h2>
                </div>
                <div className="header-date">{event.date}</div>
                <Row className="headerRow">
                    <Col sm={10} className="headerCol">
                    <a href={url} className={btnClasses}>{btnText}</a>;
                     </Col>
                
                </Row>
            </div>
        
            
            
            {lists}
            </Container>
        </Container>
    );
}