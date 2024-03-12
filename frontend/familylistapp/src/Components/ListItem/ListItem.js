import { useState,useContext, useEffect } from "react"
import { Col, Row, Form, Button } from 'react-bootstrap';
import './ListItem.css'
import { UserContext } from "../UserContext/UserContext";
import LoadingButton from "../LoadingButton/LoadingButton";
import { ClaimItem, GetList, UnClaimItem } from "../../API/ListItemApi";
export default function ListItem({id,name,url,cost,comments,itemClaimed,editable,editCallback,deleteCallback,claimCallback,unclaimCallback,eventId}){
    const {user}=useContext(UserContext);
    const [isLoading, setLoading] = useState(false);
    const [claimed,setClaimed] = useState(itemClaimed);
    const handleClaim = async ()=>{
        console.log(isLoading);
        setLoading(true);
        var eventObject = {
            eventId:eventId,
            username:user.username,
            userId:user.userId,
            itemId:id

        };
        console.log(user);
        console.log(eventObject);
        let data = await ClaimItem(eventObject);
        console.log(data);
        if(data){
            console.log(data);
            setClaimed(data.claimed);
        }
        setLoading(false);
    }
    const handleUnclaim = async ()=>{
        setLoading(true);
        var eventObject = {
            eventId:eventId,
            username:user.username,
            userId:user.userId,
            itemId:id

        };
        let data = await UnClaimItem(eventObject);
        if(data){
            setClaimed(undefined);
        }
        setLoading(false);

    }
    let deleteBtn = false;
    let claimedText = "";
    let button="";
    let bgClass="";
    if(editable){
        button = <Button variant="outline-primary" className="claimBtn" onClick={editCallback}> Edit </Button>
        deleteBtn = <Button variant="outline-danger"  onClick={()=>deleteCallback(id)}> Delete </Button>
    }else if(claimed === null || claimed === undefined){
        button = <LoadingButton isloading={isLoading}  className="claimBtn" onClick={handleClaim}> {isLoading? 'Claiming':'Claim'} </LoadingButton>
    }else if(claimed){
        
        if( claimed.userId == user.userId){
            bgClass="listRowclaimed";
            //linkClass= styles.whitelink;
            claimedText = "Claimed by: You";
            button=<LoadingButton variant="outline-primary" className="unclaimBtn" onClick={handleUnclaim}> Unclaim </LoadingButton>;
        }else{
            bgClass="listRowClaimedOthers";
            claimedText=`Claimed by: ${claimed.username}`
        }
    }
    
    return (
        <>
            <Row className={`listrow ${bgClass}`} >
                <Col xs="8" md="4" lg="3">
                    <a href={url} alt={name} target="_blank">{name}</a>
                </Col>
                <Col xs="4" md="2" lg="1">
                    <strong>${cost}</strong>
                </Col>
                <Col xs="12" md="6" lg="5">
                    {comments}
                </Col>
                <Col>
                    {claimedText}
                    {button}
                </Col>
                {deleteBtn? <Col>
                { deleteBtn}
                </Col>:<></>}
            </Row>
        </>
        )
}