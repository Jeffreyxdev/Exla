import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Events from './InnerPages/Events'
import Guide from './Pages/Guide'
import Search from './Pages/Search'
import Login from './Pages/Login'
import Signup from './Pages/signup'
import Pricing from './Pages/Pricing'
import About from './Pages/About'
import Communities from './Pages/Communities'
import Navbar from './Components/Navbar'
import Footer from './Components/Navbar'
import Isignup from './Pages/[Individual]/Signup'
import Osignup from './Pages/[Organizers]/Signup'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover-events" element={<Events/>} />
        <Route path="/How-exla-works" element={<Guide/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/search" element={<Search />} />
        <Route path="/create-account" element={<Signup/>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about-exla" element={<About/>} />
        <Route path="/communities" element={<Communities/>} />
        <Route path="/Individual-signup" element={<Isignup />} />
        <Route path="/Organizers-signup" element={<Osignup />} />

        

      </Routes>
      <Footer/>
    </div>
  )
}

export default App