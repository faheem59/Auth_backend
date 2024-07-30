import React from 'react'
import Otp from './pages/Otp'
import ProfileForm from './pages/ProfileForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Otp />} />
        <Route path="/detail" element={<ProfileForm/>}/>
     </Routes>
    </Router>
  )
}

export default App