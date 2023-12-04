import { useState } from "react"
import {Row,Container,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import CreateListItem from "./CreateListItem";

export default function CreateList({eventName,url}){
    const [emailSent,setEmailSent] = useState(false);
    const [items, setItems] = useState([]);
    const sendReminder = ()=>{}
    const handleAdd = ()=>{
        console.log("Adding");
        setItems([...items,<CreateListItem index={items.length+1} deleteCallback={handleDeleted}/>])
    
    }
    const handleDeleted = (index)=>{
        let newItems = items.splice(index,1);
        setItems([...newItems])
    }
    let emailText = ""
    return (
        <Container className="innerContent">
        <Row> <Link href={url}>
            <a className="backlink"> &lsaquo;&lsaquo; Return to {eventName}</a></Link> </Row>
        <Row className="centered"><h1>Create Your Wishlist for {eventName}</h1></Row>
        <Row className="headerRow"><div><p>{emailText}</p></div></Row>
        <Row className="headerRow"><div>{emailSent ? <></> : <Button onClick={sendReminder}>Share Wishlist</Button>}</div></Row>
        <div className="item-row">
            {items}
        </div>
        <hr></hr>
        <Button onClick={handleAdd}>Add A New Item</Button>

    </Container>
    )
}