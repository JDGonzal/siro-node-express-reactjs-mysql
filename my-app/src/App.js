// import logo from './logo.svg';
import './css/App.css';
import {Home} from './pages/home';
import {Pets} from './pages/pets.js';
import {Employee} from './pages/employee';
import {Token} from './pages/token';
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
              <NavLink className="btn btn-light btn-outline-primary" to="/sirio/login">
                Ingreso
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/sirio/pets">
                Pacientes
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/sirio/employee">
                Exámen Solicitado
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path='/sirio/login' component={Home}/>
          <Route path='/sirio/pets' component={Pets}/>
          <Route path='/sirio/employee' component={Employee}/>
          <Route path='/sirio/token' component={Token}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
