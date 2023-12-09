import { useContext, useEffect, useState } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap';
import { GetEvent } from '../../API/EventAPI';
import { Link, useParams } from 'react-router-dom';
import './EventView.css'
import { UserContext } from '../UserContext/UserContext';
export default function EventView() {
    const { id } = useParams();
    const [event, setEvents] = useState([]);
    const [date, setDate] = useState();
    const {user} = useContext(UserContext);
    const [isLoading,setIsLoading] = useState(true);
    //const {user,token} = useContext(UserContext)
    useEffect(() => {
        LoadEvent(id);

    }, [id])
    const LoadEvent = async (id) => {
        setIsLoading(true);
        let data = await GetEvent(id);
        if (data) {
            setEvents(data[0]);
            let date = new Date(data[0].date);
            setDate(date);
        }
        setIsLoading(false);
    }
    const hasList = false;
    const lists = event.recieving?.map((recieveUser) => {
        let claimURL = document.URL + `/${user.userId}`;
        let text = 'View List';

        let button = 'btn btn-primary fullWidthBtn fullWidth';

        if(recieveUser.userId === user.userId){
            claimURL=document.URL + "/create"
            text = 'Edit Your List';
            button = 'btn btn-outline-primary fullWidthBtn claimBtn';
            hasList = true;s
        } 
        if (recieveUser.hasItems) {
            return <Row className="listRow">
                <Col sm="4" md="10" lg="10"><div className="userName">{user.username}</div></Col>
                <Col><Link to={claimURL} state={{eventName:event.name,username:user.username}} className={button}>{text}</Link></Col>

            </Row>
        }
        return <></>
    });
    let btnText = hasList?'Edit Your List':'Create Your List';
    let btnClasses = "header-btn btn btn-primary fullWidthBtn";
    let url = document.URL + "/create";
    if(isLoading){
        return (
            <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                />
        )
    }
    return (

        <>
            <Row> <Link to="../../" relative='path'> 
                <a className="backlink"> &lsaquo;&lsaquo; Return to All Events</a></Link> </Row>
            <div className="header-column">
                <div className="headerText">
                    <h2>{event.name}</h2>
                </div>
                <div className="header-date">{date?.toDateString()}</div>
                <Row className="headerRow">
                    <Col sm={10} className="headerCol">
                        <a href={url} className={btnClasses}>{btnText}</a>
                    </Col>

                </Row>
            </div>



            {lists}
        </>
    );
}