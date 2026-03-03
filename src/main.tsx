import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import JustCool from './JustCool.tsx'
import About from './components/About.tsx'
import './App.css'
import Header from './components/NavBar.tsx'
import Footer from './components/Footer.tsx'
import FloatingMenu from './components/FloatingMenu.tsx'
import CookieConsent from './components/Cookieconsent.tsx'
import MentionsLegales from './components/Mentionslegales.tsx'
import CGV from './components/Cgv.tsx'
import CartFAB from './components/Cartfab.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        
        <Route path="/" element={<JustCool />} />
        <Route path="/about" element={<About />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgv" element={<CGV />} />


      </Routes>
      <CookieConsent/>
      <FloatingMenu/>
     <Footer/>
    </BrowserRouter>
  </StrictMode>
)