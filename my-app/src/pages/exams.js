import React, { Component } from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import '../css/exams.css';

export class Exams extends Component {

  constructor(props) {
    super(props);

    this.state = {
      patientExams: [],
      patientPets: [],
      petOwners: [],
      typeOfSamples: [],
      testTypes: [],
      laboratoryTests1: [],
      laboratoryTests2: [],
      laboratoryTests3: [],
      laboratoryTests4: [],
      laboratoryTests5: [],
      laboratoryTests6: [],
      laboratoryTests7: [],
      laboratoryTests8: [],
      laboratoryTests9: [],

      //Add Modal by each pet 
      modalTitle: '',
      badToken: false,
      createdAt: Date.now(),
      dateTimeReadOnly: '',
      patientExamId: 0,
      patientPetId: 0,
      patientPetName: '',
      PetOwnerPetOwnerId: '',
      petOwnerName: '',
      veterinarianName: '',
      VeterinarianVeterinarianId: '',
      vaterinarianName: '',
      veterinarianExists: false,
      arrTypeOfSamples: [],
      NotAnotherTypeOfSample: true,
      patientAnotherTypeOfSample: '',
      arrTestTypes: [],
      arrLabTests1: [],
      arrLabTests2: [],
      arrLabTests3: [],
      arrLabTests4: [],
      arrLabTests5: [],
      arrLabTests6: [],
      arrLabTests7: [],
      arrLabTests8: [],
      arrLabTests9: [],
      backLabTests: [],

      MedicalCenterMedicalCenterId: '',
      medicalCenterName: '',
      patientPetNameFilter: '',
      createdAtFilter: '',
      veterinarianNameFilter: '',
      petsWithoutFilter: [],
      Token: JSON.parse(localStorage.getItem('Token')),
      arrayValidate: [true, true, true, true, true, true, true],
      arrayMessages: ['Paciente', 'Propietario', 'Veterinario', 'Muestra', 'Examen', 'Dirección', 'Teléfono'],
      validateMessage: '',
      typeOfSampleOption: '',
      testTypeIsMultipleOption: '',
      testTypeNoMultipleOption: '',
      patientExamRemarks: '',
      patientExamAddress: '',
      patientExamTelNumber: '',
      patientExamIsUrgency: false,
    }
    this.site = 'patientexam';
    this.site2 = 'patientpet';
    this.site3 = 'veterinarian';
    this.site4 = 'petowner';
    this.site5 = 'medicalcenter';
    this.site6 = 'typeofsample';
    this.site7 = 'testtype';
    this.site8 = 'laboratorytest';
    this.backLabel = 'input-group-text col-md-5 col-form-label ';
    this.backLabel0 = 'input-group-text col-md-3 col-form-label '

    this.lim = 5;
    this.date = new Date();
  }

  async alertMessage() {
    const message = await 'Por favor Inicia Sesión para acceder a este sitio'
    await this.setState({ badToken: true });
    await alert(message);
  }

  FilterFn() {
    var createdAtFilter = this.state.createdAtFilter;
    var patientPetNameFilter = this.state.patientPetNameFilter;
    var veterinarianNameFilter = this.state.veterinarianNameFilter;

    var filterData = this.state.petsWithoutFilter.filter(
      function (el) {
        console.log(String(el.createdAt));
        return String(el.createdAt).includes(
          String(createdAtFilter).trim().toLowerCase()
        ) &&
          el.patientPetName.toString().toLowerCase().includes(
            patientPetNameFilter.toString().trim().toLowerCase()
          ) &&
          el.veterinarianName.toString().toLowerCase().includes(
            veterinarianNameFilter.toString().trim().toLowerCase()
          )
      }
    );
    this.setState({ patientExams: filterData });
  }

  sortResult(prop, asc) {
    var sortedData = this.state.petsWithoutFilter.sort(function (a, b) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    this.setState({ patientExams: sortedData });
  }

  onChangeCreatedAtFilter = async (e) => {
    await this.setState({ createdAtFilter: e.target.value });
    await this.FilterFn();
  }

  onChangePatientPetFilter = async (e) => {
    await this.setState({ patientPetNameFilter: e.target.value });
    await this.FilterFn();
  }

  onChangeVeterinarianNameFilter = async (e) => {
    await this.setState({ veterinarianNameFilter: e.target.value });
    await this.FilterFn();
  }

  async refreshPatientPets() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site2}/${this.state.Token.medicalCenterArray}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.ok === false) {
          return false;
        }
        this.setState({ patientPets: data, });
        return true;
      });
  }

  async refreshPatientExams() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
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
        this.setState({ patientExams: data, petsWithoutFilter: data, badToken: false });
        return true;
      });
  }

  async refreshPetOwner() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site4}/petownernames`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        patientPetName: this.state.patientPetName,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.ok === false) {
          this.alertMessage();
          return false;
        }
        this.setState({ petOwners: data, });
        return true;
      });
  }

  async getPatientPetId() {
    await fetch(`${REACT_APP_API_URL}${this.site2}/getpatientpetid`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        patientPetName: this.state.patientPetName,
        petOwnerName: this.state.petOwnerName,
        PetOwnerPetOwnerId: parseInt(this.state.PetOwnerPetOwnerId),
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.ok === false) {
          this.setState({ patientPetId: 0, patientPetName: '', });
          return false;
        }
        this.setState({ patientPetId: data[0].patientPetId, });
        return true;
      });
  }

  async refreshVeterinarian() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site3}/veterinarianname/${parseInt(this.state.VeterinarianVeterinarianId)}`, {
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
            veterinarianName: data.veterinarianName,
            veterinarianExists: true,
          });
        } else {
          this.setState({ veterinarianExists: false, });
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
            patientExamAddress: data.medicalCenterAddress,
            patientExamTelNumber: data.medicalCenterTelNumber,
          });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async refreshtypeOfSamples() {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site6}`, {
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
            typeOfSamples: data,
            typeOfSampleOption: '»Descartar todas las muestras«',
          });
        }
      }, (error) => {
        console.log(error);
      });
  }

  async refreshTestTypes(clear) {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site7}`, {
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
            testTypes: data,
            testTypeIsMultipleOption: '»Descartar todos los exámenes«',
            testTypeNoMultipleOption: '»Seleccione un Examen...«',
            laboratoryTests1: [],
            laboratoryTests2: [],
            laboratoryTests3: [],
            laboratoryTests4: [],
            laboratoryTests5: [],
            laboratoryTests6: [],
            laboratoryTests7: [],
            laboratoryTests8: [],
            laboratoryTests9: [],
            backLabTests: [],
          });
          console.log('testTypes:', this.state.testTypes);
          this.state.backLabTests.push(this.backLabel0 + 'alert-secondary');
          for (let i = 0; i < this.state.testTypes.length; i++) {
            this.refreshLaboratoryTests(parseInt(this.state.testTypes[i].testTypeId),
              this.state.testTypes[i].testTypeIsMultiple === 1, clear);
            this.state.backLabTests.push(this.backLabel + 'alert-secondary');
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  async refreshLaboratoryTests(i, isMultiple, clear) {
    if (await this.state.Token === undefined || this.state.Token === null || this.state.badToken) {
      this.alertMessage();
      return false;
    };
    await fetch(`${REACT_APP_API_URL}${this.site8}/${i}`, {
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
          switch (i) {
            case 1:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests1: data, arrLabTests1: [] }) : this.setState({ laboratoryTests1: data })) :
                (clear ? this.setState({ laboratoryTests1: data, arrLabTests1: 0 }) : this.setState({ laboratoryTests1: data }));
              break;
            case 2:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests2: data, arrLabTests2: [] }) : this.setState({ laboratoryTests2: data })) :
                (clear ? this.setState({ laboratoryTests2: data, arrLabTests2: 0 }) : this.setState({ laboratoryTests2: data }));
              break;
            case 3:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests3: data, arrLabTests3: [] }) : this.setState({ laboratoryTests3: data })) :
                (clear ? this.setState({ laboratoryTests3: data, arrLabTests3: 0 }) : this.setState({ laboratoryTests3: data }));
              break;
            case 4:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests4: data, arrLabTests4: [] }) : this.setState({ laboratoryTests4: data })) :
                (clear ? this.setState({ laboratoryTests4: data, arrLabTests4: 0 }) : this.setState({ laboratoryTests4: data }));
              break;
            case 5:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests5: data, arrLabTests5: [] }) : this.setState({ laboratoryTests5: data })) :
                (clear ? this.setState({ laboratoryTests5: data, arrLabTests5: 0 }) : this.setState({ laboratoryTests5: data }));
              break;
            case 6:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests6: data, arrLabTests6: [] }) : this.setState({ laboratoryTests6: data })) :
                (clear ? this.setState({ laboratoryTests6: data, arrLabTests6: 0 }) : this.setState({ laboratoryTests6: data }));
              break;
            case 7:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests7: data, arrLabTests7: [] }) : this.setState({ laboratoryTests7: data })) :
                (clear ? this.setState({ laboratoryTests7: data, arrLabTests7: 0 }) : this.setState({ laboratoryTests7: data }));
              break;
            case 8:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests8: data, arrLabTests8: [] }) : this.setState({ laboratoryTests8: data })) :
                (clear ? this.setState({ laboratoryTests8: data, arrLabTests8: 0 }) : this.setState({ laboratoryTests8: data }));
              break;
            default:
              isMultiple ?
                (clear ? this.setState({ laboratoryTests9: data, arrLabTests9: [] }) : this.setState({ laboratoryTests9: data })) :
                (clear ? this.setState({ laboratoryTests9: data, arrLabTests9: 0 }) : this.setState({ laboratoryTests9: data }));
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  async componentDidMount() {
    await this.refreshPatientExams();
    console.log('wasOk', this.state.badToken);
    if (await this.state.badToken === false) {
      await this.refreshPatientPets();
      await this.refreshtypeOfSamples();
      await this.refreshTestTypes(true);
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
    await this.setState({
      patientPetName: e.target.value,
      patientPetId: 0,
    });
  }

  onBlurPatientPetName = async (e) => {
    await this.state.patientPetName.length > this.lim - 3 && this.state.patientPetId > 0 ?
      this.state.arrayValidate[0] = await true :
      this.state.arrayValidate[0] = await false;
    await this.fillValidateMessage();
    if (await this.state.badToken === false) {
      await this.refreshPetOwner();
    }
  }

  onChangePetOwnerName = async (e) => {
    await this.setState({
      PetOwnerPetOwnerId: e.target.value,
    });
    console.log(`petOwnerName:"${this.state.petOwnerName}" petOwnerId:${this.state.PetOwnerPetOwnerId}`);
  }

  onBlurPetOwner = async (e) => {
    await (this.state.petOwnerName.length > this.lim || this.state.PetOwnerPetOwnerId > 0) ?
      this.state.arrayValidate[1] = await true :
      this.state.arrayValidate[1] = await false;
    await (this.state.petOwnerName.length > this.lim || this.state.PetOwnerPetOwnerId > 0) &&
      this.state.patientPetName.length > this.lim - 3 ?
      await this.getPatientPetId() :
      this.state.arrayValidate[0] = await false;
    await this.state.patientPetId > 0 ?
      this.state.arrayValidate[0] = await true :
      await this.onBlurPatientPetName();
    await this.fillValidateMessage();
  }

  onChangeMedicalCenterId = async (e) => {
    await this.setState({ MedicalCenterMedicalCenterId: e.target.value });
  }

  onChangeVeterinarianId = async (e) => {
    await this.setState({ VeterinarianVeterinarianId: Math.abs(parseInt(e.target.value)) });
    if (await this.state.VeterinarianVeterinarianId.toString().length > this.lim &&
      this.state.badToken === false) {
      await this.refreshVeterinarian();
    }
  }

  onChangeVeterinarianName = async (e) => {
    await this.setState({ veterinarianName: e.target.value });
  }

  onBlurVeterinarian = async (e) => {
    await this.state.veterinarianName.length > this.lim && String(this.state.VeterinarianVeterinarianId).length > this.lim ?
      this.state.arrayValidate[2] = await true :
      this.state.arrayValidate[2] = await false;
    await this.onBlurPetOwner();
    await this.fillValidateMessage();
  }

  onChangeTypeOfSample = async (e) => {
    let idOption = null;
    let index = -1;
    let array = this.state.arrTypeOfSamples;
    let anotherReadOnly = true;
    if (e.target.value) {
      idOption = e.target.value;
    };
    if (await array.length > 0) {
      index = array.indexOf(idOption);
    };
    if (await index < 0 && idOption !== null) {
      array.push(idOption);
      this.state.backLabTests[0] = await this.backLabel0 + 'alert-success';
    };
    if (idOption === '-1') {
      array = [];
      this.state.backLabTests[0] = await this.backLabel0 + 'alert-secondary';
    };
    if (array.indexOf('0') > -1) {
      anotherReadOnly = false;
    }
    await this.setState({
      arrTypeOfSamples: array,
      notAnotherTypeOfSample: anotherReadOnly,
    });
  }

  onBlurTypeOfSample = async (e) => {
    await this.state.arrTypeOfSamples.length > 0 &&
      (this.state.arrTypeOfSamples.indexOf('0') === -1 || this.state.patientAnotherTypeOfSample.length > this.lim) ?
      this.state.arrayValidate[3] = await true :
      this.state.arrayValidate[3] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurVeterinarian();
    await this.fillValidateMessage();
  }

  onChangeAnotherTypeOfSample = async (e) => {
    await this.setState({ patientAnotherTypeOfSample: e.target.value });
  }

  onChangeLaboratoryTest = async (e, i, isMultiple) => {
    let idOption = null;
    let index = -1;
    let array = [];
    switch (i) {
      case 1:
        array = this.state.arrLabTests1;
        break;
      case 2:
        array = this.state.arrLabTests2;
        break;
      case 3:
        array = this.state.arrLabTests3;
        break;
      case 4:
        array = this.state.arrLabTests4;
        break;
      case 5:
        array = this.state.arrLabTests5;
        break;
      case 6:
        array = this.state.arrLabTests6;
        break;
      case 7:
        array = this.state.arrLabTests7;
        break;
      case 8:
        array = this.state.arrLabTests8;
        break;
      default:
        array = this.state.arrLabTests9;
    }

    if (e.target.value) {
      idOption = e.target.value;
    };
    if (isMultiple) {
      if (await array.length > 0) {
        index = await array.indexOf(idOption);
      };
      if (await index < 0 && idOption !== null) {
        await array.push(idOption);
        this.state.backLabTests[i] = await this.backLabel + 'alert-success';
      };
      if (idOption === '-1') {
        array = await [];
        this.state.backLabTests[i] = await this.backLabel + 'alert-secondary';
      };
    } else {
      await idOption > -1 ?
        this.state.backLabTests[i] = this.backLabel + 'alert-success' :
        this.state.backLabTests[i] = this.backLabel + 'alert-secondary';
    };

    switch (i) {
      case 1:
        await isMultiple ? this.setState({ arrLabTests1: array, }) : this.setState({ arrLabTests1: idOption, });
        break;
      case 2:
        await isMultiple ? this.setState({ arrLabTests2: array, }) : this.setState({ arrLabTests2: idOption, });
        break;
      case 3:
        await isMultiple ? this.setState({ arrLabTests3: array, }) : this.setState({ arrLabTests3: idOption, });
        break;
      case 4:
        await isMultiple ? this.setState({ arrLabTests4: array, }) : this.setState({ arrLabTests4: idOption, });
        break;
      case 5:
        await isMultiple ? this.setState({ arrLabTests5: array, }) : this.setState({ arrLabTests5: idOption, });
        break;
      case 6:
        await isMultiple ? this.setState({ arrLabTests6: array, }) : this.setState({ arrLabTests6: idOption, });
        break;
      case 7:
        await isMultiple ? this.setState({ arrLabTests7: array, }) : this.setState({ arrLabTests7: idOption, });
        break;
      case 8:
        await isMultiple ? this.setState({ arrLabTests8: array, }) : this.setState({ arrLabTests8: idOption, });
        break;
      default:
        await isMultiple ? this.setState({ arrLabTests9: array, }) : this.setState({ arrLabTests9: idOption, });
    }
  };

  validateLabTests() {
    let isValid = false;
    for (var i = 1; i < 10; i++) {
      if (this.state.backLabTests[i] !== undefined && this.state.backLabTests[i].includes('success')) {
        isValid = true;
        break;
      }
    }
    return isValid;
  }

  onBlurLaboratoryTest = async (e) => {
    await (this.validateLabTests()) ?
      this.state.arrayValidate[4] = await true :
      this.state.arrayValidate[4] = await false;
    await this.onBlurPatientPetName();
    await this.onBlurVeterinarian();
    await this.onBlurTypeOfSample();
    await this.fillValidateMessage();
  }

  onChangepatientExamRemarks = async (e) => {
    await this.setState({ patientExamRemarks: e.target.value });
  }

  onBlurpatientExamRemarks = async (e) => {

  }

  onChangepatientExamAddress = async (e) => {
    await this.setState({ patientExamAddress: e.target.value });
  }

  onBlurpatientExamAddress = async (e) => {

  }

  onChangepatientExamTelNumber = async (e) => {
    await this.setState({ patientExamTelNumber: e.target });
  }

  onBlurpatientExamTelNumber = async (e) => {

  }

  onChangepatientExamIsUrgency = async (e) => {
    await this.setState({ patientExamIsUrgency: e.target.checked, });
  }

  onBlurpatientExamIsUrgency = async (e) => {

  }

  getLongNow(date) {
    var months = [
      'Enero', 'Febrero', 'Marzo',
      'Abril', 'Mayo', 'Junio', 'Julio',
      'Agosto', 'Septiembre', 'Octubre',
      'Noviembre', 'Diciembre'
    ];
    var weekDay = [
      'Domingo', 'Lunes', 'Martes',
      'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    var days = date.getDay()
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var longFormatDate = `${weekDay[days]}, ${day} de ${months[month]} de ${year}`;
    return longFormatDate;
  }


  addClick = async () => {
    await this.setState({
      modalTitle: 'Adicionar Examen',
      patientExamId: 0,
      patientPetId: 0,
      patientPetName: '',
      PetOwnerPetOwnerId: '',
      petOwnerName: '',
      VeterinarianVeterinarianId: '',
      veterinarianName: '',
      arrTypeOfSamples: [],
      patientAnotherTypeOfSample: '',
      notAnotherTypeOfSample: true,
      arrTestTypes: [],
      patientExamRemarks: '',
      patientExamIsUrgency: false,

      dateTimeReadOnly: this.getLongNow(new Date()),
      MedicalCenterMedicalCenterId: this.state.Token.medicalCenterArray[0],
      validateMessage: '',
      arrayValidate: [true, true, true, true, true, true, true,],
    });
    console.log('clean fields "addClick"');
    if (await this.state.badToken === false) {
      await this.refreshMedicalCenters();
      await this.refreshPatientPets();
      await this.refreshPetOwner();
      await this.refreshTestTypes(true);
    }
  }

  getlabTests = (array, testType, arrTestTypes, arrIsMultiple) => {
    var value = 0;
    var newArray = [];
    if (this.state.testTypes.length < testType) {
      return newArray;
    }
    for (var i = 0; i < arrTestTypes.length; i++) {
      if (parseInt(arrTestTypes[i]) === testType) {
        arrIsMultiple[i] === '1' ?
          newArray.push(array[i]) :
          value = parseInt(array[i]);
      }
    };

    if (arrIsMultiple[i] === '1') {
      return newArray;
    } else {
      return value;
    }
  }

  editClick = async (dep) => {
    await this.setState({
      modalTitle: 'Editar Examen',
      patientExamId: dep.patientExamId,
      patientPetId: dep.patientPetId,
      patientPetName: dep.patientPetName,
      PetOwnerPetOwnerId: dep.PetOwnerPetOwnerId,
      petOwnerName: dep.petOwnerName,
      VeterinarianVeterinarianId: dep.VeterinarianVeterinarianId,
      veterinarianName: dep.veterinarianName,
      dateTimeReadOnly: this.getLongNow(new Date(dep.createdAt)),
      MedicalCenterMedicalCenterId: dep.MedicalCenterMedicalCenterId,
      patientAnotherTypeOfSample: (dep.patientAnotherTypeOfSample === null ? '' : dep.patientAnotherTypeOfSample),
      patientExamRemarks: dep.patientExamRemarks,
      patientExamAddress: dep.patientExamAddress,
      patientExamTelNumber: dep.patientExamTelNumber,
      patientExamIsUrgency: (dep.patientExamIsUrgency === null ? false : dep.patientExamIsUrgency),
      validateMessage: '',
      arrTypeOfSamples: dep.typeOfSampleIds.split(','),
      arrayValidate: [true, true, true, true, true, true, true,],
      arrTestTypes: dep.TestTypeTestTypeIds.split(','),

      arrLabTests1: this.getlabTests(dep.laboratoryTestIds.split(','), 1, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests2: this.getlabTests(dep.laboratoryTestIds.split(','), 2, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests3: this.getlabTests(dep.laboratoryTestIds.split(','), 3, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests4: this.getlabTests(dep.laboratoryTestIds.split(','), 4, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests5: this.getlabTests(dep.laboratoryTestIds.split(','), 5, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests6: this.getlabTests(dep.laboratoryTestIds.split(','), 6, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests7: this.getlabTests(dep.laboratoryTestIds.split(','), 7, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests8: this.getlabTests(dep.laboratoryTestIds.split(','), 8, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
      arrLabTests9: this.getlabTests(dep.laboratoryTestIds.split(','), 9, dep.TestTypeTestTypeIds.split(','), dep.testTypeIsMultiples.split(',')),
    });
    await this.setState({ notAnotherTypeOfSample: (this.state.arrTypeOfSamples.indexOf('0') > -1 ? false : true) });
    if (await this.state.badToken === false) {
      await this.refreshMedicalCenters();
      await this.refreshPetOwner();
      await this.refreshTestTypes(false);

      this.state.backLabTests[0] = await this.backLabel0 + 'alert-success';
      for (var i = 0; i < this.state.arrTestTypes.length; i++) {
        const testType = parseInt(this.state.arrTestTypes[i]);
        this.state.backLabTests[testType] = await this.backLabel + 'alert-success';
      }
    }
  };

  getArrLabTests = () => {
    var arrLabTests = '';
    if (this.state.arrLabTests1.length > 0) {
      arrLabTests += this.state.arrLabTests1.isArray ? this.state.arrLabTests1.join() : ',' + this.state.arrLabTests1;
      console.log(this.state.arrLabTests1);
    }
    if (this.state.arrLabTests2.length > 0) {
      arrLabTests += this.state.arrLabTests2.isArray ? this.state.arrLabTests2.join() : ',' + this.state.arrLabTests2;
    }
    if (this.state.arrLabTests3.length > 0) {
      arrLabTests += this.state.arrLabTests3.isArray ? this.state.arrLabTests3.join() : ',' + this.state.arrLabTests3;
    }
    if (this.state.arrLabTests4.length > 0) {
      arrLabTests += this.state.arrLabTests4.isArray ? this.state.arrLabTests4.join() : ',' + this.state.arrLabTests4;
    }
    if (this.state.arrLabTests5.length > 0) {
      arrLabTests += this.state.arrLabTests5.isArray ? this.state.arrLabTests5.join() : ',' + this.state.arrLabTests5;
    }
    if (this.state.arrLabTests6.length > 0) {
      arrLabTests += this.state.arrLabTests6.isArray ? this.state.arrLabTests6.join() : ',' + this.state.arrLabTests6;
    }
    if (this.state.arrLabTests7.length > 0) {
      arrLabTests += this.state.arrLabTests7.isArray ? this.state.arrLabTests7.join() : ',' + this.state.arrLabTests7;
    }
    if (this.state.arrLabTests8.length > 0) {
      arrLabTests += this.state.arrLabTests8.isArray ? this.state.arrLabTests8.join() : ',' + this.state.arrLabTests8;
    }
    if (this.state.arrLabTests9.length > 0) {
      arrLabTests += this.state.arrLabTests9.isArray ? this.state.arrLabTests9.join() : ',' + this.state.arrLabTests9;
    }
    if (arrLabTests.substring(0, 1) === ',') {
      arrLabTests = arrLabTests.substring(1, arrLabTests.length);
    }
    console.log(arrLabTests);
    arrLabTests = arrLabTests.split(',');
    console.log(arrLabTests);
    return arrLabTests;
  }

  createClick() {
    console.log(this.state.arrTypeOfSamples);
    fetch(REACT_APP_API_URL + this.site, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.state.Token.token
      },
      body: JSON.stringify({
        patientExamRemarks: this.state.patientExamRemarks,
        patientExamAddress: this.state.patientExamAddress,
        patientExamTelNumber: parseInt(this.state.patientExamTelNumber),
        patientExamIsUrgency: this.state.patientExamIsUrgency,
        patientAnotherTypeOfSample: this.state.patientAnotherTypeOfSample,
        VeterinarianVeterinarianId: parseInt(this.state.VeterinarianVeterinarianId),
        veterinarianName: this.state.veterinarianName,
        patientPetId: parseInt(this.state.patientPetId),
        MedicalCenterMedicalCenterId: parseInt(this.state.MedicalCenterMedicalCenterId),
        arrTypeOfSamples: this.state.arrTypeOfSamples,
        arrLabTests: this.getArrLabTests(),
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
          this.refreshPatientExams();
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
        PetOwnerPetOwnerId: parseInt(this.state.PetOwnerPetOwnerId),
        VeterinarianVeterinarianId: parseInt(this.state.VeterinarianVeterinarianId),
        veterinarianName: parseInt(this.state.veterinarianName),
        MedicalCenterMedicalCenterId: parseInt(this.state.MedicalCenterMedicalCenterId),
        patientExamId: parseInt(this.state.patientExamId),
        TokenExternal: this.state.Token.token,
      })
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        !data.message ? alert(data.error) : alert(data.message);
        if (this.state.badToken === false) {
          this.refreshPatientExams();
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
            this.refreshPatientExams();
          }
        }, (error) => {
          alert('¡Falló!');
        })
    }
  }

  validateForm() {

    /*console.log(this.state.patientPetName.length, this.state.petOwnerName.length, '\n',
      String(this.state.PetOwnerPetOwnerId).length, this.state.patientPetGender, '\n',
      this.state.createdAt, this.state.patientPetHeight, this.state.patientPetWeight);*/
    try {
      return (
        (this.state.patientPetName.length > this.lim - 3 || this.state.patientPetId > 0) &&
        (this.state.petOwnerName.length > this.lim || this.state.PetOwnerPetOwnerId > 0) &&
        this.state.veterinarianName.length > this.lim && String(this.state.VeterinarianVeterinarianId).length > this.lim &&
        this.state.arrTypeOfSamples.length > 0 &&
        (this.state.arrTypeOfSamples.indexOf('0') === -1 || this.state.patientAnotherTypeOfSample.length > this.lim) &&
        (this.validateLabTests()) &&
        this.state.badToken === false
      );
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  render() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      patientExams,
      patientPets,
      petOwners,
      typeOfSamples,
      testTypes,
      badToken,
      modalTitle,
      patientExamId,
      patientPetName,
      PetOwnerPetOwnerId,
      dateTimeReadOnly,
      VeterinarianVeterinarianId,
      veterinarianName,
      veterinarianExists,
      arrTypeOfSamples,
      typeOfSampleOption,
      notAnotherTypeOfSample,
      patientAnotherTypeOfSample,
      patientExamRemarks,
      patientExamAddress,
      patientExamTelNumber,
      patientExamIsUrgency,

      laboratoryTests1,
      laboratoryTests2,
      laboratoryTests3,
      laboratoryTests4,
      laboratoryTests5,
      laboratoryTests6,
      laboratoryTests7,
      laboratoryTests8,
      laboratoryTests9,
      testTypeIsMultipleOption,
      testTypeNoMultipleOption,
      arrLabTests1,
      arrLabTests2,
      arrLabTests3,
      arrLabTests4,
      arrLabTests5,
      arrLabTests6,
      arrLabTests7,
      arrLabTests8,
      arrLabTests9,
      backLabTests,

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
                  <input className='form-control m-2' onInput={this.onChangeCreatedAtFilter} placeholder='Filtro' />
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('createdAt', true)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-down-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('createdAt', false)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-up-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z' />
                    </svg>
                  </button>
                </div>
                Fecha
              </th>
              <th>
                <div className='d-flex flex-row'>
                  <input className='form-control m-2' onInput={this.onChangePatientPetFilter} placeholder='Filtro' />
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
                  <input className='form-control m-2' onInput={this.onChangeVeterinarianNameFilter} placeholder='Filtro' />
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('veterinarianName', true)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-down-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light' onClick={() => this.sortResult('veterinarianName', false)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-up-square-fill' viewBox='0 0 16 16'>
                      <path d='M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z' />
                    </svg>
                  </button>
                </div>
                Veterinario
              </th>
              <th>
                Tipo de Muestra
              </th>
              <th>
                Pruebas de Laboratorio
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {patientExams.map(dep =>
              <tr key={dep.patientExamId}>
                <td>{String(dep.createdAt).substring(0, 10)}</td>
                <td>{dep.patientPetName}</td>
                <td>{dep.veterinarianName}</td>
                <td>{dep.typeOfSampleNames}</td>
                <td>{dep.laboratoryTestNames}</td>
                <td>
                  <button type='button' className='btn btn-light mr-1' data-bs-toggle='modal' data-bs-target='#exampleModal'
                    onClick={() => this.editClick(dep)} disabled={badToken}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-pencil-square' viewBox='0 0 16 16'>
                      <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                      <path fillRule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z' />
                    </svg>
                  </button>
                  <button type='button' className='btn btn-light mr-1' onClick={() => this.deleteClick(dep.patientExamId)} disabled={badToken}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-trash-fill' viewBox='0 0 16 16'>
                      <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
                    </svg>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className='modal fade' id='exampleModal' tabIndex='-1' aria-hidden='true'>
          <div className='modal-dialog modal-lg modal-dialog-centred'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>{(modalTitle)}</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group ' size='md'>
                    <Form.Label className='input-group-text col-md-3 col-form-label ' >Fecha:</Form.Label>
                    <Form.Control type='text' value={dateTimeReadOnly} readOnly={true} id='createdAt' />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-md-3 col-form-label control-label' >Paciente y Propietario:</Form.Label>
                    <Form.Control as='select' className="form-select" value={patientPetName} id='patientPetName'
                      onChange={this.onChangePatientPetName} onBlur={this.onBlurPatientPetName} required='required'>
                      <option hidden defaultValue value="0" key="0">Seleccione Nombre del Paciente...</option>
                      {patientPets.map(ppt => <option key={ppt.label}>
                        {ppt.label}
                      </option>)}
                    </Form.Control>
                    <Form.Control as='select' className="form-select" value={PetOwnerPetOwnerId} id='PetOwnerPetOwnerId'
                      onChange={this.onChangePetOwnerName} onBlur={this.onBlurPetOwner} required='required'>
                      <option hidden defaultValue value="0" key="0">Seleccione Propietario...</option>
                      {petOwners.map(pow => <option value={pow.petOwnerId} key={pow.petOwnerId}>
                        {pow.label}
                      </option>)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-md-3 col-form-label control-label' >Veterinario:</Form.Label>
                    <Form.Control type='number' value={VeterinarianVeterinarianId} placeholder='ID. del veterinario'
                      onChange={this.onChangeVeterinarianId} onBlur={this.onBlurVeterinarian}
                      id='VeterinarianVeterinarianId' required='required' />
                    <Form.Control type='name' value={veterinarianName} placeholder='Nombre del veterinario'
                      onChange={this.onChangeVeterinarianName} onBlur={this.onBlurVeterinarian}
                      readOnly={veterinarianExists} id='veterinarianName' required='required' />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className={`${backLabTests[0]} control-label`} >Tipo de muestra:</Form.Label>
                    <Form.Control as='select' className="form-select" value={arrTypeOfSamples} id='arrTypeOfSamples'
                      onChange={this.onChangeTypeOfSample} onBlur={this.onBlurTypeOfSample} multiple={true} required='required'>
                      <option defaultValue value="-1" key="-1">{typeOfSampleOption}</option>
                      {typeOfSamples.map(tos => <option value={tos.typeOfSampleId} key={tos.typeOfSampleId}>
                        {tos.typeOfSampleName}
                      </option>)}
                      <option defaultValue value="0" key="0">Otro</option>
                    </Form.Control>
                    <Form.Control as="textarea" rows={3} value={patientAnotherTypeOfSample} placeholder='Otro tipo de muestra'
                      onChange={this.onChangeAnotherTypeOfSample} onBlur={this.onBlurTypeOfSample} readOnly={notAnotherTypeOfSample}
                      id='patientAnotherTypeOfSample' required='required' />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                {testTypes.map(tty =>
                  <div key={tty.testTypeId}>
                    <Form.Group className='form-inline col-md-6 input-group mb-0 form-group required' size='md' >
                      <Form.Label className={backLabTests[tty.testTypeId]} >
                        {tty.testTypeName}
                      </Form.Label>
                      {tty.testTypeId === 1 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests1} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests1.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 2 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests2} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests2.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 3 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests3} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests3.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 4 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests4} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests4.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 5 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests5} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests5.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 6 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests6} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests6.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 7 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests7} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests7.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 8 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests8} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests8.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                      {tty.testTypeId === 9 ?
                        <Form.Control as='select' className='form-select' value={arrLabTests9} id={'tty_' + tty.testTypeId}
                          onChange={(e, i, isMultiple) => this.onChangeLaboratoryTest(e, tty.testTypeId, tty.testTypeIsMultiple === 1)}
                          onBlur={this.onBlurLaboratoryTest} multiple={tty.testTypeIsMultiple === 1} required='required'>
                          {tty.testTypeIsMultiple === 1 ?
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeIsMultipleOption}`}</option> :
                            <option defaultValue value="-1" key="-1">{`${tty.testTypeId} ${testTypeNoMultipleOption}`}</option>}
                          {laboratoryTests9.map(lab => <option value={lab.laboratoryTestId} key={lab.laboratoryTestId}>
                            {lab.laboratoryTestName}
                          </option>)}
                        </Form.Control>
                        : null}
                    </Form.Group>
                    <Form.Label size='md'></Form.Label>
                  </div>)} {/* End of Cycle for testTypes as "tty"*/}
                <div>
                  <Form.Group className='form-inline col-sm-12 input-group mb-0 form-group' size='md'>
                    <Form.Label className='input-group-text col-sm-3 col-form-label' >OBSERVACIONES:</Form.Label>
                    <Form.Control type='name' value={patientExamRemarks} placeholder='Datos relevantes. 
                        Especificaciones de pruebas. 
                        Antibióticos para antibiograma.'
                      onChange={this.onChangepatientExamRemarks} onBlur={this.onBlurpatientExamRemarks}
                      id='patientExamRemarks' size='sm' />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Label className='input-group-text col-md-3 col-form-label control-label' >Dirección y Teléfono:</Form.Label>
                    <Form.Control type='name' value={patientExamAddress} placeholder='Dirección y barrio'
                      onChange={this.onChangepatientExamAddress} onBlur={this.onBlurpatientExamAddress}
                      id='patientExamAddress' required='required' />
                    <Form.Control type='number' value={patientExamTelNumber} placeholder='Número de Contacto'
                      onChange={this.onChangepatientExamTelNumber} onBlur={this.onBlurpatientExamTelNumber}
                      id='patientExamAddress' required='required' />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                <div>
                  <Form.Group className='form-inline col-md-12 input-group mb-0 form-group required' size='md'>
                    <Form.Check inline label='Es una Urgencia' name='checkboxpatientExamIsUrgency' id={`patientExamIsUrgency`}
                      onChange={this.onChangepatientExamIsUrgency} checked={patientExamIsUrgency} onBlur={this.onBlurUserType} />
                  </Form.Group>
                  <Form.Label size='md'></Form.Label>
                </div>
                {patientExamId === 0 ?
                  <button type='button' className='btn btn-primary float-start'
                    onClick={() => this.createClick()} disabled={!this.validateForm()}>Crear</button> : null
                }
                {patientExamId !== 0 ?
                  <button type='button' className='btn btn-primary float-start'
                    onClick={() => this.updateClick()} disabled={!this.validateForm()}>Modificar</button> : null
                }
              </div>
              <div className='modal-footer'>
                <Form.Label>{validateMessage}</Form.Label>
              </div>
            </div>
          </div>
        </div >
      </div >
    )
  }
}
