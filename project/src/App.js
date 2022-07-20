import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from './Components/views/LandingPage/LandingPage'
import LoginPage from './Components/views/LoginPage/LoginPage'
import RegisterPage from './Components/views/RegisterPage/RegisterPage'


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element = { <LandingPage/> }/>
          <Route exact path="/login" element = { <LoginPage/> }/>
          <Route exact path="/register" element = { <RegisterPage/> }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
