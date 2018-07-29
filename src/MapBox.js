/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import _ from 'lodash';

const findResult = (results, name) => {
  const result = _.find(
    results,
    obj => obj.types[0] === name && obj.types[1] === 'political'
  );
  return result ? result.long_name : null;
};
const getAddress = (addr = {}) => {
  const shortAddress = addr.formatted_address;
  const lat = _.result(addr, 'geometry.location.lat', null);
  const lng = _.result(addr, 'geometry.location.lng', null);
  const results = addr.address_components;
  const city = findResult(results, 'locality');
  const state = findResult(results, 'administrative_area_level_1');
  const country = findResult(results, 'country');
  return { shortAddress, city, state, country, loc: [lng, lat] };
};
class GMap extends Component {
  constructor(props) {
    super(props);
    const that = this;
    that.map = {};
  }
  componentDidMount() {
    this.setLocation(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { lat: prevLat, lng: prevLng } = _.get(this.props, 'location', '');
    const { lat, lng } = _.get(nextProps, 'location', '');
    if (prevLat !== lat || prevLng !== lng) {
      this.updateLocation(lat, lng);
    }
  }
  setLocation(props) {
    const that = this;
    const gMapDiv = ReactDOM.findDOMNode(that.refs.gmap);
    const location = props.initialLocation;
    that.map = new google.maps.Map(gMapDiv, {
      zoom: props.zoom || 13,
      center: { lat: location.lat, lng: location.lng },
    });
    that.marker = new google.maps.Marker({ map: that.map, draggable: this.props.draggable, position: {lat: location.lat, lng: location.lng}});
    that.map.addListener('click', function(event) {
      const clickedLocation = event.latLng;
      if (that.marker === false) {
        that.marker = new google.maps.Marker({
          position: clickedLocation,
          map: that.map,
          draggable: this.props.draggable,
        });
      } else {
        that.marker.setPosition(clickedLocation);
      }
    });
    // that.marker.addListener('dragend',
    //   (e) => {
    //     console.log('drag end', e.latLng.lat(), e.latLng.lng());
    //     // this.getAddress(e.latLng.lat(), e.latLng.lng());
    //     this.props.onLocationChange(e.latLng.lat(), e.latLng.lng());
    //   });
    
      const input = document.getElementById('gmap-search');
      const searchBox = new google.maps.places.SearchBox(input);
      that.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      that.map.addListener('bounds_changed', () => { // just for biased search results in map.
        searchBox.setBounds(that.map.getBounds());
      });
      searchBox.addListener('places_changed', () => {
        const bounds = new google.maps.LatLngBounds();
        const places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        places.forEach((place) => {
          if (!place.geometry) {
            return;
          }
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
          that.map.fitBounds(bounds);
        });
        that.marker.setPosition(places[0].geometry.location);
        const addr = getAddress(places[0]);
        this.props.onLocationChange(addr);
      });
    
  }
  getAddress() {
    console.log("get Address");
    const that = this;
    const lat = that.marker.position.lat();
    const lng = that.marker.position.lng();
    return Axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=false`)
      .then(response => response)
      .catch(err => err);
  }
  updateLocation(lat, lng) {
    const that = this;
    console.log('update location', lat, lng);
    const latlng = new google.maps.LatLng(lat, lng);
    that.marker.setPosition(latlng);
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(that.marker.getPosition());
    that.map.fitBounds(bounds);
    that.map.setZoom(that.props.zoom);
  }
  render() {
    const that = this;
    const props = that.props;
    const inputStyles = { zIndex: '99999 !important', backgroundColor: '#fff', fontSize: '15px', fontWeight: '300',
      margin: '10px 0 0 12px', padding: '0 11px 0 13px', width: '60%', height: '30px',  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'};
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <input id="gmap-search" className="pt-input" style={inputStyles} type="text" placeholder="Search"/>
        <div className={props.className} style={{ minHeight: '210px' }} ref='gmap'></div>
      </div>
    );
  }
}
// GMap.propTypes = {
//     onLocationChange: PropTypes.func,
//     location:PropTypes.object,
//     style: PropTypes.object,
//     className: PropTypes.string,
//     zoom: PropTypes.number,
//     initialLocation: PropTypes.object.isRequired,
//     showSearchBox: PropTypes.bool,
//     draggable: PropTypes.bool,
//   };
export default GMap;
