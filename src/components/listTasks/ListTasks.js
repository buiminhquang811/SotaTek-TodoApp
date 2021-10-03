import React, { useState, useEffect, useRef } from 'react';
import './listTasks.scss';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import NewTask from '../newTask/NewTask';

function ListTasks(props) {
  const { tasks, setTasks } = props;
  const [cloneTasks, setCloneTasks] = useState([]);
  const [searchTask, setSearchTask] = useState('');
  const [listOpen, setListOpen] = useState([]);
  const [listTasksChecked, setListTasksChecked] = useState([]);
  const searchTimeoutRef = useRef(null);

  const onEditTask = (value) => {
    //get value from children component
    //replace value in array in Local Store
    //setTasks Again
    const foundId = tasks.findIndex(task => task.id === value.id);
    tasks[foundId] = value;
    const newArr = [...tasks];
    newArr.sort((a, b) => {
      return new Date(a.taskDueDate) - new Date(b.taskDueDate);
    });
    setTasks(newArr);
  };

  useEffect(() => {
    setListOpen([]);
    setCloneTasks(() => {
      if (searchTask.length === 0) {
        return JSON.parse(JSON.stringify(tasks))
      }
      return (tasks.filter((item) =>
        item.taskTitle.toLowerCase().includes(searchTask.toLowerCase())
      ))
    })
  }, [tasks])

  const onToggleTaskDetail = (id) => {
    if (listOpen.length === 0) {
      setListOpen([...listOpen, id]);
    } else {
      if (!listOpen.includes(id)) {
        setListOpen([...listOpen, id]);
      } else {
        listOpen.splice(listOpen.indexOf(id), 1);
        setListOpen([...listOpen]);
      }
    }
  }

  const onCheckboxChange = (id) => {
    if (listTasksChecked.length === 0) {
      setListTasksChecked([...listTasksChecked, id]);
    } else {
      if (!listTasksChecked.includes(id)) {
        setListTasksChecked([...listTasksChecked, id]);
      } else {
        listTasksChecked.splice(listTasksChecked.indexOf(id), 1);
        setListTasksChecked([...listTasksChecked]);
      }
    }
  };

  //delete single task
  const onDeleteTask = (id) => {
    const newListTasks = tasks.filter((task) => {
      return (task.id !== id);
    });
    setTasks([...newListTasks]);
  }

  //delete multi tasks
  const removeTasks = () => {
    const newListTasks = tasks.filter((task) => {
      return listTasksChecked.indexOf(task.id) < 0;
    });
    setTasks([...newListTasks]);
  };

  //Search task - debounce
  const handleSearchTask = (e) => {
    const value = e.target.value;
    setSearchTask(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCloneTasks(
        tasks.filter((item) =>
          item.taskTitle.toLowerCase().includes(value.toLowerCase())
        ));
    }, 300)
  }

  return (
    <Container className="listTasksContainer">
      <div className="header-title"> To Do List </div>
      <br /><br /><br />
      <Form.Control
        type="text"
        placeholder="Search ..."
        value={searchTask}
        onChange={handleSearchTask} />
      <br />
      {cloneTasks.map((item, idx) =>
        <div key={item.id} className="task-item">
          <Row style={{ padding: '10px' }}>
            <Col md={8} sm={12}>
              <Form.Check
                type='checkbox'
                // id='checkbox-default'
                label={item.taskTitle}
                onChange={() => onCheckboxChange(item.id)}
              />
            </Col>
            <Col md={4} sm={12} className="list-buttons">
              <Button variant="primary" onClick={() => onToggleTaskDetail(item.id)}>
                Detail
              </Button>{' '}
              <Button variant="danger" onClick={() => onDeleteTask(item.id)}>
                Remove
              </Button>
            </Col>
          </Row>

          {listOpen.includes(item.id) ?
            (
              <Row>
                <Col md={12}>
                  <NewTask tasks={item} setTasks={onEditTask} actionType="Update" />
                </Col>
              </Row>
            ) :
            null}
        </div>
      )}
      <br /><br /><br />
      {listTasksChecked.length > 0 ?
        (
          <div className="footer">
            <div>
              Bulk Action
            </div>
            <div>
              <Button variant="primary">
                Done
              </Button>{' '}
              <Button variant="danger" onClick={removeTasks}>
                Remove
              </Button>
            </div>
          </div>
        ) : null
      }
    </Container>
  )
}

export default ListTasks
