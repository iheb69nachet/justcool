import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import JustCool from './JustCool.tsx'

createRoot(document.getElementById('root')!).render(
    <JustCool />
)
