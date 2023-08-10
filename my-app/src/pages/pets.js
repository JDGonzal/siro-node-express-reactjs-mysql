import React, { Component } from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import '../css/pet.css';

export class Pets extends Component {

  constructor(props) {
    super(props);
    this.cleanToken='{"ok":false,"token":"","rolesArray":[],"medicalCenterArray":[]}';
    this.state = {
      patientPets: [],
      species: [],
      breeds: [],
      //Add Modal by each pet 
      modalTitle: '',
      
      patientPetId: 0,
      patientPetName: '',
      PetOwnerPetOwnerId: '',
      petOwnerName: '',
      petOwnerExists: false,
      SpeciesSpeciesId: '',
      BreedBreedId: '',
      patientPetGender: '',
      patientPetBirthday: '',
      patientPetHeight: '',
      patientPetWeight: '',
      MedicalCenterMedicalCenterId: '',
      medicalCenterName: '',
      PetNameFilter: '',
      PetOwnerFilter: '',
      petsWithoutFilter: [],
      Token: JSON.parse(localStorage.getItem('Token')!== null?localStorage.getItem('Token'):this.cleanToken),
      badToken: localStorage.getItem('Token')!== null?false:true,
      arrayValidate: [true, true, true, true, true, true, true, true],
      arrayMessages: ['Paciente', 'Propietario', 'Especie', 'Raza', 'Nacimiento', 'Género', 'Altura', 'Peso'],
      validateMessage: '',
    }
    this.site = 'patientpet';
    this.site2 = 'species';
    this.site3 = 'breed';
    this.site4 = 'petowner';
    this.site5 = 'medicalcenter';
    this.patientOwnerNameWrote = '';

    this.lim = 5;
    this.date = new Date();
  }

  async alertMessage() {
    const message = await 'Por favor Inicia Sesión para acceder a este sitio';
    if (this.state.Token.token.length>0){
      //localStorage.removeItem('Token');
      // this.setState({ Token: JSON.parse(this.cleanToken)});
      console.log('Token:', this.state.Token);
    }
    await this.setState({ badToken: true });
    await alert(message);
  }

  FilterFn() {
    var PetNameFilter = this.state.PetNameFilter;
    var PetOwnerFilter = this.state.PetOwnerFilter;

    var filterData = this.state.petsWithoutFilter.filter(
      function (el) {
        return el.patientPetName.toString().toLowerCase().includes(
          PetNameFilter.toString().trim().toLowerCase()
        ) &&
          el.petOwnerName.toString().toLowerCase().includes(
            PetOwnerFilter.toString().trim().toLowerCase()
          )
      }
    );
    this.setState({ patientPets: filterData });
  }

  sortResult(prop, asc) {
    var sortedData = this.state.petsWithoutFilter.sort(function (a, b) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    this.setState({ patientPets: sortedData });
  }

  petNameFilter = async (e) => {
    await this.setState({ PetNameFilter: e.target.value });
    await this.FilterFn();
  }

  PetOwnerFilter = async (e) => {
    await this.setState({ PetOwnerFilter: e.target.value });
    await this.FilterFn();
  }

  async refreshPatientPets() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken ) {
      this.alertMessage();
      return false;
    };
    await fetch(REACT_APP_API_URL + this.site + '/get', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        medicalCenterArray: this.state.Token.medicalCenterArray
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.ok === false) {
          this.alertMessage();
          return false;
        }
        this.setState({ patientPets: data, petsWithoutFilter: data, badToken: false });
        console.log('patientPets:', data);
        return true;
      })
  }

  async refreshSpecies() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site2}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (!data || data.ok === false) {
          this.alertMessage();
          return false;
        }
        this.setState({ species: data });
        /*if (this.state.medicalCenterNew !== 0) {
          this.getFromJson(data, 'speciesId', 'speciesName', this.state.species.SpeciesSpeciesId)
            .then((value) => {
              this.setState({ speciesName: value });
              console.log(this.state.speciesName);
            });
        } */
      }, (error) => {
        console.log(error);
      });
  }

  async refreshBreeds(SpeciesId) {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    if (!SpeciesId || SpeciesId === undefined) {
      return;
    }
    await fetch(`${REACT_APP_API_URL}${this.site3}/${SpeciesId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (!data || data.ok === false) {
          this.alertMessage();
          return false;
        }
        this.setState({ breeds: data });
        /* if (this.state.medicalCenterNew !== 0) {
          this.getFromJson(data, 'breedId', 'breedName', this.state.patientPets.BreedBreedId)
            .then((value) => {
              this.setState({ breedName: value });
              console.log(this.state.breedName);
            });
        }*/
      }, (error) => {
        console.log(error);
      });
  }

  async refreshPetOwner() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site4}/petownername/${parseInt(this.state.PetOwnerPetOwnerId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (data.found !== 0) {
          this.setState({
            petOwnerName: data.petOwnerName,
            petOwnerExists: true,
          });
        } else {
          this.setState({
            petOwnerName: this.patientOwnerNameWrote,
            petOwnerExists: false,
          });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async refreshMedicalCenters() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site5}/medicalcentername/${parseInt(this.state.MedicalCenterMedicalCenterId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (data.found !== 0) {
          this.setState({
            medicalCenterName: data.medicalCenterName,
          });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async componentDidMount() {
    await this.refreshPatientPets();
    if (await this.state.badToken === false) {
      await this.refreshSpecies();
      await this.refreshBreeds(this.state.species[1].speciesId);
    }
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

  onChangePatientPetName = async (e) => {
    await this.setState({ patientPetName: e.target.value });
  }

  onBlurPatientPetName = async (e) => {
    await this.state.patientPetName.length > this.lim - 3 ?
      this.state.arrayValidate[0] = await true :
      this.state.arrayValidate[0] = await false;
    await this.fillValidateMessage();
  }

  onChangePetOwnerId = async (e) => {
    await this.setState({ PetOwnerPetOwnerId: Math.abs(parseInt(e.target.value)) });
    if (await this.state.PetOwnerPetOwnerId.toString().length > this.lim &&
      this.state.badToken === false) {
      await this.refreshPetOwner();
    }
  }

  onChangePetOwnerName = async (e) => {
    await this.setState({ petOwnerName: e.target.value });
  }

  onBlurPetOwner = async (e) => {
    await String(this.state.PetOwnerPetOwnerId).length > this.lim ?
      this.state.arrayValidate[1] = await true :
      this.state.arrayValidate[1] = await false;
    await this.onBlurPatientPetName()
    await this.fillValidateMessage();
  }

  onBlurPetOwnerName = async (e) => {
    await this.state.petOwnerName.length > this.lim ?
      this.state.arrayValidate[1] = await true :
      this.state.arrayValidate[1] = await false;
    this.patientOwnerNameWrote = this.state.petOwnerName;
    await this.onBlurPatientPetName()
    await this.fillValidateMessage();
  }

  onChangeSpeciesId = async (e) => {
    await this.setState({
      SpeciesSpeciesId: e.target.value,
      BreedBreedId: e.target.value * 1000 + 1
    });
    if (await this.state.badToken === false) {
      await this.refreshBreeds(this.state.SpeciesSpeciesId);
    }
  }

  onBlurSpeciesId = async (e) => {
    await parseInt(this.state.SpeciesSpeciesId) > 0 ?
      this.state.arrayValidate[2] = await true :
      this.state.arrayValidate[2] = await false;
    if (await this.state.badToken === false) {
      await this.onBlurPatientPetName();
      await this.onBlurPetOwner();
      await this.fillValidateMessage();
    }
  }

  onChangeBreedId = async (e) => {
    await this.setState({ BreedBreedId: e.target.value });
  }

  onBlurBreedId = async (e) => {
    await parseInt(this.state.BreedBreedId) > 0 ?
      this.state.arrayValidate[3] = await true :
      this.state.arrayValidate[3] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurPetOwner();
    await this.onBlurSpeciesId();
    await this.fillValidateMessage();
  }

  onChangePatientPetBirthday = async (e) => {
    await this.setState({ patientPetBirthday: e.target.value });
    console.log('patientPetBirthday:', this.state.patientPetBirthday);
  }

  onBlurPatientPetBirthday = async (e) => {
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 1);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 40 * 365.25);
    await ((this.state.patientPetBirthday > minDate.toLocaleDateString('en-CA') &&
      this.state.patientPetBirthday < maxDate.toLocaleDateString('en-CA')) ||
      this.state.patientPetBirthday === '' || this.state.patientPetBirthday === null) ?
      this.state.arrayValidate[4] = await true :
      this.state.arrayValidate[4] = await false;
    if (await this.state.arrayValidate[4] === false) {
      console.log('patientPetBirthday:', this.state.patientPetBirthday)
    }
    await this.onBlurPatientPetName();
    await this.onBlurPetOwner();
    await this.onBlurSpeciesId();
    await this.onBlurBreedId();
    await this.fillValidateMessage();
  }

  onChangePatientPetGender = async (e) => {
    console.log(e);
    var gender
    if (await e.target.id === 'inline-radio-1') {
      gender = 'M';
    } else {
      gender = 'H';
    }
    await this.setState({ patientPetGender: gender });
  }

  onBlurPatientPetGender = async (e) => {
    await (this.state.patientPetGender === 'M' || this.state.patientPetGender === 'H') ?
      this.state.arrayValidate[5] = await true :
      this.state.arrayValidate[5] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurPetOwner();
    await this.onBlurSpeciesId();
    await this.onBlurBreedId();
    await this.onBlurPatientPetBirthday();
    await this.fillValidateMessage();
  }

  onChangePatientPetHeight = async (e) => {
    await this.setState({ patientPetHeight: Math.abs(parseInt(e.target.value)) });
  }

  onBlurPatientPetHeight = async (e) => {
    await parseInt(this.state.patientPetHeight) > 1 ?
      this.state.arrayValidate[6] = await true :
      this.state.arrayValidate[6] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurPetOwner();
    await this.onBlurSpeciesId();
    await this.onBlurBreedId();
    await this.onBlurPatientPetBirthday();
    await this.onBlurPatientPetGender();
    await this.fillValidateMessage();
  }

  onChangePatientPetWeight = async (e) => {
    await this.setState({ patientPetWeight: Math.abs(parseInt(e.target.value)) });
  }

  onBlurPatientPetWeight = async (e) => {
    await parseInt(this.state.patientPetWeight) > 1 ?
      this.state.arrayValidate[7] = await true :
      this.state.arrayValidate[7] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurPetOwner();
    await this.onBlurSpeciesId();
    await this.onBlurBreedId();
    await this.onBlurPatientPetBirthday();
    await this.onBlurPatientPetGender();
    await this.onBlurPatientPetHeight();
    await this.fillValidateMessage();
  }

  onChangeMedicalCenterId = async (e) => {
    await this.setState({ MedicalCenterMedicalCenterId: e.target.value });
  }

  addClick = async () => {
    await this.setState({
      modalTitle: 'Adicionar Paciente',
      patientPetId: 0,
      patientPetName: '',
      PetOwnerPetOwnerId: '',
      petOwnerName: '',
      petOwnerExists: false,
      SpeciesSpeciesId: '',
      BreedBreedId: '',
      patientPetGender: '',
      patientPetBirthday: '',
      patientPetHeight: '',
      patientPetWeight: '',
      MedicalCenterMedicalCenterId: this.state.Token.medicalCenterArray[0],
      validateMessage: '',
      arrayValidate: [true, true, true, true, true, true, true, true],
    });
    this.patientOwnerNameWrote = '';
    console.log('clean fields "addClick"');
    if (await this.state.badToken === false) {
      await this.refreshMedicalCenters();
    }
  }

  editClick = async (dep) => {
    await this.setState({
      modalTitle: 'Editar Paciente',
      patientPetId: dep.patientPetId,
      patientPetName: dep.patientPetName,
      PetOwnerPetOwnerId: dep.PetOwnerPetOwnerId,
      petOwnerName: dep.petOwnerName,
      petOwnerExists: true,
      SpeciesSpeciesId: dep.SpeciesSpeciesId,
      patientPetGender: dep.patientPetGender,
      patientPetBirthday: dep.patientPetBirthday === null ? '' : String(dep.patientPetBirthday).substring(0, 10),
      patientPetHeight: dep.patientPetHeight,
      patientPetWeight: dep.patientPetWeight,
      MedicalCenterMedicalCenterId: dep.MedicalCenterMedicalCenterId,
      validateMessage: '',
      arrayValidate: [true, true, true, true, true, true, true, true],
    });
    this.patientOwnerNameWrote = '';
    if (await this.state.badToken === false) {
      await this.refreshBreeds(this.state.SpeciesSpeciesId);
      await this.setState({
        BreedBreedId: dep.BreedBreedId,
      });
      await this.refreshMedicalCenters();
    }
  }

  createClick() {
    fetch(REACT_APP_API_URL + this.site, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        patientPetName: this.state.patientPetName,
        patientPetBirthday: (this.state.patientPetBirthday).toString().split('-'),
        patientPetGender: this.state.patientPetGender,
        patientPetHeight: parseInt(this.state.patientPetHeight),
        patientPetWeight: parseInt(this.state.patientPetWeight),
        SpeciesSpeciesId: parseInt(this.state.SpeciesSpeciesId),
        BreedBreedId: parseInt(this.state.BreedBreedId),
        PetOwnerPetOwnerId: parseInt(this.state.PetOwnerPetOwnerId),
        petOwnerName: this.state.petOwnerName,
        MedicalCenterMedicalCenterId: parseInt(this.state.MedicalCenterMedicalCenterId),
        TokenExternal: this.state.Token.token,
      })
    })
      .then(res => res.json())
      .then((data) => {
        !data.message ? alert(data.error) : alert(data.message);
        if (data.ok) {
          this.addClick(); //Clean fields after the correct creation
        }
        if (this.state.badToken === false) {
          this.refreshPatientPets();
        }
      }, (error) => {
        alert('¡Falló!');
      })
  }

  updateClick() {
    fetch(REACT_APP_API_URL + this.site, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        patientPetName: this.state.patientPetName,
        patientPetBirthday: (this.state.patientPetBirthday).toString().split('-'),
        patientPetGender: this.state.patientPetGender,
        patientPetHeight: parseInt(this.state.patientPetHeight),
        patientPetWeight: parseInt(this.state.patientPetWeight),
        SpeciesSpeciesId: parseInt(this.state.SpeciesSpeciesId),
        BreedBreedId: parseInt(this.state.BreedBreedId),
        PetOwnerPetOwnerId: parseInt(this.state.PetOwnerPetOwnerId),
        petOwnerName: this.state.petOwnerName,
        MedicalCenterMedicalCenterId: parseInt(this.state.MedicalCenterMedicalCenterId),
        patientPetId: parseInt(this.state.patientPetId),
        TokenExternal: this.state.Token.token,
      })
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        !data.message ? alert(data.error) : alert(data.message);
        if (this.state.badToken === false) {
          this.refreshPatientPets();
        }
      }, (error) => {
        alert('¡Falló!');
      })
  }

  deleteClick(id) {
    if (window.confirm('¿Está usted seguro?')) {
      fetch(REACT_APP_API_URL + this.site + '/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': this.state.Token.token
        }
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          !data.message ? alert(data.error) : alert(data.message);
          if (this.state.badToken === false) {
            this.refreshPatientPets();
          }
        }, (error) => {
          alert('¡Falló!');
        })
    }
  }

  validateForm() {
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 1);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 40 * 365.25);
    /*console.log(this.state.patientPetName.length, this.state.petOwnerName.length, '\n',
      String(this.state.PetOwnerPetOwnerId).length, this.state.patientPetGender, '\n',
      this.state.SpeciesSpeciesId, this.state.BreedBreedId, '\n',
      this.state.patientPetBirthday, this.state.patientPetHeight, this.state.patientPetWeight);*/
    try {
      return (
        this.state.patientPetName.length > this.lim - 3 && this.state.petOwnerName.length > this.lim &&
        String(this.state.PetOwnerPetOwnerId).length > this.lim && this.state.patientPetGender !== '' &&
        parseInt(this.state.SpeciesSpeciesId) > 0 && parseInt(this.state.BreedBreedId) > 1000 &&
        ((this.state.patientPetBirthday > minDate.toLocaleDateString('en-CA') && this.state.patientPetBirthday < maxDate.toLocaleDateString('en-CA')) ||
          this.state.patientPetBirthday === '' || this.state.patientPetBirthday === null) &&
        (this.state.patientPetGender === 'M' || this.state.patientPetGender === 'H') &&
        parseInt(this.state.patientPetHeight) > 1 && parseInt(this.state.patientPetWeight) > 1 &&
        this.state.badToken === false
      );
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  render() {
    const {
      patientPets,
      species,
      breeds,
      badToken,
      modalTitle,
      patientPetId,
      patientPetName,
      PetOwnerPetOwnerId,
      petOwnerName,
      petOwnerExists,
      SpeciesSpeciesId,
      BreedBreedId,
      patientPetGender,
      patientPetBirthday,
      patientPetHeight,
      patientPetWeight,
      MedicalCenterMedicalCenterId,
      medicalCenterName,
      Token,
      validateMessage,
    } = this.state;

    return (
      <div>
        <Button type='button' className='btn btn-primary m-2 float-end' data-bs-toggle='modal' data-bs-target='#exampleModal'
          onClick={() => this.addClick()} disabled={badToken}>
          Adicionar
        </Button>
        <Table className='table table-striped border hover'>
          <thead>
            <tr>
              <th>
                <div className='d-flex flex-row'>
                  <input className='form-control m-2' onInput={this.petNameFilter} placeholder='Filtro' />
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('patientPetName', true)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-down-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('patientPetName', false)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-up-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z' />
                    </svg>
                  </button>
                </div>
                Nombre del Paciente
              </th>
              <th>
                <div className='d-flex flex-row'>
                  <input className='form-control m-2' onInput={this.PetOwnerFilter} placeholder='Filtro' />
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('petOwnerName', true)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-down-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('petOwnerName', false)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-up-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z' />
                    </svg>
                  </button>
                </div>
                Propietario del Paciente
              </th>
              <th>
                Especie
              </th>
              <th>
                Raza
              </th>
              <th>
                Género
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {patientPets.map(dep =>
              <tr key={dep.patientPetId}>
                <td>{dep.patientPetName}</td>
                <td>{dep.petOwnerName}</td>
                <td>{dep.speciesName}</td>
                <td>{dep.breedName}</td>
                <td>{dep.patientPetGender}</td>
                <td>
                  <button type='button' className='btn btn-light mr-1' data-bs-toggle='modal' data-bs-target='#exampleModal'
                    onClick={() => this.editClick(dep)} disabled={badToken}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-pencil-square' viewBox='0 0 16 16'>
                      <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                      <path fillRule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light mr-1' onClick={() => this.deleteClick(dep.patientPetId)} disabled={badToken}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash-fill' viewBox='0 0 16 16'>
                      <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {badToken ? null :
        <dialog className='modal fade' id='exampleModal' tabIndex='-1' aria-hidden='true'>
          <div className='modal-dialog modal-lg modal-dialog-centred'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>{(modalTitle)}</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Nombre del Paciente:</Form.Label>
                    <Form.Control type='name' value={patientPetName} placeholder='Nombre del paciente'
                      onChange={this.onChangePatientPetName} onBlur={this.onBlurPatientPetName}
                      id='patientPetName' required='required' />
                  </Form.Group>
                  <Form.Label size='sm'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Propietario:</Form.Label>
                    <Form.Control type='number' value={PetOwnerPetOwnerId} placeholder='ID. del propietario'
                      onChange={this.onChangePetOwnerId} onBlur={this.onBlurPetOwner} id='PetOwnerPetOwnerId' />
                    <Form.Control type='name' value={petOwnerName} placeholder='Nombre del propietario'
                      onChange={this.onChangePetOwnerName} onBlur={this.onBlurPetOwnerName} readOnly={petOwnerExists}
                      id='petOwnerName' required='required' />
                  </Form.Group>
                  <Form.Label size='sm'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Especie y Raza:</Form.Label>
                    <Form.Control as='select' className="form-select" value={SpeciesSpeciesId} id='SpeciesSpeciesId'
                      onChange={this.onChangeSpeciesId} onBlur={this.onBlurSpeciesId} required='required'>
                      <option hidden defaultValue value="0" key="0">Especie</option>
                      {species.map(spe => <option value={spe.speciesId} key={spe.speciesId}>
                        {spe.speciesName}
                      </option>)}
                    </Form.Control>
                    <Form.Control as='select' className="form-select" value={BreedBreedId} id='BreedBreedId'
                      onChange={this.onChangeBreedId} onBlur={this.onBlurBreedId} required='required'>
                      <option hidden defaultValue value="0" key="0">Raza</option>
                      {breeds.map(bre => <option value={bre.breedId} key={bre.breedId}>
                        {bre.breedName}
                      </option>)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Label size='sm'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label' >Fecha Nacimiento:</Form.Label>
                    <Form.Control type='date' value={patientPetBirthday} id='patientPetBirthday'
                      onChange={this.onChangePatientPetBirthday} onBlur={this.onBlurPatientPetBirthday} />
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Género:</Form.Label>
                    <div key={`inline-radio`} className='mr-3'>
                      <Form.Check inline label='Macho' name='group1' type='radio' id={`inline-radio-1`} required='required'
                        checked={patientPetGender === 'M'} onChange={this.onChangePatientPetGender} onBlur={this.onBlurPatientPetGender} />
                      <Form.Check inline label='Hembra' name='group1' type='radio' id={`inline-radio-2`} required='required'
                        checked={patientPetGender === 'H'} onChange={this.onChangePatientPetGender} onBlur={this.onBlurPatientPetGender} />
                    </div>
                  </Form.Group>
                  <Form.Label size='sm'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Altura en centímetros:</Form.Label>
                    <Form.Control type='number' value={patientPetHeight} placeholder='Alzada a la cruz' id='patientPetHeight'
                      onChange={this.onChangePatientPetHeight} onBlur={this.onBlurPatientPetHeight} required='required' />
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Peso en gramos:</Form.Label>
                    <Form.Control type='number' value={patientPetWeight} placeholder='Peso grms.' id='patientPetWeight'
                      onChange={this.onChangePatientPetWeight} onBlur={this.onBlurPatientPetWeight} required='required' />
                  </Form.Group>
                  <Form.Label size='sm'></Form.Label>
                </div>
                <div>
                {badToken ?
                  null :
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label control-label' >Centro Médico:</Form.Label>
                    <Form.Control as='select' className="form-select" value={MedicalCenterMedicalCenterId}
                      onChange={this.onChangeMedicalCenterId} id='MedicalCenterMedicalCenterId'>
                      {Token.medicalCenterArray.map(opt => (
                        <option value={opt} key={opt}>{opt}</option> 
                      ))}
                    </Form.Control>
                    <Form.Control type='name' value={medicalCenterName} readOnly id='medicalCenterName' />
                  </Form.Group>
                }
                </div>
                <pre> </pre>
                {patientPetId === 0 ?
                  <button type='button' className='btn btn-primary float-start'
                    onClick={() => this.createClick()} disabled={!this.validateForm()}>Crear</button> : null
                }
                {patientPetId !== 0 ?
                  <button type='button' className='btn btn-primary float-start'
                    onClick={() => this.updateClick()} disabled={!this.validateForm()}>Modificar</button> : null
                }
              </div>
              <div className='modal-footer'>
                <Form.Label>{validateMessage}</Form.Label>
              </div>
            </div>
          </div>
        </dialog>}
      </div>
    )
  }
}
