import './App.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import AboutUs from './components/pages/AboutUs'
import Gallery from './components/pages/Gallery'
import TheProject from './components/pages/TheProject'
import SignIn from './components/pages/SignIn'
import SignUp from './components/pages/SignUp'

import Container from './components/Container'

function App() {

  return (
    <div className="container">
      <Router>
        <Header></Header>
        <Container>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/about-us" element={<AboutUs></AboutUs>}></Route>
          <Route path="/gallery" element={<Gallery></Gallery>}></Route>
          <Route path="/project" element={<TheProject></TheProject>}></Route>
          <Route path="/sign-in" element={<SignIn></SignIn>}></Route>
          <Route path="/sign-up" element={<SignUp></SignUp>}></Route>
        </Container>
      </Router>
    </div>
  )
}

export default App
