import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Toolbar from './Components/Toolbar';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: "auto"
      }}
    >
      <ToastContainer />
      <Toolbar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route path='/auth/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;