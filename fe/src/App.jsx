import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header.jsx'
import './App.css'
import Sidebar from './components/Sidebar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Header />
      <Sidebar />
    </div>
    </>
  )
}

export default App
