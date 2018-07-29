import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Loader from './Loader';
import logo from './logo.svg';

import { 
  getVendors,
  getManufacturers,
  getContracts,
  getShippers,
} from './api';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      vendors: [],
      manufacturers: [],
      contracts: [],
      shipments: [],
      shippers: []
    }
  }
  componentDidMount() {
    Promise.all([
      getVendors(),
      getManufacturers(),
      getContracts(),
      getShippers(),
    ])
    .then(resp => console.log(resp));
  }
  createContract = () => {

  }
  createVendor = () => {

  }
  createShipper = () => {

  }
  createShipment = () => {

  }
  createManufacturer = () => {

  }
  addOrUpdateLocation = () => {

  }
  shipmentReceived = () => {
    
  }
  render() {
    return (
      <div className="App">
        {this.state.isLoading && <Loader />}
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
