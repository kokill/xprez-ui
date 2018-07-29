import React from "react";
import shortid from 'shortid';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-date-picker';

import { 
  getVendors,
  getManufacturers,
  getContracts,
  getShippers,
  createContract,
} from './api';
class Contract extends React.Component {
  state = {
    list: [], // contracts
    vendorsList: [],
    manufacturersList: [],
    shippersList: [],
    contract: {
      contractId: shortid(),
      vendor: '', // org.xprez.delivery.Contract@email
      shipper: '',
      manufacturer: '',
      unitPrice: 0,
      arrivalDateTime: new Date(),
    },
  }
  fetchData = () => {
    getContracts()
    .then(resp => {
      this.setState({list: resp.data})
    })
  }
  componentDidMount() {
    this.fetchData();
    getVendors()
    .then(resp => {
      this.setState({vendorsList: [{email: 'Select', disabled: true}, ...resp.data]})
    })
    getManufacturers()
    .then(resp => {
      this.setState({manufacturersList: [{email: 'Select', disabled: true}, ...resp.data]})
    })
    getShippers()
    .then(resp => {
      this.setState({shippersList: [{email: 'Select', disabled: true}, ...resp.data]})
    })
  }
  handleSelectChange = (e) => {
    console.log(e.target.name, e.target.value);
    const st = this.state.contract;
    _.set(st, e.target.name, e.target.value);
    this.setState({detail: st});
  }
  handleDateChange = (data) => {
    const st = this.state.contract;
    _.set(st, 'arrivalDateTime', data);
    this.setState({detail: st});
  }
  handleChange = (e) => {
    const st = this.state.contract;
    _.set(st, e.target.name, e.target.value);
    this.setState({detail: st});
  }
  addContract = () => {
    console.log(this.state.contract);
    const NS = 'resource:org.xprez.delivery';
    const contractData = {
      contractId: this.state.contract.contractId,
      vendor: `${NS}.Vendor#${this.state.contract.vendor}`,
      shipper: `${NS}.Shipper#${this.state.contract.shipper}`,
      manufacturer: `${NS}.Manufacturer#${this.state.contract.manufacturer}`,
      unitPrice: Number(this.state.contract.unitPrice),
      arrivalDateTime: this.state.contract.arrivalDateTime,
    }
    createContract(contractData)
    .then(resp => {
      this.fetchData();
      console.log(resp);
    })
  }
  getList = (item) => {
    const vendor = String(item.vendor).split('#')[1];
    const shipper = String(item.vendor).split('#')[1];
    const manufacturer = String(item.manufacturer).split('#')[1];
    return (
      <div key={item.contractId} className="card border-primary mb-3" style={{maxWidth: '20rem'}}>
        <div className="card-header">Arrival Date: {moment(item.arrivalDateTime).format('lll')}</div>
        <div className="card-body">
          {/* <h4 className="card-title">Balance</h4> */}
          <p className="card-text">
            Contract Id:&nbsp;<b>&nbsp;{item.contractId}</b><br />
            Vendor:&nbsp;<b>&nbsp;{vendor}</b><br />
            Manufacturer:&nbsp;<b>&nbsp;{manufacturer}</b><br />
          </p>
        </div>
        <div className="card-footer text-muted">
          <button className="btn btn-success">Documents</button>
        </div>
      </div>
    );
  }
  getForm() {
    const { contract, vendorsList, manufacturersList, shippersList } = this.state;
    return (
      <div>
        <br />
        <h3>Create Contract</h3>
        <div className="form-group">
          <label htmlFor="exampleSelect1">Select Vendor</label>
          <select selected={contract.vendor || 'Select'} name="vendor" onChange={this.handleSelectChange} className="form-control" id="exampleSelect1">
            {vendorsList.map(v => <option key={v.email}>{v.email}</option>)}
          </select>
        </div>
        
          <div className="form-group">
            <label htmlFor="exampleSelect2">Select Manufacturer</label>
            <select selected={contract.manufacturer || 'Select'} name="manufacturer" onChange={this.handleSelectChange} className="form-control" id="exampleSelect1">
              {manufacturersList.map(v => <option key={v.email}>{v.email}</option>)}
            </select>
          </div>
        
          <div className="form-group">
            <label htmlFor="exampleSelect3">Select Shipper</label>
            <select selected={contract.shipper || 'Select'} name="shipper" onChange={this.handleSelectChange} className="form-control" id="exampleSelect1">
              {shippersList.map(v => <option key={v.email}>{v.email}</option>)}
            </select>
          </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-sm" htmlFor="inputLarge">
            Unit Price
          </label>
          <input
            name="unitPrice"
            onChange={this.handleChange}
            className="form-control form-control-sm"
            type="number"
            placeholder="Unit Price"
          />
        </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">
            Arrival Time
          </label>
          <br />
          <DatePicker onChange={this.handleDateChange} value={contract.arrivalDateTime} />
        </div>
        <div className="form-group">
          <button type="button" onClick={this.addContract} className="btn btn-primary btn-block">ADD</button>
        </div>
      </div>
    );
  }
  render() {
    const { list, addNew } = this.state;
    return (
      <div>
        <br />
        <div className="row">
          <div className="col-md-5 auto">
            <h3>Contracts</h3>
            {list.map(this.getList)}
          </div>
          <div className="col-md-5 auto">
            {this.getForm()}
          </div>
        </div>
      </div>
    )
  }
}
export default Contract;
