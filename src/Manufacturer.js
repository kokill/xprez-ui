import React from "react";
import shortid from 'shortid';
import Loader from './Loader';
import _ from 'lodash';
import { 
  getManufacturers,
  createManufacturer,
} from './api';
class Manufacturer extends React.Component {
  state = {
    list: [],
    loading: true,
    detail: {
      email: '',
      address: {
        city: '',
        country: '',
        state: '',
        zip: '',
        id: ''
      },
      accountBalance: 0
    }
  }
  fetchData = () => {
    getManufacturers()
    .then(resp => {
      this.setState({loading: false, list: _.reverse(resp.data)})
    })
  }
  componentDidMount() {
    this.fetchData();
  }
  handleChange = (e) => {
    const st = this.state.detail;
    _.set(st, e.target.name, e.target.value);
    this.setState({detail: st});
  }
  addNewManufacturer = () => {
    createManufacturer(this.state.detail)
      .then(resp => {
        console.log(resp);
        this.fetchData();
        this.setState({
          loading: false,
          detail: {
            email: '',
            address: {
              city: '',
              country: '',
              state: '',
              zip: '',
              id: ''
            },
            accountBalance: 0
          }
        });
      });
    this.setState({loading: true});
  }
  getList = (item) => {
    return (
      <div key={item.email} className="card border-primary mb-3" style={{maxWidth: '20rem'}}>
        <div className="card-header">Email: <b>{item.email}</b></div>
        <div className="card-body">
          <h4 className="card-title">Balance: <b>{item.accountBalance}</b></h4>
          <p className="card-text">
          <b>Address:</b><br />
            City: {item.address.city}
            <br />
            State: {item.address.state}
          </p>
        </div>
      </div>
    );
  }
  getForm() {
    const { detail } = this.state;
    return (
      <div>
        <br />
        <h3>Add Manufacturer</h3>
        <div className="form-group">
          <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">
            Email
          </label>
          <input
            onChange={this.handleChange}
            value={detail.email}
            name="email"
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">
            Account Balance
          </label>
          <input
            onChange={this.handleChange}
            value={detail.accountBalance || ''}
            name="accountBalance"
            className="form-control form-control-lg"
            type="number"
            placeholder="Initial Account Balance"
          />
        </div>
        <div className="form-group">
          <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">
            Address
          </label>
          <input
            onChange={this.handleChange}
            className="form-control form-control-sm"
            name="address.city"
            value={detail.address.city}
            type="text"
            placeholder="City"
          />
          <br />
          <input
            onChange={this.handleChange}
            name="address.state"
            className="form-control form-control-sm"
            value={detail.address.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="form-group">
          <button type="button" onClick={this.addNewManufacturer} className="btn btn-primary btn-block">ADD</button>
        </div>
      </div>
    );
  }
  render() {
    const { list, loading } = this.state;
    return (
      <div>
        {loading && <Loader />}
        <br />
        <div className="row">
          <div style={{ overflowY: 'scroll', maxHeight: '80vh'}} className="col-md-5 auto">
            <h3>Manufacturers</h3>
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
export default Manufacturer;
