import React, { Component } from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';

export class Token extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      message: localStorage.getItem("message"),
    }
    this.Token = "";
    this.site = "token";
    this.failedMessage = 'Se ha presentado una falla.\nPor favor avisarle al administrador.';
  }

  updateUser() {
    console.log(REACT_APP_API_URL + this.site + '/activate')
    fetch(REACT_APP_API_URL + this.site + '/activate', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.Token
      },
      body: JSON.stringify({
        token: this.state.Token
      })
    })
      .then(res => res.json())
      .then((data) => {
        if (!data.message) {
          console.log(data.error);
          alert(data.error)
        } else {
          localStorage.setItem("message", data.message);
          this.setState({ message: data.message });
          setTimeout(console.log('href', window.location.href), 2000);
          let spl = window.location.href.split('?');
          window.location.replace(spl[0]);
        }
      }, (error) => {
        alert(this.failedMessage);
      });
  }

  getParams() {
    let params = {};
    window.location.search.slice(1).split('&').forEach(elm => {
      if (elm === '') return;
      let spl = elm.split('=');
      const d = decodeURIComponent;
      params[d(spl[0])] = (spl.length >= 2 ? d(spl[1]) : true);
    });
    if (!params.value || !params.Token) {
      localStorage.removeItem("message");
    } else {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.Token = params.value;
      this.Token = params.Token;
      //Call the: post(), put(), delete(), options(), trace(), copy(), lock(), mkcol(), 
      //move(), purge(), propfind(), proppatch(), unlock(), report(), mkactivity(), checkout(), 
      //merge(), m-search() , notify(), subscribe(), unsubscribe(), patch(), search(), and connect().
      this.updateUser()
    }
  }

  componentDidMount() {
    this.getParams();
  }

  render() {
    const {
      message
    } = this.state;
    return (
      <div>
        <h3 className="d-flex justify-content-center m-3">
          {message}
        </h3>
      </div>
    )
  }
}
