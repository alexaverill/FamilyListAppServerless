import { useEffect, useState } from 'react';
import EventCard from '../EventCard/EventCard';
import './EventsView.css'
import { Container, Row, Spinner } from 'react-bootstrap';
import { GetEvents, GetEventsByUser } from '../../API/EventAPI';
import { fetchAuthSession } from 'aws-amplify/auth';
export default function EventsView() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        LoadEvents();
    }, [])

    const LoadEvents = async () => {
        setIsLoading(true);
        let data = await GetEventsByUser();
        if (data) {
            data.sort((first,second)=>{
                var dateOne = new Date(first.date);
                var dateTwo = new Date(second.date);
                return dateOne - dateTwo;
            });
            setEvents(data);
        }
        setIsLoading(false);
    }
    return (

        <>
            <div className="homeHeader">
                <div className="headerText">
                    <h2>Events</h2>
                </div>

            </div>
            {isLoading ? <Spinner as="span"
                animation="border"
                role="status"
                aria-hidden="true"
            /> :
                <Row>
                    {events?.map(event => <EventCard key={event.eventId} title={event.name} date={event.date} url={'event/' + event.eventId} image={`event_images/${event.imageId ? event.imageId.toString() : '1'}.jpg`} />)}
                </Row>}
        </>
    );
}