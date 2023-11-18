import Card from 'react-bootstrap/Card';

export default function EventCard({eventId,imageUrl,date,title}) {
    let url ='';
    console.log(imageUrl);
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={imageUrl.toString()} />
        <Card.Body>
            <Card.Subtitle>{date}</Card.Subtitle>
            <Card.Title>{title}</Card.Title>
            <a href={url} className="btn btn-primary">View Event</a>
        </Card.Body>
    </Card>);
};