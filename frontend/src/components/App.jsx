
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip/InfoTooltip.jsx';
import * as auth from '../utils/auth';

import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import { authorize, register, checkToken } from '../utils/auth.js';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Al cargar, verifica si hay token:
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((user) => {
          setLoggedIn(true);
          setCurrentUser(user);
          setUserEmail(user.email);
          navigate('/');
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false)); // ✅ marca como terminado
    } else {
      setIsLoading(false); // ✅ tampoco estamos cargando
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        .catch((err) => console.log('Error al cargar las cards:', err));
    }
  }, [loggedIn]);


  // Register handler
  const handleRegister = ({ email, password }) => {
    auth.register({ email, password })
      .then(() => {
        handleLogin({ email, password }); // loguea después de registrar
      })
      .catch(err => console.log(err));
  };

    // Login handler
    const handleLogin = ( email, password ) => {
      auth.authorize( email, password )
        .then((data) => {
          if (data.token) {
            localStorage.setItem('jwt', data.token);
            setLoggedIn(true);
            return auth.checkToken(data.token);
          }
        })
        .then((user) => {
          setCurrentUser(user.data);
          navigate('/');
        })
        .catch(err => console.log(err));
    };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserEmail('');
    navigate('/signin');
  };

  if (isLoading) {
    return <div>Loading...</div>; // o tu spinner
  }


  return (
    
    <CurrentUserContext.Provider value={{ currentUser }}>
      <Header loggedIn={loggedIn} userEmail={currentUser?.email} onLogout={handleLogout} />
      <Routes>
        <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Register onRegister={handleRegister} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute
              loggedIn={!!currentUser}
              element={
                <>
                  <Main cards={cards} setCards={setCards} setCurrentUser={setCurrentUser} />
                  <Footer />
                </>
              }
            />
          }
        />
      </Routes>

      <InfoTooltip
        isOpen={isTooltipOpen}
        isSuccess={isSuccess}
        onClose={() => setIsTooltipOpen(false)}
      />
    </CurrentUserContext.Provider>
  );
}


export default App;

