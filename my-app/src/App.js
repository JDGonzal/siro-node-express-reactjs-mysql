// import logo from './logo.svg';
import './css/App.css';
import {Home} from './pages/home.js';
import {Pets} from './pages/pets.js';
import {Exams} from './pages/exams.js';
import {Token} from './pages/token.js';
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="App container">
      <h2 className="d-flex justify-content-center m-3">
          SIRIO
        </h2>   
        <h3 className="d-flex justify-content-center m-3">
          Investigación y Análisis Veterinario
        </h3>  

        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/login">
                Ingreso
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/pets">
                Pacientes
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/exams">
                Exámen Solicitado
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path='/login' component={Home}/>
          <Route path='/pets' component={Pets}/>
          <Route path='/exams' component={Exams}/>
          <Route path='/token' component={Token}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
