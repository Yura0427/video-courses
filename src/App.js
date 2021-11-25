
import axios from 'axios';
import React from 'react';
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
import './App.css';
import img from './assets/close.png'
import { Preloader } from './Preloader';
const style = {
  row: {
    width: '100%',
    minWidth: 250,
    height: '90vh',
    display: 'flex',
    flexDirection: 'row',
    padding: '10px',
  },
  column: {
    minWidth: '30%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '10px',
  },
  ifOff: {
    // backgroundColor: 'green',
    width: '0px',
    display: 'flex',
    flexDirection: 'column',
    transition: '0.7s',
    opacity: 0,
  },
  ifOn: {
    boxShadow: '-15px 0 10px 0 rgba(0,0,0,0.2)',
    backgroundColor: '#e7e6e6',
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    transition: '0.7s',
  }
}

function App() {
  const baseUrl = "http://localhost:3001/modules?_limit=20";
  const [modules, setModules] = React.useState([]);
  const [seartchBy, setseartchBy] = React.useState('moduleName');
  const [seartchValue, setSeartchValue] = React.useState('');
  const [activeCourse, setActiveCourse] = React.useState();
  const [row, setRow] = React.useState([]);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarContent, setSidebarContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const resp = await axios.get(baseUrl);
      setModules(resp.data);
      setLoading(false);
    }
    fetchData();
  }, [])

  React.useEffect(() => {
    const row = []
    modules.map(el => {
      if (!row.includes(el.status)) row.push(el.status)
    })
    setRow(row)
    setSidebarContent(
      <>
        <div style={{ padding: 5 }}>
          <img
            style={{ float: 'right', cursor: 'pointer' }}
            src={img} width='24'
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <p>Course</p>
        <p>{activeCourse?.courseName}</p>
        <ListGroup >
          {modules.map(e => {
            if (e.courseName === activeCourse?.courseName && activeCourse?.status === e.status)
              return (
                <ListGroup.Item
                  action
                  active={e.selectModule}
                  key={e.id}
                  onClick={handleClickMoule(e.id)}
                >
                  {e.moduleName}
                </ListGroup.Item>)
          })}
        </ListGroup>
      </>
    )

  }, [modules, activeCourse])

  const cardClick = (status, courseName) => () => {
    setActiveCourse({ status: status, courseName: courseName })
    setSidebarOpen(true)
  }

  const handleClickMoule = (id) => (e) => {
    const arr = []
    modules.map(el => {
      if (id === el.id) arr.push({ ...el, selectModule: !el.selectModule })
      else arr.push({ ...el, selectModule: false })
    })
    setModules(arr);
  }

  return (
    <>
      <Form>
        <Row className="mx-2">
          <Col xs="auto" className="my-1">
            <Form.Label >
              Seartch by:
            </Form.Label>
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Select
              className="me-sm-2"
              onChange={(e) => setseartchBy(e.target.value)}
            >
              <option value="moduleName" defaultValue>moduleName</option>
              <option value="courseName">courseName</option>
            </Form.Select>
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Control
              placeholder={`seartch by ${seartchValue}`}
              onChange={e => setSeartchValue(e.target.value.toLowerCase())} />
          </Col>

        </Row>
      </Form>
      <div style={{
        backgroundColor: 'grey',
        height: '90vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}>

        <div style={{
          display: 'flex',
          width: '100%',
          overflowX: 'auto',
        }}>
          {loading
            ? <Preloader/>
            : row.map(el => {
              const tmp = []
              return (
                <div style={style.row} key={el}>
                  <div style={style.column}>
                    <span>{el}</span>
                    {modules.filter(el => {
                      if (seartchValue && seartchBy === 'courseName') {
                        if (el.courseName.toLowerCase().includes(seartchValue)) return el
                      }
                      else return el
                    }).map(module => {
                      if (el === module.status && !tmp.includes(module.courseName)) {
                        tmp.push(module.courseName)
                        return (
                          <Card
                            key={module.courseName}
                            style={{ width: 'auto', margin: 5 }}
                            onClick={cardClick(el, module.courseName)}
                          >
                            <Card.Body>{module.courseName}</Card.Body>
                            <ListGroup variant="flush">
                              {
                                modules.filter(el => {
                                  if (seartchValue && seartchBy === 'moduleName') {
                                    if (el.moduleName.toLowerCase().includes(seartchValue)) return el
                                  }
                                  else return el
                                }).map(el => {
                                  if (el.courseName === module.courseName && el.status === module.status)
                                    return (
                                      <ListGroup.Item
                                        action
                                        key={el.id}
                                        onClick={handleClickMoule(el.id)}
                                        active={el.selectModule}
                                      >
                                        {el.moduleName}
                                      </ListGroup.Item>
                                    )
                                })
                              }
                            </ListGroup>
                          </Card>
                        )
                      }
                    })}
                  </div>
                </div >
              )
            })
          }
        </div>

        <div style={sidebarOpen ? { ...style.ifOn } : { ...style.ifOff }} >

          {sidebarContent}
        </div>
      </div>
    </>


  );
}

export default App;
