import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/Login/SignIn'
import './index.css'
import SignUp from './components/Login/SignUp'
import SupaGall from './components/SupaGallComponent/SupaGall'


function App() {
  

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<SupaGall/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/signup" element={<SignUp/>} />
          </Routes>
        </Router>
        
      </div>
    </>
  )
}

export default App
