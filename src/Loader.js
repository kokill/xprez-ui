import React from 'react';
import Loader from 'react-loaders';
import 'loaders.css/loaders.min.css';
export default () => {
  return <div className="CustomLoader">
    <Loader type="ball-beat" color="#008cba" active />
    </div>
}