import React,{Component} from 'react';
import { REACT_APP_API_URL } from '../utils/variables.js';

export class Pets extends Component{

  constructor(props){
    super(props);

    this.state={
      pets:[],
      //Add Modal by each pet 
      modalTitle:"",
      PetName:"", 
      PetId:0,
      
      PetIdFilter:"",
      PetNameFilter:"",
      petsWithoutFilter:[],
      Token:JSON.parse(localStorage.getItem("Token"))
    }
    this.site="pet";
    this.alertMessage = 'Por favor Inicia Sesión para acceder a este sitio';
  }

  FilterFn(){
    var PetIdFilter=this.state.PetIdFilter;
    var PetNameFilter=this.state.PetNameFilter;

    var filterData=this.state.petsWithoutFilter.filter(
      function(el){
        return el.PetId.toString().toLowerCase().includes(
          PetIdFilter.toString().trim().toLowerCase()
        )&&
        el.PetName.toString().toLowerCase().includes(
          PetNameFilter.toString().trim().toLowerCase()
        )
      }
    );
    this.setState({pets:filterData});
  }

  sortResult(prop, asc){
    var sortedData=this.state.petsWithoutFilter.sort(function(a,b){
      if (asc){
        return(a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
      }else{
        return(b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
      }
    });
    this.setState({pets:sortedData});
  }

  onChangePetIdFilter=(e)=>{
    // this.setState({PetIdFilter:e.target.value}) //This Option not work, it is necessary to use the mutate state directly
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.PetIdFilter=e.target.value;
    this.FilterFn();
  }

  onChangePetNameFilter=(e)=>{
    // this.setState({PetNameFilter:e.target.value}) //This Option not work, it is necessary to use the mutate state directly
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.PetNameFilter=e.target.value;
    this.FilterFn();
  }

  refreshList(){
    if (this.state.Token === undefined || this.state.Token === null){
      alert(this.alertMessage);
      return;
    }
    console.log('Token:',this.state.Token, ' token:',this.state.Token.token);
    fetch(REACT_APP_API_URL+this.site,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'x-auth-token': this.state.Token.token
      }
    })
    .then(response=>response.json())
    .then(data=>{
      if(!data || data.ok ===false ){
        alert(this.alertMessage);
        return;
      }
      this.setState({pets:data, petsWithoutFilter:data});
      // console.log(this.pets,data,this.petsWithoutFilter);
    })
  }

  componentDidMount(){
    this.refreshList();
  }

  onChangePetName=(e)=>{
    this.setState({PetName:e.target.value});
  }

  addClick(){
    this.setState({
      modalTitle:"Add Pet",
      PetId:0,
      PetName:""
    })
  }

  editClick(dep){
    this.setState({
      modalTitle:"Edit Pet",
      PetId:dep.PetId,
      PetName:dep.PetName
    })
  }

  createClick(){
    fetch(REACT_APP_API_URL+this.site,{
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'x-auth-token': this.state.Token.token
      },
      body:JSON.stringify({
        PetName:this.state.PetName
      })
    })
    .then(res=>res.json())
    .then((result)=>{
      !result.message?alert(result.error) :alert(result.message);
      this.refreshList();
    },(error)=>{
      alert('Failed');
    })
  }

  updateClick(){
    fetch(REACT_APP_API_URL+this.site,{
      method:'PUT',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'x-auth-token': this.state.Token.token
      },
      body:JSON.stringify({
        PetId:this.state.PetId,
        PetName:this.state.PetName
      })
    })
    .then(res=>res.json())
    .then((result)=>{
      console.log(result);
      !result.message?alert(result.error) :alert(result.message);
      this.refreshList();
    },(error)=>{
      alert('Failed');
    })
  }

  deleteClick(id){
    if(window.confirm('Are you sure?')){
      fetch(REACT_APP_API_URL+this.site+'/'+id,{
        method:'DELETE',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'x-auth-token': this.state.Token.token
        }
      })
      .then(res=>res.json())
      .then((result)=>{
        console.log(result);
        !result.message?alert(result.error) :alert(result.message);
        this.refreshList();
      },(error)=>{
        alert('Failed');
      })
    }
  }

  render(){
    const{
      pets, 
      modalTitle,
      PetName,
      PetId
    }=this.state;

    return(
      <div>
        <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal"
        onClick={()=>this.addClick()}>
          Add Pet
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2" onInput={this.onChangePetIdFilter} placeholder="Filter"/>
                  <button type="button" className="btn btn-light" onClick={()=>this.sortResult('PetId', true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light" onClick={()=>this.sortResult('PetId', false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                  </button>
                </div>
                Pet Id
              </th>
              <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2" onInput={this.onChangePetNameFilter} placeholder="Filter"/>
                  <button type="button" className="btn btn-light" onClick={()=>this.sortResult('PetName', true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light" onClick={()=>this.sortResult('PetName', false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                  </button>
                </div>
                Pet Name
              </th>
              <th>
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {pets.map(dep=>
              <tr key={dep.PetId}>
                <td>{dep.PetId}</td>
                <td>{dep.PetName}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal"
                  onClick={()=>this.editClick(dep)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light mr-1" onClick={()=>this.deleteClick(dep.PetId)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                  </svg>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centred">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{(modalTitle)}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Pet Name</span>
                  <input type="text" className="form-control" value={PetName} onChange={this.onChangePetName}/>
                </div>
                {PetId===0?
                  <button type="button" className="btn btn-primary float-start" onClick={()=>this.createClick()}>Create</button>:null
                }
                {PetId!==0?
                  <button type="button" className="btn btn-primary float-start" onClick={()=>this.updateClick()}>Update</button>:null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
