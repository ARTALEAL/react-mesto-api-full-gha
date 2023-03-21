import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { api } from '../utils/Api';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirmation from './PopupWithConfirmation';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/Auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isOpenCardPopup, setIsOpenCardPopupOpen] = useState(false);
  const [isOpenPopupWithConfirmation, setIsOpenPopupWithConfirmation] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [removedCardId, setRemovedCardId] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  //Api states
  const [userName, setUserName] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [cards, setCards] = useState([]);

  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [authorizationEmail, setAuthorizationEmail] = useState('');

  const navigate = useNavigate();

  useEffect(()=> {
    handleTokenCheck()
  }, [navigate]);

  function checkPopUpOpen() {
    if (isEditAvatarPopupOpen) {
      setIsOpenPopup(true);
    }
    if (isEditProfilePopupOpen) {
      setIsOpenPopup(true);
    }
    if (isAddPlacePopupOpen) {
      setIsOpenPopup(true);
    }
    if (isOpenCardPopup) {
      setIsOpenPopup(true);
    }
    if (isOpenPopupWithConfirmation) {
      setIsOpenPopup(true);
    }
  }

  const openEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const openAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const openEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setIsOpenCardPopupOpen(true);
    setSelectedCard(card);
  };

  const openPopupWithConfirmation = (cardId) => {
    setIsOpenPopupWithConfirmation(true);
    setRemovedCardId(cardId);
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    const jwt = localStorage.getItem('jwt');
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked, jwt)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete(card) {
    const cardId = card._id;
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true);
    api
      .deleteCard(cardId, jwt)
      .then(() => {
        setCards((cards) => cards.filter((card) => card._id !== cardId));
        setIsOpenPopupWithConfirmation(false);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsOpenCardPopupOpen(false);
    setIsOpenPopupWithConfirmation(false);
    setIsInfoTooltipOpen(false);
  };

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);
    const jwt = localStorage.getItem('jwt')
    api
      .editUserInfo(newUserInfo, jwt)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(newData) {
    setIsLoading(true);
    const jwt = localStorage.getItem('jwt');
    api
      .editAvatar(newData, jwt)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    const jwt = localStorage.getItem('jwt');
    api
      .addCard(newCard, jwt)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsLoading(false));
  }

  // Hook
  function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
        closeAllPopups();
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    // Add event listeners
    useEffect(() => {
      checkPopUpOpen();
      isOpenPopup && window.addEventListener('keydown', downHandler);
      isOpenPopup && window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        setIsOpenPopup(false);
        isOpenPopup && window.removeEventListener('keydown', downHandler);
        isOpenPopup && window.removeEventListener('keyup', upHandler);
      };
    });
    return keyPressed;
  }

  useKeyPress('Escape');

  // Проверка токена
  const handleTokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth
      .checkToken(jwt)
      .then((data) => {
        setCurrentUser(data);
        setLoggedIn(true);
        setAuthorizationEmail(data.email);
        setUserName(data.name);
        setUserDescription(data.about);
        navigate('/');
      })
      .catch((err) => console.log(err));
    api
      .getInitialCards(jwt)
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => console.log(err));
  };

  const openInfoTooltip = () => {
    setIsInfoTooltipOpen(true);
  };

  // Регистрация и Авторизация профиля
  const handleRegistration = (data) => {
    return auth
      .register(data)
      .then(() => {
        setIsRegistrationSuccessful(true);
        openInfoTooltip();
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        setIsRegistrationSuccessful(false);
        openInfoTooltip();
      });
  };

  const handleAuthorization = (data) => {
    return auth
      .authorize(data)
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        setLoggedIn(true);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip();
      });
  };

  useEffect(() => {
      if (loggedIn) {
        navigate('/');
      }
    }, [loggedIn, navigate]);

  //Выход
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    navigate('/sign-in');
    setLoggedIn(false);
    setCurrentUser({});
    setAuthorizationEmail('');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header
            loggedIn={loggedIn}
            userEmail={authorizationEmail}
            onSignOut={handleSignOut}
          />
          <Routes>
            <Route
              path="/sign-in"
              element={<Login onLogin={handleAuthorization} />}
            />
            <Route
              path="/sign-up"
              element={<Register onRegister={handleRegistration} />}
            />
            <Route
              path="*"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    onEditAvatar={openEditAvatarClick}
                    onEditProfile={openEditProfileClick}
                    onAddPlace={openAddPlaceClick}
                    userName={userName}
                    userDescription={userDescription}
                    cards={cards}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={openPopupWithConfirmation}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />

          {/* POPUP profile */}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading}
          />

          {/* PopUP addCard */}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            onLoading={isLoading}
          />

          {/* PopUP edit Avatar */}
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading}
          />

          <ImagePopup
            isOpen={isOpenCardPopup}
            card={selectedCard}
            onClose={closeAllPopups}
          ></ImagePopup>
          <PopupWithConfirmation
            isOpen={isOpenPopupWithConfirmation}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onSubmit={handleCardDelete}
            card={removedCardId}
          />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isRegistrationSuccessful}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
