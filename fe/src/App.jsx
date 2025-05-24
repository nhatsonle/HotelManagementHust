import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header.jsx'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import Table from './components/Table.jsx'
import GuestTable from './components/GuestTable.jsx'
import RateTable from './components/RateTable.jsx'
import FrontDesk from './components/FrontDesk.jsx'
import Dashboard from './components/Dashboard.jsx'
import RoomTypeTable from './components/RoomTypeTable.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />
      <Sidebar />
      <div className=" mt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/frontdesk" element={<FrontDesk />} />
          <Route path="/guest" element={<GuestTable />} />
          <Route path="/room" element={<Table />} />
          <Route path="/roomtype" element={<RoomTypeTable />}/>
          <Route path="/rate" element={<RateTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;