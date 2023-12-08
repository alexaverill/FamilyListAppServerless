import { useState } from "react"
import { Col, Row, Form, Button } from 'react-bootstrap';
import './ListItem.css'
export default function ListItem({name,cost,comments,claimed,editable,editCallback,deleteCallback}){
    const handleClaim = ()=>{}

    let deleteBtn = false;
    let claimedText = "";
    let button=""
    if(editable){
        button = <Button variant="outline-primary" className="claimBtn" onClick={editCallback}> Edit </Button>
        deleteBtn = <Button variant="outline-danger"  onClick={deleteCallback}> Delete </Button>
    }else if(!claimed){
        button = <Button  className="claimBtn" onClick={handleClaim}> Claim </Button>
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