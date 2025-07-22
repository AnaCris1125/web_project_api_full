
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip/InfoTooltip.jsx';

// import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { authorize, register, checkToken } from '../utils/auth.js';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true); 

  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    if (currentUser && cards.length > 0) {
      localStorage.setItem(`userCards_${currentUser._id}`, JSON.stringify(cards));
    }
  }, [cards, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`userData_${currentUser._id}`, JSON.stringify(currentUser));
      localStorage.setItem('currentUserId', currentUser._id); 
    }
  }, [currentUser]);

   useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((res) => {
          const userId = res.data._id;
          const storedUser = JSON.parse(localStorage.getItem(`userData_${userId}`));

          if (storedUser) {
            setCurrentUser(storedUser);
          } else {
            const basicUser = {
              _id: userId,
              email: res.data.email,
              name: "Nombre de prueba",
              about: "Descripción de prueba",
              avatar: "https://via.placeholder.com/150"
            };
            setCurrentUser(basicUser);
            localStorage.setItem(`userData_${userId}`, JSON.stringify(basicUser));
          }

          setLoggedIn(true);

          const storedCards = JSON.parse(localStorage.getItem(`userCards_${userId}`));
          setCards(storedCards && Array.isArray(storedCards) ? storedCards : []);

          navigate('/');
        })
        .catch(err => {
          console.error("❌ Token inválido:", err);
          setLoggedIn(false);
        });
    }
  }, [navigate]);
  
  const handleLogin = (email, password) => {
    authorize(email, password)
      .then(data => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          return checkToken(data.token);
        }
        return Promise.reject('No se recibió token');
      })
      .then(res => {
        const userId = res.data._id;
        const storedUser = JSON.parse(localStorage.getItem(`userData_${userId}`));

        if (storedUser) {
          setCurrentUser(storedUser);
        } else {
          const basicUser = {
            _id: userId,
            email: res.data.email,
            name: "Nombre de prueba",
            about: "Descripción de prueba",
            avatar: "https://via.placeholder.com/150"
          };
          setCurrentUser(basicUser);
          localStorage.setItem(`userData_${userId}`, JSON.stringify(basicUser));
        }

        localStorage.setItem('currentUserId', userId);

        const storedCards = JSON.parse(localStorage.getItem(`userCards_${userId}`));
        setCards(storedCards && Array.isArray(storedCards) ? storedCards : []);

        navigate('/');
      })
      .catch(err => {
        console.error('Error en login:', err);
        setIsSuccess(false);
        setIsTooltipOpen(true);
      });
  };

  const handleRegister = (email, password) => {
    register(email, password)
      .then(res => {
        if (res.data) {
          setIsSuccess(true);
          setCards([]);
          navigate('/signin');
        } else {
          setIsSuccess(false);
        }
        setIsTooltipOpen(true);
      })
      .catch(() => {
        setIsSuccess(false);
        setIsTooltipOpen(true);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');    
    setLoggedIn(false);                
    setCurrentUser(null);                                   
    navigate('/signin');
  };


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