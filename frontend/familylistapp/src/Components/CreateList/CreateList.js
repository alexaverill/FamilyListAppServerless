import { useContext, useEffect, useState } from "react"
import {Row,Col,Button,Spinner} from 'react-bootstrap';
import {Link, useParams, useLocation } from 'react-router-dom';
import CreateListItem from "./CreateListItem";
import { DeleteItem, GetList } from "../../API/ListItemApi";
import { UserContext } from "../UserContext/UserContext";
import { fetchAuthSession } from "aws-amplify/auth";
import { PublishList, ShareWishlist } from "../../API/BaseApi";
import LoadingButton from "../LoadingButton/LoadingButton";

export default function CreateList({url,eventId}){
    const {id} = useParams();
    const location = useLocation();
    const [emailSent,setEmailSent] = useState(false);
    const [items, setItems] = useState([]);
    const {user,token} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [listLoading,setListLoading] = useState(false);
    console.log(location.state);
    useEffect(()=>{
        loadList();
    },[user])
    const loadList =async ()=>{
        setListLoading(true);
        let data = await GetList(id,user.userId);
        let displayItems = data.map((item)=>{
            return <CreateListItem key={item.itemId} id={item.itemId} name={item.name}
            cost={item.cost} url={item.url}
            comments={item.comments}
            claimed={item.claimed} eventId={id} deleteCallback={handleDeleted}/>
        });
        setItems(displayItems);
        setListLoading(false);
    }
    const publish = async ()=>{
        setLoading(true);
        await PublishList({eventId:id,userId:user.userId})
        await sendReminder();
        setLoading(false);
    }
    const sendReminder = async()=>{
        console.log(id,user.username);
        await ShareWishlist({eventId:id,username:user.username,name:location.state?.eventName});
    }
    const handleAdd = ()=>{
        setItems([...items,<CreateListItem index={items.length+1} deleteCallback={handleDeleted} key={items.length+1} eventId={id} editing={true}/>])
    
    }
    const handleDeleted = async (itemId)=>{
        let eventObj = {
            itemId,
            eventId:id
        }
        await DeleteItem(eventObj)
        items.splice(items.findIndex((item)=>item.itemId===itemId),1);
        setItems([...items])
    }
    let emailText = ""
    let eventName = location.state?.eventName;

    return (
        <>
        <Row> <Link to=".." relative="path">
            <a className="backlink"> &lsaquo;&lsaquo; Return to {eventName}</a></Link> </Row>
            <div className="header-column">
                <Row className="headerText">
                <h1>Create Your Wishlist for {eventName}</h1>
                </Row>
                <Row className="headerRow">
                    <Col sm={10} className="headerCol">
                    <LoadingButton isloading={loading} onClick={publish} className="fullWidthBtn">Publish and Share</LoadingButton>
                    </Col>

                </Row>
            </div>
        {listLoading?                 <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />:
        <div className="item-row">
            {items}
        </div>
        }
        <hr></hr>
        <Button onClick={handleAdd}>Add A New Item</Button>

    </>
    )
}