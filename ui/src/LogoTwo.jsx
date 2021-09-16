import React from 'react';
import logo from './assets/logo.png'; // Tell webpack this JS file uses this image

// LogoTwo is the class which contains the logo
// eslint-disable-next-line react/prefer-stateless-function
class LogoTwo extends React.Component {
  render() {
    const style = { margin: '50px 0px 50px 300px' };
    // Import result is the URL of your image
    return (
      <img src={logo} alt="Logo" style={style} />
    );
  }
}

export default LogoTwo;
