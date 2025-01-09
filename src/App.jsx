import React,{useState} from 'react'
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
import Footer from './Components/Footer'
import Isignup from './Pages/[Individual]/Signup'
import Osignup from './Pages/[Organizers]/Signup'
import { signOut } from "firebase/auth";
o
import { auth } from "./Firebase/Firebase-config";
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import UserProfile from './Pages/Profillr'
const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  const GoogleSignout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    window.location.pathname = "/login"
    })
  }

  return (
    <div>
       <ToastContainer position="top-right" theme="colored"/>
      <Navbar GoogleSignout={GoogleSignout} isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/discover" element={<Events isAuth={isAuth}/>} />
        <Route path="/how-exla-works" element={<Guide isAuth={isAuth}/>} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth}/>} />
        <Route path="/profile" element={<UserProfile setIsAuth={setIsAuth}/>} />
        <Route path="/search" element={<Search isAuth={isAuth}/>} />
        <Route path="/create-account" element={<Signup isAuth={isAuth}/>} />
        <Route path="/pricing" element={<Pricing isAuth={isAuth}/>} />
        <Route path="/about-exla" element={<About isAuth={isAuth}/>} />
        <Route path="/communities" element={<Communities isAuth={isAuth}/>} />
        <Route path="/individual-signup" element={<Isignup setIsAuth={setIsAuth}/>} />
        <Route path="/organizers-signup" element={<Osignup setIsAuth={setIsAuth} />} />

        

      </Routes>
      <Footer/>
    </div>
  )
}

export default App