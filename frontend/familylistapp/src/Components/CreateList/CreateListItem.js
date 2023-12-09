import { useState } from "react"
import { Col, InputGroup, Row, Form, Button } from 'react-bootstrap';
import ListItem from "../ListItem/ListItem";
import { Link, useParams } from 'react-router-dom';
import { fetchAuthSession } from "aws-amplify/auth";
import { CreateItem } from "../../API/ListItemApi";

export default function CreateListItem({index,deleteCallback,eventId,id,name,cost,url,comments,editing}) {
    const [itemId,setItemId] = useState(id);
    const [itemName, setName] = useState(name);
    const [itemCost, setCost] = useState(cost);
    const [itemURL, setUrl] = useState(url);
    const [itemComments, setComments] = useState(comments);
    const [isEditing,setEditing] = useState(editing);
    const handleSubmit = async (event) => { 
        event.preventDefault();
        setEditing(false);
        let userData = await fetchAuthSession();
        let itemData = {
            itemId,
            name:itemName,
            cost:itemCost,
            url:itemURL,
            comments:itemComments,
            userId:userData.userSub,
            eventId
        };
        let token = await fetchAuthSession();
        let result = await CreateItem(itemData,token.tokens?.accessToken.toString())
        if(result){
            setItemId(result.itemId);
        }
    }
    const handleDelete = ()=>{

        deleteCallback(itemId);
    }
    const handleEdit = ()=>{
        setEditing(true);
    }
    if(isEditing){
    return (
        <Row lg={1} md={1} sm={1} xl={1} xs={1}>
            <Form onSubmit={handleSubmit} className="list-edit">
                <Row>
                    <Col md={8}>
                        <Form.Group controlId="itemName" className="form-group-right-spacing">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" name="name" value={itemName} required maxLength="100" onChange={(e) => setName(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please enter the name of the item.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="cost" md="4" sm="4" >
                            <Form.Label>Cost</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control name="cost" type="number" min="0" value={itemCost} step="any" onChange={(e) => setCost(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the item cost. If there is no cost, enter 0.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group controlId="url" >
                            <Form.Label>Item URL</Form.Label>
                            <Form.Control name="url" type="text" onChange={(e) => setUrl(e.target.value)} value={itemURL} maxLength="255" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group controlId="comments" >
                            <Form.Label>Comments</Form.Label>
                            <Form.Control name="comments" type="text" onChange={(e) => setComments(e.target.value)} value={itemComments} maxLength="255" />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </Row>
    )
    }

    return (
        <Row lg={1} md={1} sm={1} xl={1} xs={1}>
        <ListItem 
            name={itemName} 
            cost={itemCost} 
            url ={itemURL} 
            comments={itemComments} 
            editable={true} 
            editCallback={handleEdit}
            deleteCallback={handleDelete}
            />
                      {/* editCallback={this.editCallback} 
            deleteCallback={this.deleteCallback}
            claimedBy={tclaimed}
            showClaimed={this.state.showClaims}  */}
        </Row>
    );


}
