import { Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import SignUP from '../Pages/SignUp';
import Navbar from '../Components/Navbar';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<SignUP />}></Route>
    </Routes>
  );
};

export default App;
