import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import ListItem from "../ListItem/ListItem";
import { Link, useLocation, useParams } from 'react-router-dom';
import { ClaimItem, GetList, UnClaimItem } from "../../API/ListItemApi";
import { fetchAuthSession } from 'aws-amplify/auth';
import { UserContext } from "../UserContext/UserContext";
export default function ViewList() {
    const location = useLocation();
    const username = location.state?.username;
    const eventName = location.state?.eventName;
    const { id, userid } = useParams();
    const [items, setItems] = useState([])
    const {user,token}=useContext(UserContext);
    
    useEffect(() => {
        LoadList(id, userid);
        console.log(UserContext);
    }, [id])
    const LoadList = async (eventId, userId) => {
        console.log(token.toString());
        let t = await fetchAuthSession();
        let data = await GetList(id, userid, t.tokens.accessToken.toString());
        if (data) {
            setItems(data);
        }
    }
    const handleClaim = async (itemId)=>{
        console.log(token);
        let t = await fetchAuthSession();
        var eventObject = {
            eventId:id,
            username:user.username,
            userId:t.userSub,
            itemId:itemId

        };
        let data = await ClaimItem(eventObject,token.toString());
        items.splice(items.findIndex((item)=>item.itemId===data.itemId),1);
        setItems([...items,data]);
    }
    const handleUnclaim = async (itemId)=>{
        let t = await fetchAuthSession();
        var eventObject = {
            eventId:id,
            username:user.username,
            userId:t.userSub,
            itemId:itemId

        };
        let data = await UnClaimItem(eventObject,token.toString());
        items.splice(items.findIndex((item)=>item.itemId===data.itemId),1);
        setItems([...items,data]);
    }
    const list = items?.map((item) => {
        return <ListItem id={item.itemId} name={item.name}
            cost={item.price} url={item.url}
            comments={item.comments}
            claimed={item.claimed} claimCallback={handleClaim} unclaimCallback={handleUnclaim} />
    });
    return (
        <Container className="innerContent">
            <Row> <Link to=".." relative="path"><a className="backlink"> &lsaquo;&lsaquo; Return to {eventName}</a></Link> </Row>
            <Row className="centered"><h1>{username}'s Wishlist</h1></Row>
            {list}

        </Container>)
}