import React from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom'

import Home from './pages/Home/Home'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<SignUp/>} />
          
        </Routes>
      </Router>
    </div>
  )
}

// define the root component to handle the initial redirect
const Root=()=>{
  // check if token exisits in localstorage
  const isAuthenticated=!!localStorage.getItem("token");

  // redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ):(
    <Navigate to="/login" />
  )
}

export default App