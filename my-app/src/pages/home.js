/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import '../css/login.css';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: [],
      states: [],
      cities: [],
      medicalCenters: [],
      modalTitle: '',
      isLogin: false,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterNew: 0,
      medicalCenterId: '',
      medicalCenterName: '',
      medicalCenterAddress: '',
      medicalCenterTelNumber: '',
      StateStateId: 0,
      CityCityId: 0,
      stateName: '',
      cityName: '',
      ok: '',
      strengthBadge: 'Débil',
      backgroundColor: 'input-group-text alert alert-danger ', //'input-group-text m-1 text-centred bg_Débil' 
      RolesArray: [false, false, false, false],
      disabledArray: [false, false, false, false],
      Viewer: false,
      Clinic: false,
      Laboratory: false,
      Admin: false,
      Token: JSON.parse(localStorage.getItem('Token')),
      footer: REACT_APP_API_URL,
      arrayValidate: [true, true, true, true, true, true],
      arrayMessages: ['Correo', 'Contraseña', 'Centro Médico', 'Departamento o Ciudad', 'Reescribir Contraseña', 'Tipo de Usuario'],
      validateMessage: '',
      showModal: false,
    };
    this.site = 'auth';
    this.site2 = 'medicalcenter';
    this.site3 = 'state';
    this.site4 = 'city';
    this.strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
    this.mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
    this.failedMessage = 'Se ha presentado una falla.\nPor favor avisarle al administrador.';
    this.isFound = true;
    this.stateName = '';
    this.cityName = '';
    this.lim = 5;
  }

  submitClick() {
    this.setState({
      modalTitle: 'Registro',
      isLogin: false,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterNew: 0,
      medicalCenterId: '',
      medicalCenterName: '',
      medicalCenterAddress: '',
      medicalCenterTelNumber: '',
      StateStateId: 0,
      CityCityId: 0,
      stateName: '',
      cityName: '',
      strengthBadge: 'Débil',
      backgroundColor: 'input-group-text alert alert-danger ', //'input-group-text m-1 text-centred bg_Débil' 
      RolesArray: [true, false, false, false],
      disabledArray: [false, false, false, true],
      Viewer: true,
      Clinic: false,
      Laboratory: false,
      Admin: false,
      footer: REACT_APP_API_URL,
      arrayValidate: [true, true, true, true, true, true],
      validateMessage: '',
      showModal: true,
    });
    console.log('clean fields "submitClick"');
  }

  loginClick() {
    this.setState({
      modalTitle: 'Inicio Sesión',
      isLogin: true,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterNew: 0,
      medicalCenterId: 0,
      medicalCenterName: '',
      medicalCenterAddress: '',
      medicalCenterTelNumber: 0,
      StateStateId: 0,
      CityCityId: 0,
      RolesArray: [false, false, false, false],
      disabledArray: [true, true, true, true],
      footer: REACT_APP_API_URL,
      arrayValidate: [true, true, true, true, true, true],
      validateMessage: '',
      showModal: true,
    });
  }

  async refreshMedicalCenters() {
    console.log(`${REACT_APP_API_URL}${this.site2}/medicalcentername/${parseInt(this.state.medicalCenterId)}`);

    await fetch(`${REACT_APP_API_URL}${this.site2}/medicalcentername/${parseInt(this.state.medicalCenterId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        this.setState({
          medicalCenterNew: data.found,
          medicalCenters: data
        });

      }, (error) => {
        console.log(error);
      });
  }

  async getFromJson(json, key, value, index) {
    for (var i = 0; i < json.length; i++) {
      console.log('Cod: ' + json[i][key]);
      console.log('Nam: ' + json[i][value]);
      if (json[i][key] === index) {
        return json[i][value];
      }
    }
  }

  async refreshStates() {
    await fetch(`${REACT_APP_API_URL}${this.site3}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (!data || data.ok === false) {
          alert(this.alertMessage);
          return;
        }
        this.setState({ states: data });
        if (this.state.medicalCenterNew !== 0) {
          this.getFromJson(data, 'stateId', 'stateName', this.state.medicalCenters.StateStateId)
            .then((value) => {
              this.setState({ stateName: value });
              console.log(this.state.stateName);
            });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async refreshCities(cityId) {
    await fetch(`${REACT_APP_API_URL}${this.site4}/${cityId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (!data || data.ok === false) {
          alert(this.alertMessage);
          return;
        }
        this.setState({ cities: data });
        if (this.state.medicalCenterNew !== 0) {
          this.getFromJson(data, 'cityId', 'cityName', this.state.medicalCenters.CityCityId)
            .then((value) => {
              this.setState({ cityName: value });
              console.log(this.state.cityName);
            });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async componentDidMount() {
    await this.refreshStates();
    await this.refreshCities(this.state.states[1].stateId);
  }

  fillValidateMessage() {
    var st = '';
    for (var i = 0; i < this.state.arrayValidate.length; i++) {
      this.state.arrayValidate[i] === false ?
        st = st + this.state.arrayMessages[i] + ', ' :
        st = st + '';
    };
    st.length > 3 ? st = st.substring(0, st.length - 2) : st = '';
    st.length > 1 ? st = 'Datos pendientes: ' + st : st = '+'
    this.setState({ validateMessage: st });
  }

  onChangeEmail = async (e) => {
    await this.setState({ email: e.target.value });
  }

  onBlurEmail = async (e) => {
    await this.state.email.length > this.lim ?
      this.state.arrayValidate[0] = await true :
      this.state.arrayValidate[0] = await false;
    await this.fillValidateMessage();
  }

  onChangePassword = async (e) => {
    await this.setState({ password: e.target.value });
    await this.StrengthChecker(this.state.password);
  }

  onBlurPassword = async (e) => {
    await this.state.password.length > this.lim ?
      this.state.arrayValidate[1] = await true :
      this.state.arrayValidate[1] = await false;
    await this.onBlurEmail();
    if (await this.state.isLogin === false) {
      await this.onBlurEmail();
      await this.onBlurMedicalCenter();
      await this.onBlurStateCity();
    }
    await this.fillValidateMessage();
  }


  onChangeMedicalCenterId = async (e) => {
    await this.setState({ medicalCenterId: Math.abs(parseInt(e.target.value)) });
    if (String(this.state.medicalCenterId).length > this.lim) {
      await this.refreshMedicalCenters();
    }
    if (await this.state.medicalCenterNew !== 0) {
      console.log('onChangeMedicalCenterId');
      await this.refreshStates();
      await this.refreshCities(this.state.medicalCenters.StateStateId);
    }
  }

  onBlurMedicalCenterId = async (e) => {
    if (await this.state.medicalCenterNew !== 0) {
      await this.setState({
        medicalCenterName: this.state.medicalCenters.medicalCenterName,
        medicalCenterAddress: this.state.medicalCenters.medicalCenterAddress,
        medicalCenterTelNumber: this.state.medicalCenters.medicalCenterTelNumber,
        StateStateId: this.state.medicalCenters.StateStateId,
        CityCityId: this.state.medicalCenters.CityCityId,
      });
    };
    if (await this.state.medicalCenterId !== 0) {
      try {
        console.log(this.state.Token['rolesArray']);
        if (await this.state.Token['rolesArray'].includes('admin')) {
          await this.setState({ disabledArray: [false, false, false, false] });
        } else {
          await this.setState({ disabledArray: [false, false, false, true] });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  onChangeMedicalCenterName = async (e) => {
    await this.setState({ medicalCenterName: e.target.value });
  }

  onBlurMedicalCenter = async (e) => {
    await (String(this.state.medicalCenterId).length > this.lim && this.state.medicalCenterName.length > this.lim &&
      this.state.medicalCenterAddress.length > this.lim && String(this.state.medicalCenterTelNumber).length > this.lim) ||
      (this.state.medicalCenterNew !== 0) ?
      this.state.arrayValidate[2] = true :
      this.state.arrayValidate[2] = false;
    await this.onBlurEmail();
    await this.fillValidateMessage();
  }

  onChangeMedicalCenterAddress = async (e) => {
    await this.setState({ medicalCenterAddress: e.target.value });
  }

  onChangeMedicalCenterTelNumber = async (e) => {
    await this.setState({ medicalCenterTelNumber: Math.abs(parseInt(e.target.value)) });
  }

  onChangeState = async (e) => {
    await this.setState({ StateStateId: e.target.value });
    console.log('onChangeState', this.state.StateStateId);
    await this.refreshCities(this.state.StateStateId);
  }

  onChangeCity = async (e) => {
    await this.setState({ CityCityId: e.target.value });
    console.log(this.state.CityCityId);
  }

  onBlurStateCity = async (e) => {
    await this.state.StateStateId > 1 && this.state.CityCityId > 1000 ?
      this.state.arrayValidate[3] = true :
      this.state.arrayValidate[3] = false;
    await this.onBlurEmail();
    await this.onBlurMedicalCenter();
    await this.fillValidateMessage();
  }

  onChangePasswordAgain = async (e) => {
    await this.setState({ passwordAgain: e.target.value });
  }

  onBlurPasswordAgain = async (e) => {
    await this.state.password === this.state.passwordAgain &&
      this.state.strengthBadge !== 'Débil' ?
      this.state.arrayValidate[4] = true :
      this.state.arrayValidate[4] = false;
    await this.onBlurEmail();
    await this.onBlurMedicalCenter();
    await this.onBlurStateCity();
    await this.onBlurPassword();
    await this.fillValidateMessage();
  }

  onChangeViewer = async (e) => {
    await this.setState({ Viewer: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[0] = e.target.checked;
  }

  onChangeClinic = async (e) => {
    await this.setState({
      Clinic: e.target.checked,
      Laboratory: !e.target.checked
    });
    if (this.state.medicalCenterId !== 0) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.RolesArray[1] = e.target.checked;
      this.state.RolesArray[2] = !e.target.checked;
    }
  }

  onChangeLaboratory = async (e) => {
    await this.setState({
      Laboratory: e.target.checked,
      Clinic: !e.target.checked
    });
    if (this.state.medicalCenterId !== 0) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.RolesArray[2] = e.target.checked;
      this.state.RolesArray[1] = !e.target.checked;
    }
  }

  onChangeAdmin = async (e) => {
    await this.setState({ Admin: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[3] = await e.target.checked;
    console.log('email', this.state.email.length, 'pass', this.state.password.length);
    console.log('medId', this.state.medicalCenterId.toString().length, 'medNa', this.state.medicalCenterName.length);
    console.log('medAd', this.state.medicalCenterAddress.length, 'medTe', this.state.medicalCenterTelNumber.toString().length);
    console.log('compa', this.state.password === this.state.passwordAgain, 'Stre', this.state.strengthBadge);
    console.log('Check', (this.state.Viewer || this.state.Clinic || this.state.Laboratory || this.state.Admin));
    console.log('Depar', this.state.StateStateId, 'Ciud', this.state.CityCityId);
    ;
  }

  onBlurUserType = async (e) => {
    await this.state.Clinic || this.state.Laboratory || this.state.Admin ?
      this.state.arrayValidate[5] = true :
      this.state.arrayValidate[5] = false;
    await this.onBlurEmail();
    await this.onBlurMedicalCenter();
    await this.onBlurStateCity();
    await this.onBlurPassword();
    await this.onBlurPasswordAgain();
    await this.fillValidateMessage();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    console.log('this.handleSubmit');
    this.authClick();
  }

  StrengthChecker(PasswordParameter) {
    const bg_base = 'input-group-text mb-0 alert ';
    if (this.strongPassword.test(PasswordParameter)) {
      this.setState({ backgroundColor: bg_base + 'alert-success' });
      this.setState({ strengthBadge: 'Fuerte' });
    } else if (this.mediumPassword.test(PasswordParameter)) {
      this.setState({ backgroundColor: bg_base + 'alert-warning' });
      this.setState({ strengthBadge: 'Medio' });
    } else {
      this.setState({ backgroundColor: bg_base + 'alert-danger' });
      this.setState({ strengthBadge: 'Débil' });
    }
  }

  validateForm() {
    try {
      return (this.state.isLogin ?
        (this.state.email.length > this.lim && this.state.password.length > this.lim) :
        (this.state.email.length > this.lim && this.state.password.length > this.lim &&
          String(this.state.medicalCenterId).length > this.lim && this.state.medicalCenterName.length > this.lim &&
          this.state.medicalCenterAddress.length > this.lim && String(this.state.medicalCenterTelNumber).length > this.lim &&
          this.state.password === this.state.passwordAgain &&
          this.state.strengthBadge !== 'Débil' &&
          (this.state.Clinic || this.state.Laboratory || this.state.Admin) &&
          this.state.StateStateId > 1 && this.state.CityCityId > 1000));
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  authClick() {
    console.log(this.state.modalTitle);
    console.log(this.state.Viewer, this.state.Clinic, this.state.Laboratory, this.state.Admin);
    if (this.state.isLogin) {
      fetch(`${REACT_APP_API_URL}${this.site}/signup/${this.state.email}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((data) => {
          if (data.found > 0) {
            fetch(`${REACT_APP_API_URL}${this.site}/signin`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
              })
            })
              .then(res => res.json())
              .then((data) => {
                this.setState({ auth: data })
                console.log(data);
                if (!this.state.auth.token) {
                  localStorage.removeItem('Token');
                  !this.state.auth.message
                    ? (!this.state.auth.error ? alert(this.failedMessage) : alert(this.state.auth.error))
                    : alert(this.state.auth.message);
                } else {
                  localStorage.setItem('Token', JSON.stringify(this.state.auth));
                  this.setState({ Token: JSON.parse(localStorage.getItem('Token')) });
                  // eslint-disable-next-line react/no-direct-mutation-state
                  this.state.Token = this.state.auth.token;
                  this.closeModal();
                  alert('Inicio de sesión exitoso \nUsted ya puede acceder los otros sitios.');
                }
              }, (error) => {
                localStorage.removeItem('Token');
                alert(this.failedMessage);
              });
          } else {
            alert('Usuario no Existe');
          }
        }, (error) => {
          localStorage.removeItem('Token');
          alert(this.failedMessage);
        });

    } else {
      fetch(`${REACT_APP_API_URL}${this.site}/signup/${this.state.email}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((data) => {
          this.setState({ auth: data })
          console.log(data, 'found:', this.state.auth.found);
          if (!data) {
            alert(this.failedMessage);
          } else {
            this.isFound = this.state.auth.found > 0;
            console.log(this.state.auth.found, this.isFound);
            if (this.isFound) {
              alert('El correo ya existe.');
            };
            if (!this.isFound) {
              let tokenExternal = '';
              try { tokenExternal = this.state.Token.token }
              catch (e) { console.log(e); }
              fetch(`${REACT_APP_API_URL}${this.site}/signup`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: this.state.email,
                  password: this.state.password,
                  medicalCenterId: parseInt(this.state.medicalCenterId),
                  medicalCenterName: this.state.medicalCenterName,
                  medicalCenterAddress: this.state.medicalCenterAddress,
                  medicalCenterTelNumber: parseInt(this.state.medicalCenterTelNumber),
                  StateStateId: parseInt(this.state.StateStateId),
                  CityCityId: parseInt(this.state.CityCityId),
                  Roles: this.state.RolesArray,
                  TokenExternal: tokenExternal,
                })
              })
                .then(res => res.json())
                .then((data) => {
                  alert(data.message);
                  console.log(data);
                  if (data.ok) {
                    this.submitClick(); //Clean fields after the correct creation
                  }
                }, (error) => {
                  alert(this.failedMessage);
                });
            }
          }
        }, (error) => {
          alert(this.failedMessage);
          console.log(error);
        });
    }
  }
  closeModal = () => {
    this.setState({ showModal: false });
  }

  renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {this.state.footer}
    </Tooltip>
  );

  render() {
    const {
      states,
      cities,
      medicalCenters,
      email,
      password,
      passwordAgain,
      medicalCenterNew,
      medicalCenterId,
      medicalCenterName,
      medicalCenterAddress,
      medicalCenterTelNumber,
      StateStateId,
      CityCityId,
      stateName,
      cityName,
      modalTitle,
      isLogin,
      strengthBadge,
      backgroundColor,
      //Viewer,
      Clinic,
      Laboratory,
      Admin,
      disabledArray,
      validateMessage,
      showModal,
    } = this.state;
    return (
      <div>
        <button type='submit' className='btn btn-primary m-2 float-end' onClick={() => this.submitClick()}>
          Soy Nuevo
        </button>
        <button type='submit' className='btn btn-primary m-2 float-end' onClick={() => this.loginClick()}>
          Ya Existo
        </button>

        <Modal show={showModal} className='fade' id='exampleModal' tabIndex='-1' aria-hidden='true'>
          <div className='dialog-centred'>
            <div className='content'>
              <Modal.Header className=''>
                <Modal.Title><h5 className=''>{(modalTitle)}</h5></Modal.Title>
                <button type='button' className='btn-close' onClick={() => this.closeModal()} aria-label='Cerrar'></button>
              </Modal.Header>
              <Modal.Body className='Login'>

                <Form onSubmit={this.handleSubmit}>
                  <div>
                    <Form.Group size='lg' controlId='email' className='form-group required'>
                      <Form.Label className='control-label'>Correo</Form.Label>
                      <Form.Control autoFocus type='email' value={email} placeholder='correo@electronico.srv'
                        onChange={this.onChangeEmail} onBlur={this.onBlurEmail} id='email'
                        autoComplete='username' required='required' />
                    </Form.Group>
                    {!isLogin ?
                      <Form.Group size='lg' className='form-group required'>
                        <div className='input-group mb-3'></div>
                        <Form.Label className='control-label'>Centro Médico</Form.Label>
                        <Form.Control type='number' className='form-control' value={medicalCenterId}
                          onChange={this.onChangeMedicalCenterId} placeholder='Nit Centro Médico'
                          onBlur={this.onBlurMedicalCenterId} id='medicalCenterId' required='required' />
                        {medicalCenterNew === 0 ?
                          <div>
                            <Form.Control type='name' className='form-control' placeholder='Nombre Centro Médico'
                              value={medicalCenterName} id='medicalCenterName'
                              onChange={this.onChangeMedicalCenterName} onBlur={this.onBlurMedicalCenter} />
                            <Form.Control type='name' className='form-control' placeholder='Dirección Centro Médico'
                              value={medicalCenterAddress} id='medicalCenterAddress'
                              onChange={this.onChangeMedicalCenterAddress} onBlur={this.onBlurMedicalCenter} />
                            <Form.Control type='number' className='form-control' placeholder='Teléfono Centro Médico'
                              value={medicalCenterTelNumber} id='medicalCenterTelNumber'
                              onChange={this.onChangeMedicalCenterTelNumber} onBlur={this.onBlurMedicalCenter} />
                            <div className='input-group mb-3'>
                              <select className='form-select' value={StateStateId} id='StateStateId'
                                onChange={this.onChangeState} onBlur={this.onBlurStateCity}>
                                <option hidden defaultValue value='0' key='0'>Departamento</option>
                                {states.map(sta => <option value={sta.stateId} key={sta.stateId}>
                                  {sta.stateName}
                                </option>)}
                              </select>
                              <select className='form-select' value={CityCityId} id='CityCityId'
                                onChange={this.onChangeCity} onBlur={this.onBlurStateCity}>
                                <option hidden defaultValue value='0' key='0'>Municipio</option>
                                {cities.map(cit => <option value={cit.cityId} key={cit.cityId}>
                                  {cit.cityName}
                                </option>)}
                              </select>
                            </div>
                          </div>
                          :
                          <div>
                            <Form.Control type='name' className='form-control' value={medicalCenters.medicalCenterName} readOnly
                              onBlur={this.onBlurMedicalCenter} />
                            <Form.Control type='name' className='form-control' value={medicalCenters.medicalCenterAddress} readOnly
                              onBlur={this.onBlurMedicalCenter} />
                            <Form.Control type='name' className='form-control' value={medicalCenters.medicalCenterTelNumber} readOnly
                              onBlur={this.onBlurMedicalCenter} />
                            <div className='input-group mb-3'>
                              <Form.Control type='name' className='form-control' value={stateName} readOnly
                                onBlur={this.onBlurStateCity} />
                              <Form.Control type='name' className='form-control' value={cityName} readOnly
                                onBlur={this.onBlurStateCity} />
                            </div>
                          </div>
                        }

                      </Form.Group>
                      : null}
                    <Form.Group size='lg' controlId='password' className='form-group required'>
                      <Form.Label className='control-label'>Contraseña</Form.Label>
                      <Form.Control type='password' value={password} placeholder='Contraseña' name='password'
                        aria-labelledby='password-uid4-label password-uid4-helper password-uid4-valid password-uid4-error'
                        onChange={this.onChangePassword} onBlur={this.onBlurPassword}
                        autoComplete='current-password' spellCheck='false' id='password' required='required' />
                    </Form.Group>
                    {!isLogin ?
                      <Form.Group size='lg' controlId='passwordAgain' className='form-group required'>
                        <span id='StrengthDisp' className={backgroundColor} >{strengthBadge}</span>
                        <Form.Label className='control-label'>Confirmar Contraseña</Form.Label>
                        <Form.Control type='password' value={passwordAgain} placeholder='Confirmar contraseña'
                          onChange={this.onChangePasswordAgain} onBlur={this.onBlurPasswordAgain}
                          autoComplete='current-password' id='passwordAgain' required='required' />
                        <div className='input-group mb-3'></div>
                        <Form.Label className='control-label'>Tipo de Usuario</Form.Label>
                        {['checkbox'].map((type) => (
                          <div key={`inline-${type}`} className='mr-3'>
                            {/*disabledArray[0] ?
                                <Form.Check inline label='Visitante' name='group1' type={type} id={`inline-${type}-1`}
                                  disabled checked={Viewer} required='required' /> :
                                <Form.Check inline label='Visitante' name='group1' type={type} id={`inline-${type}-1`}
                              onChange={this.onChangeViewer} checked={Viewer} required='required' />*/}
                            {disabledArray[1] ?
                              <Form.Check inline label='Clínica' name='group1' type={type} id={`inline-${type}-2`}
                                disabled checked={Clinic} /> :
                              <Form.Check inline label='Clínica' name='group1' type={type} id={`inline-${type}-2`}
                                onChange={this.onChangeClinic} checked={Clinic} onBlur={this.onBlurUserType} />}
                            {disabledArray[2] ?
                              <Form.Check inline label='Laboratorio' name='group1' type={type} id={`inline-${type}-3`}
                                disabled checked={Laboratory} /> :
                              <Form.Check inline label='Laboratorio' name='group1' type={type} id={`inline-${type}-3`}
                                onChange={this.onChangeLaboratory} checked={Laboratory} onBlur={this.onBlurUserType} />}
                            {disabledArray[3] ?
                              <Form.Check inline label='Administrador ' name='group1' type={type} id={`inline-${type}-4`}
                                disabled checked={Admin} /> :
                              <Form.Check inline label='Administrador ' name='group1' type={type} id={`inline-${type}-4`}
                                onChange={this.onChangeAdmin} checked={Admin} onBlur={this.onBlurUserType} />}
                          </div>
                        ))}

                      </Form.Group>
                      : null}

                  </div>
                  <div>
                    <pre> </pre>
                    {!isLogin ?
                      <Button block='true' size='lg' type='submit' disabled={!this.validateForm()} >Registrarme</Button> : null
                    }
                    {isLogin ?
                      <Button block='true' size='lg' type='submit' disabled={!this.validateForm()} >Iniciar Sesión</Button> : null
                    }
                  </div>

                </Form>

              </Modal.Body>
              <Modal.Footer size='sm'>
                <OverlayTrigger placement='top' delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip()}>
                  <Form.Label>{validateMessage}</Form.Label>
                </OverlayTrigger>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
