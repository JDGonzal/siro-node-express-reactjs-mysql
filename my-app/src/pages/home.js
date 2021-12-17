import React, { Component } from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip"
import '../css/login.css';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: [],
      modalTitle: '',
      isLogin: false,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterId: '',
      medicalCenterName: '',
      ok: '',
      strengthBadge: 'Débil',
      backgroundColor: 'input-group-text m-1 alert alert-danger', //'input-group-text m-1 text-centred bg_Débil' 
      RolesArray: [false, false, false],
      disabledArray: [false, false, false],
      Viewer: false,
      Editor: false,
      Admin: false,
      Token: localStorage.getItem('Token'),
      footer:REACT_APP_API_URL,
    }
    this.site = 'auth'
    this.strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
    this.mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
    this.failedMessage = 'Se ha presentado una falla.\nPor favor avisarle al administrador.';
    this.isFound = true;
  }

  submitClick() {
    this.setState({
      modalTitle: 'Registro',
      isLogin:false,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterId: '',
      medicalCenterName: '',
      strengthBadge: 'Débil',
      RolesArray: [true, false, false],
      disabledArray: [false, false, false],
      Viewer: false,
      Editor: false,
      Admin: false,
      footer:REACT_APP_API_URL,
    })
  }

  loginClick() {
    this.setState({
      modalTitle: 'Inicio Sesión',
      isLogin:true,
      email: '',
      password: '',
      passwordAgain: '',
      medicalCenterId: '',
      medicalCenterName: '',
      RolesArray: [false, false, false],
      footer:REACT_APP_API_URL,
    })
  }

  refreshList() {
    console.log(this.state.medicalCenterId)

    fetch(REACT_APP_API_URL + 'medicalcenter/medicalcentername/' + this.state.medicalCenterId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        medicalCenterId:this.state.medicalCenterId
      })
    })
      .then(response => response.json())
      .then((data) => {
        if (!data || data.ok === false) {
          alert(this.alertMessage);
          return;
        }
        this.setState({ medicalCenterName: data.found })
      }, (error) => {
        console.log(error);
      });

  }

  componentDidMount() {
    this.refreshList();
  }

  onChangeEmail = async (e) => {
    await this.setState({ email: e.target.value });
  }

  onChangePassword = async (e) => {
    await this.setState({ password: e.target.value });
    await this.StrengthChecker(this.state.password);
  }

  onChangePasswordAgain = async (e) => {
    await this.setState({ passwordAgain: e.target.value });
  }

  onChangemedicalCenterId = async (e) => {
    await this.setState({ medicalCenterId: e.target.value });
  }

  onChangeMedicalCenterName = async (e) => {
    await this.setState({ medicalCenterName: e.target.value });
  }

  onChangeViewer = (e) => {
    this.setState({ Viewer: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[0] = e.target.checked;
  }

  onChangeEditor = (e) => {
    this.setState({ Editor: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[1] = e.target.checked;
  }

  onChangeAdmin = (e) => {
    this.setState({ Admin: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[2] = e.target.checked;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('this.handleSubmit');
    this.authClick();
  }

  StrengthChecker(PasswordParameter) {
    const bg_base = 'input-group-text m-1 alert ';
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
    const lim = 5
    return (this.state.isLogin ?
      (this.state.email.length > lim && this.state.password.length > lim) :
      (this.state.email.length > lim && this.state.password.length > lim &&
        this.state.medicalCenterId.length > 1 && this.state.medicalCenterName.length > 1 &&
        this.state.password === this.state.passwordAgain &&
        this.state.strengthBadge !== 'Débil' &&
        (this.state.Viewer || this.state.Editor || this.state.Admin)));
  }

  authClick() {
    console.log(this.state.modalTitle);
    console.log(this.state.Viewer, this.state.Editor, this.state.Admin);
    if (this.state.isLogin) {
      fetch(REACT_APP_API_URL + this.site + '/signin', {
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
            !this.state.auth.message
              ? (!this.state.auth.error ? alert(this.failedMessage) : alert(this.state.auth.error))
              : alert(this.state.auth.message);
          } else {
            localStorage.setItem('Token', JSON.stringify(this.state.auth));
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.Token = this.state.auth.token;
            alert('Inicio de sesión exitoso \nUsted ya puede acceder los otros sitios.');
          }
        }, (error) => {
          alert(this.failedMessage);
        });
    } else {
      fetch(REACT_APP_API_URL + this.site + '/signup/' + this.state.email, {
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
              alert('The email exists');
            };
            if (!this.isFound) {
              fetch(REACT_APP_API_URL + this.site + '/signup', {
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
                  Roles: this.state.RolesArray,
                  TokenExternal: this.state.Token,
                })
              })
                .then(res => res.json())
                .then((result) => {
                  alert(result.message);
                  console.log(result);

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

  renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {this.state.footer}
    </Tooltip>
  );

  render() {
    const {
      email,
      password,
      passwordAgain,
      medicalCenterId,
      medicalCenterName,
      modalTitle,
      isLogin,
      strengthBadge,
      backgroundColor,
      Viewer,
      Editor,
      Admin,
      disabledArray,
    } = this.state;
    return (
      <div>
        <button type='submit' className='btn btn-primary m-2 float-end' data-bs-toggle='modal' data-bs-target='#exampleModal'
          onClick={() => this.submitClick()}>
          Soy Nuevo
        </button>
        <button type='submit' className='btn btn-primary m-2 float-end' data-bs-toggle='modal' data-bs-target='#exampleModal'
          onClick={() => this.loginClick()}>
          Ya Existo
        </button>

        <div className='modal fade' id='exampleModal' tabIndex='-1' aria-hidden='true'>
          <div className='modal-dialog modal-lg modal-dialog-centred'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>{(modalTitle)}</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Cerrar'></button>
              </div>
              <div className='modal-body'>
                <div className='Login'>
                  <Form onSubmit={this.handleSubmit}>
                    <div>
                      <Form.Group size='lg' controlId='email'>
                        <Form.Label>Correo</Form.Label>
                        <Form.Control autoFocus type='email' value={email} onChange={this.onChangeEmail} placeholder='correo@electronico.srv' />
                      </Form.Group>
                      {!isLogin ?
                        <div>
                          <Form.Label>Centro Médico</Form.Label>

                          <Form.Control type='number' className='form-control' value={medicalCenterId} onChange={this.onChangemedicalCenterId} placeholder='Nit Centro Médico' />
                          <Form.Control type='name' className='form-control' value={medicalCenterName} onChange={this.onChangeMedicalCenterName} placeholder='Nombre Centro Médico' />
                        </div>
                        : null}
                      <Form.Group size='lg' controlId='password'>
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type='password' value={password} onChange={this.onChangePassword} placeholder='Contraseña'
                          name='password' aria-labelledby='password-uid4-label password-uid4-helper password-uid4-valid password-uid4-error'
                          autoComplete='current-password' spellCheck='false' />
                      </Form.Group>
                      {!isLogin ?
                        <Form.Group size='lg' controlId='passwordAgain'>
                          <span id='StrengthDisp' className={backgroundColor} >{strengthBadge}</span>
                          <Form.Label>Confirmar Contraseña</Form.Label>
                          <Form.Control type='password' value={passwordAgain} onChange={this.onChangePasswordAgain} placeholder='Confirmar contraseña' />
                          <div className='ml-3'>
                            <Form.Label>Tipo de Usuario</Form.Label>
                            {['checkbox'].map((type) => (
                              <div key={`inline-${type}`} className='mr-3'>
                                {disabledArray[0] ?
                                  <Form.Check inline label='Visitante' name='group1' type={type} id={`inline-${type}-1`} disabled /> :
                                  <Form.Check inline label='Visitante' name='group1' type={type} id={`inline-${type}-1`}
                                    onChange={this.onChangeViewer} checked={Viewer} />}
                                {disabledArray[1] ?
                                  <Form.Check inline label='Clínica' name='group1' type={type} id={`inline-${type}-2`} disabled /> :
                                  <Form.Check inline label='Clínica' name='group1' type={type} id={`inline-${type}-2`}
                                    onChange={this.onChangeEditor} checked={Editor} />}
                                {disabledArray[2] ?
                                  <Form.Check inline label='Administrador ' name='group1' type={type} id={`inline-${type}-3`} disabled /> :
                                  <Form.Check inline label='Administrador ' name='group1' type={type} id={`inline-${type}-3`}
                                    onChange={this.onChangeAdmin} checked={Admin} />}
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                        : null}

                    </div>
                    <div>
                      <pre> </pre>
                      {!isLogin ?
                        <Button block="true" size='lg' type='submit' disabled={!this.validateForm()} >Registrarme</Button> : null
                      }
                      {isLogin ?
                        <Button block="true" size='lg' type='submit' disabled={!this.validateForm()} >Iniciar Sesión</Button> : null
                      }
                    </div>

                  </Form>
                </div>
              </div>
              <div className='modal-footer'>
                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip()}>
                  <Form.Label>+</Form.Label>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
