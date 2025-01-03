import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Events from './InnerPages/Events'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Signup from './Pages/signup'
import Pricing from './Pages/Pricing'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover-events" element={<Events/>} />
        <Route path="/How-exla-works" element={<Guide/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Signup/>} />
        <Route path="/" element={<Pricing />} />

        

      </Routes>
    </div>
  )
}

export default App