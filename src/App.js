import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import EnrichedMap from './EnrichedMap.js';
import WeatherTable from './WeatherTable.js'
import { Container, Row, Col } from 'react-bootstrap';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function App() {
  const [area, setArea] = useState("No Area Selected");
  const [tableData, setTableData] = useState([createData('No values have been set yet')]);
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0
  });

  function handleSubmit(e) {
    e.preventDefault();
    setMapCenter({
      lat: parseInt(e.target[0].value),
      lng: parseInt(e.target[1].value)
    })
    const requestOptions = {
      method: 'GET',
      headers: { 'x-api-key': '5jXgI7SclB3gf4QB2dmP1ra6RQRqRVtH' },
      };
  fetch('https://api.meteostat.net/v2/stations/nearby?lat=' + e.target[0].value + '&lon=' + e.target[1].value + '&limit=3', requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.data) {
          setArea(data.data[0].name.en);
          fetch('https://api.meteostat.net/v2/stations/hourly?station=' + data.data[0].id + '&start=' + e.target[2].value + '&end=' + e.target[2].value, requestOptions)
            .then(response => response.json())
            .then(data => {
              if(data.data) {
                let tableEntries = [];
                let dateOfIncident = moment(e.target[2].value + " " + e.target[3].value);
                let startOfDate = dateOfIncident.startOf('hour')
                for(let i = 0; i < data.data.length; i++) {
                  if (startOfDate.toString() === moment(data.data[i].time).toString()) {
                    let tableEntries = [
                      createData("Temperature", data.data[i].temp ? data.data[i].temp + "C" : "No Value"),
                      createData("Dew Point", data.data[i].dwpt ? data.data[i].dwpt  + "C" : "No Value"),
                      createData("Relative Humidity", data.data[i].rhum ? data.data[i].rhum + "%" : "No Value"),
                      createData("Precipitation", data.data[i].prcp ? data.data[i].prcp + "mm" : "No Value"),
                      createData("snow", data.data[i].snow || "No Value"),
                      createData("Wind Direction", data.data[i].wdir ? data.data[i].wdir : "No Value"),
                      createData("Wind Speed", data.data[i].wspd ? data.data[i].wspd + "km/h" : "No Value"),
                      createData("Wind Gust", data.data[i].wpgt ? data.data[i].wpgt + "km/h" : "No Value"),
                      createData("Pressure", data.data[i].pres ? data.data[i].pres + "hPa" : "No Value"),
                      createData("One Hour Sunshine Total", data.data[i].tsun ? data.data[i].tsun + "Minutes" : "No Value"),
                      createData("Conditional Code", data.data[i].coco ? data.data[i].coco : "No Value")
                    ]
                    setTableData(tableEntries);
                  }
                }
              } else {
                setTableData([createData('No values have been set yet')]);
              }
            });
        }
      });
  }
  
  return (
    <div className="App">
        <Row className="info">
          <Col xs={6}>
            <EnrichedMap center={mapCenter}/>
          </Col>
          <Col xs={6}>
          <h1> {area} </h1>
            <WeatherTable tableData={tableData}/>
          </Col>
        </Row>
        <Row className="input">
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
              Day of incident:
            <input type="text" name="latitude" placeholder="E.G. 2021-01-01"/>        
            </label>
            <label>
              Time of incident:
            <input type="text" name="longitude" placeholder="E.G. 00:00:00"/>        
            </label>
            <input type="submit" value="Submit" />
          </form>
        </Row>
    </div>
  );
}

export default App;
