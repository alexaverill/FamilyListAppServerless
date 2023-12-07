import { useState,useEffect } from "react";
import { Button, Container,Row,Col } from 'react-bootstrap';
import ListItem from "../ListItem/ListItem";
import { Link, useParams } from 'react-router-dom';
import { GetList } from "../../API/ListItemApi";
import {fetchAuthSession } from 'aws-amplify/auth';
export default function ViewList(){
    const {id,userid} = useParams();
    const [items,setItems] = useState([])
    useEffect(()=>{
        LoadList(id,userid);
        
    },[id])
    const LoadList = async(eventId,userId)=>{
        var token = await fetchAuthSession();
        let data = await GetList(id,userid,token.tokens?.accessToken.toString());
        if(data){
          console.log(data[0]);  
        setItems(data);
        console.log(items);
        }
    }
    const list = items?.map((item)=> {
return <ListItem id={item.itemId} name={item.name} 
            cost={item.price} url={item.url} 
             comments={item.comments} 
            claimed={item.isClaimed} claimedBy={item.claimedBy}/>
        });
return(
    <Container className="innerContent">
    <Row> <Link><a className="backlink"> &lsaquo;&lsaquo; Return to</a></Link> </Row> 
        <Row className="centered"><h1>{userid}'s Wishlist</h1></Row>
   {list}
    
    </Container>)
}