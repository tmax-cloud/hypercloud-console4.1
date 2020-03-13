import React, { Component, setState } from 'react';
//import { Link } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
//import { App } from './app';
import * as bgLoginNavy from '../imgs/bg_login_navy2.png';
import * as logoAc from '../imgs/logo_ac.svg';
import * as productHyperCloudLogo from '../imgs/product_hypercloud_logo.svg';
import { coFetchJSON } from '../co-fetch';
import '../style.scss';
import { sha512 } from 'js-sha512';

class LoginComponent extends Component {
  // useState 대신 useRef 써도 됨
  state = {
    id: '',
    pw: '',
    error: '',
  };

  constructor(props) {
    super(props);
    if (props.history.action !== 'REPLACE') {
      history.pushState(null, null, location.href);
      window.onpopstate = function(event) {	
      history.go(1);
      } 
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount');
  };

  onClick = (e) => {
    if (e.type === 'keypress' && e.key !== 'Enter') {
      return;
    }

    const AUTH_SERVER_URL = 'https://192.168.6.225:8088/v3/_api/authenticate';
    
    //if (this.state.id !== undefined && this.state.pw !== undefined) {
      const json = {
        'dto':
        {
          'user_id': this.state.id, 'password': sha512(this.state.pw)
        }
      };
      
      coFetchJSON.post(AUTH_SERVER_URL, json)
        .then(data => {
          if (data.dto.result !== 'true') {
            this.setState({error: data.dto.error});
            return;
          }
          // const url_ = window.location.href.split('/login')[0]
          // window.location = `${url_}/status/all-namespaces`;
          this.props.history.push('/status/all-namespaces');
        })
        .catch(error => {
          console.log(error);
        });
  //}
  };
  
  render() {
    return (
      <div id="login">
        <div id="bg-large">
          <div>
            <img src={bgLoginNavy} className="bg-navy" />
          </div>
          <div id="bg-big-blank" className="bg-blank"></div>
        </div>
        <div id="bg-small">
          <div>
            <div id="bg-small-middle" className="bg-blank"></div>
            <div id="bg-small-blank"></div>
          </div>
        </div>
        <div id="contents">
          <div className="inner_logo">
            <div id="bg-logo-ac">
              <img src={logoAc} />
            </div>
            <div id="bg-logo-hc" className="logo">
              <img src={productHyperCloudLogo} />
            </div>
          </div>
          <div className="inner_login">
            <form>
              <input type="hidden"></input>
              <input type="hidden"></input>
              <div className="box_login">
                <div className="inp_text">
                  <input type="text" id="loginId" autoFocus="autofocus" placeholder="Email" value={this.state.id} onKeyPress={this.onClick} onChange={(e) => {this.setState({id: e.target.value})}}></input>
                </div>
                <div className="box_login">
                  <div className="inp_text">
                    <input type="password" id="inputPassword" placeholder="Password" value={this.state.pw} onKeyPress={this.onClick} onChange={(e) => {this.setState({pw: e.target.value})}}></input>
                  </div>
                </div>
                <div className="box_error">
                  <p className="error_text">{this.state.error}</p>
                </div>
                <div>
                  <button type="button" onClick={this.onClick} className="btn_login" style={{ cursor: 'pointer' }}>Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
};
export default LoginComponent;