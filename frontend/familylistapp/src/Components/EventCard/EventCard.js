import Card from 'react-bootstrap/Card';
import './EventCard.css'
export default function EventCard({ eventId, image, date, title, url }) {
    console.log(image);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let d = new Date(date);
    let dateString = d.toDateString();
    return (
        <Card className='eventCard'>
            <Card.Img variant="top" src={image.toString()} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle>{dateString}</Card.Subtitle>

                <a href={url} className="btn btn-primary">View Event</a>
            </Card.Body>
        </Card>);
};