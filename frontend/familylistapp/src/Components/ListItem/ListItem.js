import { useState,useContext, useEffect } from "react"
import { Col, Row, Form, Button } from 'react-bootstrap';
import './ListItem.css'
import { UserContext } from "../UserContext/UserContext";
export default function ListItem({id,name,cost,comments,claimed,editable,editCallback,deleteCallback,claimCallback,unclaimCallback}){
    const {user}=useContext(UserContext);
    const handleClaim = ()=>{
        claimCallback(id);
    }
    const handleUnclaim=()=>{
       unclaimCallback(id);
    }
    let deleteBtn = false;
    let claimedText = "";
    let button="";
    if(editable){
        button = <Button variant="outline-primary" className="claimBtn" onClick={editCallback}> Edit </Button>
        deleteBtn = <Button variant="outline-danger"  onClick={deleteCallback}> Delete </Button>
    }else if(claimed === null || claimed === undefined){
        button = <Button  className="claimBtn" onClick={handleClaim}> Claim </Button>
    }else if(claimed){
        
        if( claimed.userId == user.userId){
            //bgClass=styles.listRowclaimed;
            //linkClass= styles.whitelink;
            claimedText = "Claimed by: You";
            button=<Button variant="outline-primary" className="unclaimBtn" onClick={handleUnclaim}> Unclaim </Button>;
        }else{
            //bgClass=styles.listRowClaimedOthers;
            claimedText=`Claimed by: ${claimed.username}`
        }
    }
    
    return (
        <>
            <Row className='listrow' >
                <Col xs="8" md="4" lg="3">
                    {name}
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