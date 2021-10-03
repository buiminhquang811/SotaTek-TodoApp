import React, { useState, useEffect } from 'react';
import './newTask.scss';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function NewTask(props) {
  const { tasks, setTasks, actionType } = props;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('NORMAL')
  const [taskDueDate, setTaskDueDate] = useState(() => {
    var curr = new Date();
    var date = curr.toISOString().substr(0, 10);
    return date;
  });

  useEffect(() => {
    if (!Array.isArray(tasks)) {
      setTaskTitle(tasks.taskTitle);
      setTaskDesc(tasks.taskDesc);
      setTaskPriority(tasks.taskPriority);
      setTaskDueDate(tasks.taskDueDate);
    }
  }, [tasks])

  const [messageTaskTitle, setMessageTaskTitle] = useState('');
  const [messageDueDate, setMessageDueDate] = useState('');

  //validate
  const validateTaskTitle = (taskTitle) => {
    if (taskTitle.length === 0) {
      return false;
    }
    return true;
  };

  const validateDueDate = (taskDueDate) => {
    const now = new Date();
    const compareDate = new Date(now.toISOString().slice(0, 10));
    const dateInput = new Date(taskDueDate);
    if (dateInput < compareDate) {
      return false;
    }
    return true;
  }

  //function reset default value
  const clearValue = () => {
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('NORMAL');
    setMessageTaskTitle('');
    setMessageDueDate('');
    setTaskDueDate(() => {
      var curr = new Date();
      var date = curr.toISOString().substr(0, 10);
      return date;
    })
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (!validateTaskTitle(taskTitle)) {
      setMessageTaskTitle('Vui lòng nhập thông tin')
    };
    if (!validateDueDate(taskDueDate)) {
      setMessageDueDate('Vui lòng không nhập ngày quá khứ')
    };
    if (validateTaskTitle(taskTitle) && validateDueDate(taskDueDate)) {
      if (actionType === 'Add') {
        const id = (+new Date() + Math.random() + '');
        const items = {
          id: id,
          taskTitle: taskTitle,
          taskDesc: taskDesc,
          taskDueDate: taskDueDate,
          taskPriority: taskPriority,
        }
        //sort before set local
        const newArr = [...tasks, items];
        newArr.sort((a, b) => {
          return new Date(a.taskDueDate) - new Date(b.taskDueDate);
        });
        console.log({ newArr })
        setTasks(newArr);
        //after submit, reset value to default
        clearValue();
      } else {
        //case Edit
        const item = {
          id: tasks.id,
          taskTitle: taskTitle,
          taskDesc: taskDesc,
          taskDueDate: taskDueDate,
          taskPriority: taskPriority,
        };
        //send value back to parent component
        setTasks(item);
      }
    }
  }

  return (
    <Container className="newTaskContainer">
      {actionType === 'Update' ? null :
        <>
          <div className="header-title"> New Task </div>
          <br /><br />
        </>
      }
      <br />
      <Form onSubmit={onSubmitForm}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Add new task ..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)} />
          {messageTaskTitle.length > 0 && (<span className="errorMessage">{messageTaskTitle}</span>)}
        </Form.Group>
        <br />
        <Form.Group className="mb-3">
          <Form.Label className="title">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)} />
        </Form.Group>
        <br />
        <Row className="g-2">
          <Col md>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="title">Due Date</Form.Label>
              <Form.Control
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)} />
              {messageDueDate.length > 0 && (<span className="errorMessage">{messageDueDate}</span>)}
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId="formBasicSelect">
              <Form.Label className="title">Priority</Form.Label>
              <Form.Control
                as="select"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}>
                <option value="LOW">low</option>
                <option value="NORMAL">normal</option>
                <option value="HIGH">high</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <br /><br />
        <Button
          variant="success"
          type="submit"
          style={{ width: '100%' }}>
          {actionType}
        </Button>
      </Form>
    </Container >
  )
}

export default NewTask
