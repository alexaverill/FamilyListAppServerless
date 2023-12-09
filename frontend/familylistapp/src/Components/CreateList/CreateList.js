import { useState } from "react"
import {Row,Container,Button} from 'react-bootstrap';
import {Link, useParams, useLocation } from 'react-router-dom';
import CreateListItem from "./CreateListItem";

export default function CreateList({url,eventId}){
    const {id} = useParams();
    const location = useLocation();
    const [emailSent,setEmailSent] = useState(false);
    const [items, setItems] = useState([]);
    const sendReminder = ()=>{}
    const handleAdd = ()=>{
        console.log("Adding");
        setItems([...items,<CreateListItem index={items.length+1} deleteCallback={handleDeleted} key={items.length+1} eventId={id}/>])
    
    }
    const handleDeleted = (index)=>{
        let newItems = items.splice(index,1);
        setItems([...newItems])
    }
    let emailText = ""
    let eventName = location.state?.eventName;
    return (
        <>
        <Row> <Link to=".." relative="path">
            <a className="backlink"> &lsaquo;&lsaquo; Return to {eventName}</a></Link> </Row>
        <Row className="centered"><h1>Create Your Wishlist for {eventName}</h1></Row>
        <Row className="headerRow"><div><p>{emailText}</p></div></Row>
        <Row className="headerRow"><div>{emailSent ? <></> : <Button onClick={sendReminder}>Share Wishlist</Button>}</div></Row>
        <div className="item-row">
            {items}
        </div>
        <hr></hr>
        <Button onClick={handleAdd}>Add A New Item</Button>

    </>
    )
}