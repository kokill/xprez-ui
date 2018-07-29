import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from './App';
import Manufacturer from './Manufacturer';
import Vendor from './Vendor';
import Shipment from './Shipment';
import Contract from './Contract';
import Logistics from './Logistics';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
      <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="#">ToolXprez</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
          <Link className="nav-link" to="/contracts">Contracts</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/shipments">Shipments</Link>
          </li>          
          <li className="nav-item">
            <Link className="nav-link" to="/vendors">Vendors</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/logistics">Logistics</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/manufacturers">Manufacturers</Link>
          </li>
        </ul>
        {/* <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="text" placeholder="Search" />
          <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form> */}
        </div>
      </nav>
      <div className="container">
        <Route exact path="/" component={App} />
        <Route path="/manufacturers" component={Manufacturer} />
        <Route path="/vendors" component={Vendor} />
        <Route path="/shipments" component={Shipment} />
        <Route path="/logistics" component={Logistics} />
        <Route path="/contracts" component={Contract} />
      </div>
    </div>
  </Router>, document.getElementById('root'));
registerServiceWorker();
