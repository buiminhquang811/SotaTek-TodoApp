import './app.scss';
import { useState, useEffect } from 'react';
import NewTask from './components/newTask/NewTask';
import ListTasks from './components/listTasks/ListTasks';
import { Container, Row, Col } from 'react-bootstrap';

//Get Data from local storage
const getAllTasks = () => {
  let tasks = localStorage.getItem('tasks');
  if (tasks) {
    var tempArr = JSON.parse(localStorage.getItem('tasks'));
    tempArr.sort((a, b) => {
      return new Date(a.taskDueDate) - new Date(b.taskDueDate);
    });
    return tempArr;
  }
  return [];
}

function App() {
  const [tasks, setTasks] = useState(getAllTasks());

  //add Data to local storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }, [tasks]);


  return (
    <Container fluid className="app__container">
      <Row>
        <Col md={5}>
          <NewTask tasks={tasks} setTasks={setTasks} actionType="Add" />
        </Col>
        <Col md={7}>
          <ListTasks tasks={tasks} setTasks={setTasks} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
