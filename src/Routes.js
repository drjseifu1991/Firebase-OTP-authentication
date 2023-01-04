import React from 'react'
import Login from './routes/Login'
import SignUp from './routes/SignUp'
import { Routes, Route } from 'react-router-dom'

const Routess = () => {
  return (
    <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route exact path="/signup" element={<SignUp/>}/>
    </Routes>
  )
}

export default Routess
