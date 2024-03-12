import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import ListItem from "../ListItem/ListItem";
import { Link, useLocation, useParams } from 'react-router-dom';
import { ClaimItem, GetList, UnClaimItem } from "../../API/ListItemApi";
import { UserContext } from "../UserContext/UserContext";
export default function ViewList() {
    const location = useLocation();
    const username = location.state?.username;
    const eventName = location.state?.eventName;
    const { id, userid } = useParams();
    const [items, setItems] = useState([])
    const {user,token}=useContext(UserContext);
    const {isLoading,setLoading}= useState(false);
    useEffect(() => {
        LoadList(id, userid);
    }, [id])
    const LoadList = async (eventId, userId) => {
        let data = await GetList(id, userid);
        if (data) {
            console.log(data);
            setItems(data);
        }
    }

    const list = items?.map((item) => {
        return <ListItem id={item.itemId} name={item.name}
            cost={item.cost} url={item.url}
            comments={item.comments}
            itemClaimed={item.claimed}  eventId={id}/>
    });
    return (
        <Container className="innerContent">
            <Row> <Link to=".." relative="path"><a className="backlink"> &lsaquo;&lsaquo; Return to {eventName}</a></Link> </Row>
            <Col className="header-column">
            <Row className="headerText"><h1>{username}'s Wishlist</h1></Row>
            </Col>
            {list}

        </Container>)
}