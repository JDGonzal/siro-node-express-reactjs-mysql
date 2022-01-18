import React,{Component} from 'react';
import { REACT_APP_API_URL,REACT_APP_PHOTO_URL  } from '../utils/variables.js';

export class Exams extends Component{
  constructor(props){
    super(props);

    this.state={
      departments:[],
      exams:[],
      //Add Modal by each exam 
      modalTitle:"",
      ExamName:"", 
      ExamId:0,
      Department:"",
      DateOfJoining:"", 
      PhotoFileName:"anonymous.png",
      PhotoPath:REACT_APP_PHOTO_URL,
      Token:JSON.parse(localStorage.getItem("Token")),
    }
    this.site="exam";
    this.site2="department";
    this.alertMessage = 'Por favor Inicia Sesión para acceder a este sitio';
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
    .then(res=>res.json())
    .then(data=>{
      if(!data || data.ok ===false ){
        alert(this.alertMessage);
        return;
      }
      this.setState({exams:data})
    })
    fetch(REACT_APP_API_URL+this.site2,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'x-auth-token': this.state.Token.token
      }
    })
    .then(res=>res.json())
    .then(data=>{
      if(!data || data.ok ===false ){
        return;
      }
      this.setState({departments:data})
    })
  }

  componentDidMount(){
    this.refreshList();
  }

  onChangeExamName=(e)=>{
    this.setState({ExamName:e.target.value});
  }

  onChangeDepartment=(e)=>{
    this.setState({Department:e.target.value});
  }

  onChangeDateOfJoining=(e)=>{
    this.setState({DateOfJoining:e.target.value});
  }

  addClick(){
    this.setState({
      modalTitle:"Add Exam",
      ExamId:0,
      ExamName:"",
      Department:"",
      DateOfJoining:"",
      PhotoFileName:"anonymous.png"
    })
  }

  editClick(emp){
    this.setState({
      modalTitle:"Edit Exam",
      ExamId:emp.ExamId,
      ExamName:emp.ExamName,
      Department:emp.Department,
      DateOfJoining:String(emp.DateOfJoining).substring(0,10),//emp.DateOfJoining,
      PhotoFileName:emp.PhotoFileName
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
        ExamName:this.state.ExamName,
        Department:this.state.Department,
        DateOfJoining:this.state.DateOfJoining,
        PhotoFileName:this.state.PhotoFileName
      })
    })
    .then(res=>res.json())
    .then((data)=>{
      !data.message?alert(data.error) :alert(data.message);
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
        ExamId:this.state.ExamId,
        ExamName:this.state.ExamName,
        Department:this.state.Department,
        DateOfJoining:this.state.DateOfJoining,
        PhotoFileName:this.state.PhotoFileName
      })
    })
    .then(res=>res.json())
    .then((data)=>{
      !data.message?alert(data.error) :alert(data.message);
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
      .then((data)=>{
        !data.message?alert(data.error) :alert(data.message);
        this.refreshList();
      },(error)=>{
        alert('Failed');
      })
    }
  }

  imageUpload=(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    fetch(REACT_APP_API_URL+this.site+'/savefile',{
      method:'POST',
      body:formData,
      'x-auth-token': this.state.Token.token
    })
    .then(res=>res.json())
    .then(data=>{
      this.setState({PhotoFileName:data})
    })
  }

  render(){
    const{
      departments,
      exams, 
      modalTitle,
      ExamName,
      ExamId,
      Department,
      DateOfJoining,
      PhotoFileName, 
      PhotoPath
    }=this.state;

    return(
      <div>
        <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal"
        onClick={()=>this.addClick()}>
          Add Exam
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                Exam Id
              </th>
              <th>
                Exam Name
              </th>
              <th>
                Department
              </th>
              <th>
                Date of Joining
              </th>
              <th>
                Photo
              </th>
              <th>
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {exams.map(emp=>
              <tr key={emp.ExamId}>
                <td>{emp.ExamId}</td>
                <td>{emp.ExamName}</td>
                <td>{emp.Department}</td>
                <td>{String(emp.DateOfJoining).substring(0,10)}</td>
                <td><img width="32px" height="32px" src={PhotoPath+emp.PhotoFileName} alt=""/></td>
                <td>
                  <button type="button" className="btn btn-light mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal"
                  onClick={()=>this.editClick(emp)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light mr-1" onClick={()=>this.deleteClick(emp.ExamId)}>
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
                <div className="d-flex flex-row bd-highlight mb-3">
                  <div className="p-2 w-50 bd-highlight">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Exam Name</span>
                      <input type="text" className="form-control" value={ExamName} onChange={this.onChangeExamName}/>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Department</span>
                      <select className="form-select" value={Department} onChange={this.onChangeDepartment}>
                        <option hidden defaultValue> -- select an option -- </option>
                        {departments.map(dep=><option key={dep.DepartmentId}>
                          {dep.DepartmentName}
                        </option>)}
                      </select>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">D.O.J</span>
                      <input type="date" className="form-control" value={DateOfJoining} onChange={this.onChangeDateOfJoining}/>
                    </div>
                  </div>
                  <div className="p-2 w-50 bd-highlight">
                    <img width="250px" height="250px" src={PhotoPath+PhotoFileName} alt=""/>
                    <label htmlFor="avatar">Choose a profile picture:</label>
                    <input className="m-2" type="file" accept="image/png, image/jpeg" onChange={this.imageUpload} id="avatar" name="avatar"/>
                  </div>

                </div>
                  {ExamId===0?
                    <button type="button" className="btn btn-primary float-start" onClick={()=>this.createClick()}>Create</button>:null
                  }
                  {ExamId!==0?
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
