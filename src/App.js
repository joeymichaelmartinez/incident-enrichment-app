import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import EnrichedMap from './EnrichedMap.js';
import WeatherTable from './WeatherTable.js'
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [area, setArea] = useState("No Area Selected");
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0
  });

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(e.target[0].value);
    setMapCenter({
      lat: parseInt(e.target[0].value),
      lng: parseInt(e.target[1].value)
    })
    const requestOptions = {
      method: 'GET',
      headers: { 'x-api-key': '5jXgI7SclB3gf4QB2dmP1ra6RQRqRVtH' },
      // body: JSON.stringify({ title: 'React POST Request Example' })
  };
  fetch('https://api.meteostat.net/v2/stations/nearby?lat=' + e.target[0].value + '&lon=' + e.target[1].value + '&limit=3', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data[0]);
        setArea(data.data[0].name.en);
        fetch('https://api.meteostat.net/v2/stations/hourly?station=' + data.data[0].id + '&start=2020-02-01&end=2020-02-04' , requestOptions)
          .then(response => response.json())
          .then(data => {
          console.log(data.data[0]);
          setArea(data.data[0].name.en);
            
          });
      });
  }
  
  return (
    <div className="App">
        <Row>
          <Col xs={6}>
            <EnrichedMap center={mapCenter}/>
          </Col>
          <Col xs={6}>
          <h1> {area} </h1>
            <WeatherTable />
          </Col>
        </Row>
        <Row>
          <form onSubmit={(e) => handleSubmit(e)}>        
            <label>
              Latitude:
            <input type="text" name="latitude" />        
            </label>
            <label>
              Longitude:
            <input type="text" name="longitude" />        
            </label>
            <label>
              Start of incident:
            <input type="text" name="latitude" />        
            </label>
            <label>
              End of incident:
            <input type="text" name="longitude" />        
            </label>
            <input type="submit" value="Submit" />
          </form>
        </Row>
    </div>
  );
}

export default App;
