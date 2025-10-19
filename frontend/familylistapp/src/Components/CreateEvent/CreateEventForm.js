import { useEffect, useState } from "react";
import { Form, Col, Row, Button, Spinner } from "react-bootstrap";
import { CreateEvent } from "../../API/EventAPI";
import { fetchAuthSession } from "aws-amplify/auth";
import { GetUsers } from "../../API/UserAPI";
import LoadingButton from "../LoadingButton/LoadingButton";
var _array = require("lodash/array");

export default function CreateEventForm() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    let data = await GetUsers();
    if (data) {
      setUsers(data);
    }
  };
  const [name, setName] = useState("");
  const [date, setDate] = useState();
  const [giving, setGiving] = useState([]);
  const [recieving, setRecieving] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);
  let items = () => {
    if (users.length <= 0) {
      return (
        <Spinner
          as="span"
          animation="border"
          role="status"
          aria-hidden="true"
        />
      );
    }
    return users.map((u, index) => {
      let result = (
        <Form.Group controlId="formBasicCheckbox" as={Row} key={u.userId}>
          <Col>{u.username}</Col>
          <Col>
            <Form.Check
              inline
              type="checkbox"
              name={u.userId}
              onChange={(evt) => handleGiving(evt)}
              label=""
              checked={giving.findIndex((element) => element === u) >= 0}
            />
          </Col>
          <Col>
            <Form.Check
              inline
              type="checkbox"
              name={u.userId}
              onChange={(evt) => handleReceiving(evt)}
              label=""
              checked={recieving.findIndex((element) => element === u) >= 0}
            />
          </Col>
        </Form.Group>
      );

      return result;
    });
  };
  const handleCheckBoxChange = (event, func, stateObj) => {
    let userId = event.target.name;
    let user = users.find((element) => element.userId == userId);
    console.log(user);
    let position = stateObj.findIndex((element) => element === user);
    console.log(position);
    if (position < 0) {
      func([...stateObj, user]);
    } else {
      stateObj.splice(position, 1);
      func([...stateObj]);
    }
    console.log(giving);
  };
  const handleGiving = (event) => {
    handleCheckBoxChange(event, setGiving, giving);
  };
  const handleReceiving = (event) => {
    handleCheckBoxChange(event, setRecieving, recieving);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    var eventObject = { name, date, giving, recieving, active: "true" };
    CreateEvent(eventObject);
    console.log(e);
    setIsLoading(false);
    resetForm();
  };
  const resetForm = () => {
    setName();
    setDate();
    setGiving([]);
    setRecieving([]);
  };
  const checkAll = (event, array, func) => {
    let checked = event.target.checked;
    if (checked) {
      let concatArray = array.concat(users);
      let finalArray = _array.uniq(concatArray);
      func([...finalArray]);
    } else {
      func([]);
    }
  };
  const checkAllReceiving = (event) => {
    checkAll(event, recieving, setRecieving);
  };
  const checkAllGiving = (event) => {
    checkAll(event, giving, setGiving);
  };
  return (
    <>
      <h2>Create New Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="eventTitle" as={Row}>
          <Form.Label column sm="2">
            Name
          </Form.Label>
          <Col sm="5">
            <Form.Control
              required
              type="text"
              name="name"
              value={name}
              maxLength="100"
              onChange={(change) => setName(change.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out the Event Name.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group controlId="eventDate" as={Row}>
          <Form.Label column sm="2">
            Date
          </Form.Label>
          <Col sm="4" md="4">
            <Form.Control
              required
              min={today}
              name="date"
              value={date}
              type="date"
              onChange={(date) => setDate(date.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter the Event Date.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Row className="titleRow">
          <Col sm="4">Name</Col>
          <Col className="titleCol">
            <input
              type="checkbox"
              id="checkAllGiving"
              onChange={checkAllGiving}
            />
            <label for="checkAllGiving" className="checkTitle">
              Giving Gifts{" "}
            </label>
          </Col>
          <Col className="titleCol">
            <input
              type="checkbox"
              id="checkAllReceiving"
              onChange={checkAllReceiving}
            />
            <label for="checkAllReceiving" className="checkTitle">
              Receiving Gifts
            </label>
          </Col>
        </Row>
        {items()}
        {false ? (
          <Row>
            <Col>At least one person needs to give gifts.</Col>
          </Row>
        ) : (
          <></>
        )}
        {false ? (
          <Row>
            <Col>At least one person needs to receive gifts.</Col>
          </Row>
        ) : (
          <></>
        )}

        <LoadingButton isloading={isLoading} variant="primary" type="submit">
          Create Event
        </LoadingButton>
      </Form>
    </>
  );
}
