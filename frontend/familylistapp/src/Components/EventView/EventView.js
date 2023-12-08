import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import { Button, Container,Row,Col } from 'react-bootstrap';
import { GetEvent } from '../../API/EventAPI';
import { Link, useParams } from 'react-router-dom';
import {fetchAuthSession } from 'aws-amplify/auth';
import CreateList from '../CreateList/CreateList';
import './EventView.css'
export default function EventView(){
    const {id} = useParams();
   const [event, setEvents] = useState([]);
   const [date,setDate] = useState();
useEffect(()=>{
    LoadEvent(id);
    
},[id])
const LoadEvent = async(id)=>{
    var token = await fetchAuthSession();
    console.log(token);
    let data = await GetEvent(id,token.tokens?.accessToken.toString());
    if(data){
    setEvents(data[0]);
    let date = new Date(data[0].date);
    setDate(date);
    console.log(data);
    }
}
const lists = event.giving?.map((user)=>{
    let claimURL = document.URL+`/${user.userId}`; 
    let text = 'View List';

    let button = 'btn btn-primary fullWidthBtn';
   
    // if(list.userId === this.state.userID){
    //     claimURL = url;
    //     text = 'Edit Your List';
    //     button = 'btn btn-outline-primary fullWidthBtn claimBtn';
    // } 
    if(user.hasItems){
    return <Row className="listRow">
        <Col sm="4" md="10" lg="10"><div className="userName">{user.username}</div></Col>
        <Col><a href={claimURL} className={button}>{text}</a></Col>

    </Row>
    }
    return <></>
});
const isRecieving = true;
let btnText = 'Create Your List';
let btnClasses = "header-btn btn btn-primary fullWidthBtn";
let url = document.URL+"/create";
    return (

            <>
                <Row> <Link href="/">
                <a className="backlink"> &lsaquo;&lsaquo; Return to All Events</a></Link> </Row> 
            <div className="header-column">
                <div className="headerText">
                    <h2>{event.name}</h2>
                </div>
                <div className="header-date">{date?.toDateString()}</div>
                <Row className="headerRow">
                    <Col sm={10} className="headerCol">
                    <a href={url} className={btnClasses}>{btnText}</a>
                     </Col>
                
                </Row>
            </div>
        
            
            
            {lists}
            </>
    );
}