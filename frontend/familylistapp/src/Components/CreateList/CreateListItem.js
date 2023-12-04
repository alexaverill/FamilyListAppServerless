import { useState } from "react"
import { Col, InputGroup, Row, Form, Button } from 'react-bootstrap';
import ListItem from "../ListItem/ListItem";
export default function CreateListItem({index,deleteCallback}) {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [url, setUrl] = useState('');
    const [comments, setComments] = useState('');
    const [editng,setEditing] = useState(true);
    const handleSubmit = (event) => { 
        event.preventDefault();
        setEditing(false);
    }
    const handleDelete = ()=>{
        deleteCallback(index);
    }
    const handleEdit = ()=>{
        setEditing(true);
    }
    //noValidate validated={this.state.validated}       
    if(editng){
    return (
        <Row lg={1} md={1} sm={1} xl={1} xs={1}>
            <Form onSubmit={handleSubmit} className="list-edit">
                <Row>
                    <Col md={8}>
                        <Form.Group controlId="itemName" className="form-group-right-spacing">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" name="name" value={name} required maxLength="100" onChange={(e) => setName(e.target.value)} />
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
                                <Form.Control name="cost" type="number" min="0" value={cost} step="any" onChange={(e) => setCost(e.target.value)} />
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
                            <Form.Control name="url" type="text" onChange={(e) => setUrl(e.target.value)} value={url} maxLength="255" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group controlId="comments" >
                            <Form.Label>Comments</Form.Label>
                            <Form.Control name="comments" type="text" onChange={(e) => setComments(e.target.value)} value={comments} maxLength="255" />
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
            name={name} 
            cost={cost} 
            url ={url} 
            comments={comments} 
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
