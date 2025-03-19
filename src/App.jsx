
import './App.css'
import {Routes,Route }from 'react-router-dom'
import LoginPage from './components/Auth/Login'
import StudentDashboard from './components/Dashboard/Dashboard'
import SignupPage from './components/Auth/Signup'

function App() {
  

  return (
    <div>
    <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path='/dashboard' element={<StudentDashboard/>}/>
    </Routes>
    </div>
  )
}

export default App
