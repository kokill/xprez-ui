import Request from 'axios';
const baseURL = 'http://localhost:3000/api';
const makeRequest = (type, api, data) => {
    return Request[type](baseURL+api, data);
};
export const getVendors = () => {
    return makeRequest('get', '/Vendor');
};
export const getManufacturers = () => {
    return makeRequest('get', '/Manufacturer');
};
export const getContracts = () => {
  return makeRequest('get', '/Contract');
};
export const getShipments = () => {
  return makeRequest('get', '/Shipment');
};
export const getShippers = () => {
  return makeRequest('get', '/Shipper');
};

export const createVendor = (data) => {
  return makeRequest('post', '/Vendor', data);
};
export const createManufacturer = (data) => {
  return makeRequest('post', '/Manufacturer', data);
};
export const createShipper = (data) => {
  return makeRequest('post', '/Shipper', data);
};
export const createContract = (data) => {
  return makeRequest('post', '/Contract', data);
};
export const createShipment = (data) => {
  return makeRequest('post', '/Shipment', data);
};
export const updateLocation = (data) => {
  return makeRequest('post', '/LocationReading', data);
};
export const shipmentReceived = (data) => {
  return makeRequest('post', '/ShipmentReceived', data);
};