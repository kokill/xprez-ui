import React from "react";
import shortid from 'shortid';
import _ from 'lodash';
import Loader from './Loader';
import moment from 'moment';
import Rodal from 'rodal';
import MapBox from './MapBox';
// include styles
import 'rodal/lib/rodal.css';
import { 
  getVendors,
  getManufacturers,
  createShipment,
  getContracts,
  getShipments,
  getShippers,
  shipmentReceived,
  updateLocation,
} from './api';
const NS = 'resource:org.xprez.delivery';
class Shipment extends React.Component {
  state = {
    list: [],
    loading: true,
    showAddLocationModal: false,
    showLocationHistory: false,
    currentShipment: null,
    showAllDocuments: false,
    location: {
      lat: '',
      lng: '',
      city: '',
      state: '',
      shipment: '',// resource:org.acme.shipping.xprez.Shipment#SHIP_001
      transactionId: '',// aecf7279-404f-4893-9a1b-c1efdce30faa,
      timestamp: new Date()
    },
    contractsList: [],
    shipment: {
      contract: '', // resource:org.xprez.delivery.Contract#5108
      shipmentId: shortid(),
      type: '',
      status: 'IN_TRANSIT',
      unitCount: 0
    },
  }
  fetchData = () => {
    getShipments()
    .then(resp => {
      this.setState({list: resp.data, loading: false})
    })
  }
  componentDidMount() {
    this.fetchData();
    getContracts()
    .then(resp => {
      this.setState({contractsList: [{contractId: 'Select', disabled: true}, ...resp.data]})
    })
  }
  showLocationData = (locationList) => {
    return (
      <div>
          <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">City</th>
              <th scope="col">State</th>
              <th scope="col">Date/Time</th>
              <th scope="col">Latitude</th>
              <th scope="col">Longitude</th>
            </tr>
          </thead>
          <tbody>
          {(locationList || []).map((p, index) => 
          <tr key={index} className="table-success">
            <td>{index + 1}</td>
            <td>{p.state}</td>
            <td>{p.city}</td> 
            <td>{moment(p.timestamp).format('lll')}</td> 
            <td>{Number(p.lat).toFixed(2) || 'N/A'}</td>
            <td>{Number(p.lng).toFixed(2) || 'N/A'}</td>
          </tr>
          )}
          
      </tbody>
    </table>
      </div>
    )
  }
  showDocuments = () => {
    const { currentShipment } = this.state;
    const x = _.random(9);
    const data1 = [
      { name: 'Quote', num: `Q${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'PO', num: `P${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Invoice', num: `I${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Shipment', num: `S${x}${x}${x}`, date: '29-07-18', count: 3 },
    ];
    const data2 = [
      { name: 'Invoice', num: `I${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Loading Bill', num: `B${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Received Doc', num: `R${x}${x}${x}`, date: '29-07-18', count: 3 },
    ];
    const data3 = [
      { name: 'PO', num: `P${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Invoice', num: `I${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Shipment', num: `S${x}${x}${x}`, date: '29-07-18', count: 3 },
      { name: 'Incoming Receipt', num: `IR${x}${x}${x}`, date: '29-07-18', count: 3 },
    ];
    return (
      <div>
        <br />
      {currentShipment.status === 'ARRIVED' && <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Document Name</th>
              <th scope="col">Document No.</th>
              <th scope="col">Date</th>
              <th scope="col">No. of Documents</th>
            </tr>
          </thead>
          <tbody>
          {(data1 || []).map((p, index) => 
          <tr key={index} className="table-success">
            <td>{index + 1}</td>
            <td>{p.name}</td>
            <td>{p.num}</td> 
            <td>{p.date}</td> 
            <td>{p.count}</td> 
          </tr>
          )}
      </tbody>
      </table>}
          <br />
          <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Document Name</th>
              <th scope="col">Document No.</th>
              <th scope="col">Date</th>
              <th scope="col">No. of Documents</th>
            </tr>
          </thead>
          <tbody>
          {(data2 || []).map((p, index) => 
          <tr key={index} className="table-success">
            <td>{index + 1}</td>
            <td>{p.name}</td>
            <td>{p.num}</td> 
            <td>{p.date}</td> 
            <td>{p.count}</td> 
          </tr>
          )}
      </tbody>
    </table>
    <br />
    { currentShipment.status === 'ARRIVED' && <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Document Name</th>
              <th scope="col">Document No.</th>
              <th scope="col">Date</th>
              <th scope="col">No. of Documents</th>
            </tr>
          </thead>
          <tbody>
          {(data3 || []).map((p, index) => 
          <tr key={index} className="table-success">
            <td>{index + 1}</td>
            <td>{p.name}</td>
            <td>{p.num}</td> 
            <td>{p.date}</td> 
            <td>{p.count}</td> 
          </tr>
          )}
      </tbody>
    </table>}

    </div>
    )
  }
  handleSelectChange = (e) => {
    console.log(e.target.name, e.target.value);
    const st = this.state.shipment;
    _.set(st, e.target.name, e.target.value);
    this.setState({shipment: st});
  }
  handleChange = (e) => {
    const st = this.state.shipment;
    _.set(st, e.target.name, e.target.value);
    this.setState({detail: st});
  }
  addShipment = () => {
    const shipmentData = {
      contract: `${NS}.Contract#${this.state.shipment.contract}`,
      shipmentId: this.state.shipment.shipmentId,
      type: this.state.shipment.type,
      status: this.state.shipment.status,
      unitCount: this.state.shipment.unitCount
    };
    console.log(shipmentData);
    createShipment(shipmentData)
    .then(resp => {
      console.log(resp);
      this.fetchData();
      this.setState({
        shipment: {
          contract: '', // resource:org.xprez.delivery.Contract#5108
          shipmentId: shortid(),
          type: '',
          status: 'IN_TRANSIT',
          unitCount: 0
        },
        loading: false
      })
    });
    this.setState({loading: true});
  }
  handleLocationChange = (e) => {
    const st = this.state.location;
    _.set(st, e.target.name, e.target.value);
    this.setState({location: st});
  }
  addLocation = () => {
    const locationData = {
      shipment: `${NS}.Shipment#${this.state.currentShipment.shipmentId}`,
      city: this.state.location.city,
      state: this.state.location.state,
      lat: Number(this.state.location.lat),
      lng: Number(this.state.location.lng),
      timestamp: this.state.location.timestamp,
    };
    updateLocation(locationData)
    .then(resp => {
      console.log(resp)
      this.fetchData();
      this.setState({
        showAddLocationModal: false,
        loading: false,
        location: {
          lat: '',
          lng: '',
          city: '',
          state: '',
          shipment: '',
          transactionId: '',
          timestamp: new Date()
        }
      })
    })
    this.setState({loading: true});
  }
  updateShipment = (shipmentId) => {
    const data = {
      shipment: `${NS}.Shipment#${shipmentId}`,
      timestamp: new Date(),
    }
    shipmentReceived(data)
    .then(resp => {
      console.log(resp);
      this.fetchData();
    })
  }
  handleMapChange = (addr) => {
    const st = this.state.location;
    _.set(st, 'lat', addr.loc[1]);
    _.set(st, 'lng', addr.loc[0]);
    _.set(st, 'city', addr.city);
    _.set(st, 'state', addr.state);
    console.log(st);
    this.setState({location: st});
  }
  getList = (item) => {
    const cName = item.status === 'IN_TRANSIT' ? 'border-primary' : 'text-white bg-success'
    return (
      <div key={item.shipmentId} className={`card ${cName} mb-3`}>
        <div className="card-header">Status: {item.status}</div>
        <div className="card-body">
          {/* <h4 className="card-title">Balance: {item.accountBalance}</h4> */}
          <p className="card-text">
          Type: <b>{item.type}</b><br />
          Unit Count: <b>{item.unitCount}</b><br />
          </p>
        </div>
        {item.status !== 'ARRIVED' && <div className="card-footer text-muted">
          <button style={{margin: '0 5px'}} onClick={() => this.setState({currentShipment: item, showLocationHistory: true})} className="btn btn-info">Show History</button>
          <button style={{margin: '0 5px'}} onClick={() => this.setState({currentShipment: item, showAddLocationModal: true})} className="btn btn-danger">Update Location</button>
          <button style={{margin: '0 5px'}} className="btn btn-success" onClick={this.updateShipment.bind(this, item.shipmentId)}>Received</button>
          <button style={{margin: '0 5px'}} className="btn btn-success" onClick={() => this.setState({currentShipment: item, showAllDocuments: true})}>Documents</button>
        </div>}
        {item.status === 'ARRIVED' && <div className="card-footer text-muted">
          <button style={{margin: '0 5px'}} onClick={() => this.setState({currentShipment: item, showLocationHistory: true})} className="btn btn-info">Show History</button>
          <button style={{margin: '0 5px'}} className="btn btn-success" onClick={() => this.setState({currentShipment: item, showAllDocuments: true})}>Documents</button>
        </div>}
      </div>
    );
  }
  getForm() {
    const { shipment, contractsList } = this.state;
    return (
      <div>
        <br />
        <h3>Create Shipment</h3>
        <div className="form-group">
          <label htmlFor="exampleSelect1">Select Contract</label>
          <select selected={shipment.contract || 'Select'} name="contract" onChange={this.handleSelectChange} className="form-control" id="exampleSelect1">
            {contractsList.map(v => <option key={v.contractId}>{v.contractId}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-sm" htmlFor="inputLarge">
            Type
          </label>
          <input
            onChange={this.handleChange}
            value={shipment.type}
            className="form-control form-control-sm"
            name="type"
            placeholder="Shipment Type"
          />
        </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-sm" htmlFor="inputLarge">
            Unit Count
          </label>
          <input
            onChange={this.handleChange}
            className="form-control form-control-sm"
            type="text"
            value={shipment.unitCount || ''}
            name="unitCount"
            placeholder="Unit Count"
          />
        </div>
        <div className="form-group">
          <button type="button" onClick={this.addShipment} className="btn btn-primary btn-block">ADD</button>
        </div>
      </div>
    );
  }
  render() {
    const {loading, location, showAllDocuments, currentShipment, showLocationHistory, showAddLocationModal, list } = this.state;
    return (
      <div>
        {loading && <Loader />}
        <br />
        <div className="row">
          <div className="col-md-6 auto">
            <h3>Shipments</h3>
            {list.map(l => this.getList(l))}
          </div>
          <div className="col-md-5 auto">
            {this.getForm()}
          </div>
          <Rodal
            height={320}
            visible={showAddLocationModal}
            onClose={() => this.setState({showAddLocationModal: false})}>
            <MapBox
                name="mapBox"
                initialLocation={{lat: 26.406691, lng: -81.810533}}
                onLocationChange={this.handleMapChange}
            />
            <br />
            <div className="form-group">
              <button type="button" className="btn btn-primary btn-block" onClick={this.addLocation}>SAVE</button>
            </div>
          </Rodal>
          {showLocationHistory && <Rodal height={300}
            width={550}
            customStyles={{overflowY: 'scroll'}}
            visible={showLocationHistory}
            onClose={() => this.setState({showLocationHistory: false})}>
            {this.showLocationData(currentShipment.locationReadings)}
          </Rodal> }
          {showAllDocuments && <Rodal width={'600'} height={300}
            customStyles={{overflowY: 'scroll'}}
            visible={showAllDocuments}
            onClose={() => this.setState({showAllDocuments: false})}>
            {this.showDocuments()}
          </Rodal>}
        </div>
      </div>
    )
  }
}
export default Shipment;
