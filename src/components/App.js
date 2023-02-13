import {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import '../App.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';
import Login from './Login';
import Register from './Register';
import InfoToolTip from './InfoToolTip';
import {register, login, auth} from '../utils/auth';
import ProtectedRouteElement from './ProtectedRoute';
import {api} from '../utils/api.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState({});

    const [cards, setCards] = useState([]);

    const [loggedIn, setLoggedIn] = useState(false);

    const [userEmail, setUserEmail] = useState('');

    const [signBtn, setSignBtn] = useState('');

    const [isInfoTipToolOpen, setIsInfoTipToolOpen] = useState(false);
    const [infoTipToolStatus, setInfoTipToolStatus] = useState(true);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [isDeleteConfirmationPopupOpen, setIsDeleteConfirmationPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        handleCheckToken();
    }, [])

    useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getProfileInformation(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(user);
                    setCards(cards)
                })
                .catch((err) => console.log(err));
        }
    }, [loggedIn])

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsDeleteConfirmationPopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsImagePopupOpen(false);
        setIsInfoTipToolOpen(false);
    }

    function closePopupsOnOutsideClick(e) {
        console.log('dsa');
        if (e.target.classList.contains('popup_opened') || e.target.classList.contains('popup__close-btn')) {
            closeAllPopups();
        }
    }

    function handleImagePopupClick(card) {
        setIsImagePopupOpen(true);
        setSelectedCard(card);
    }

    function handleDeleteConfirmationClick(card) {
        api.deleteCard(card.card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card.card._id));
                setIsDeleteConfirmationPopupOpen(false);
            })
            .catch((err) => console.log(err));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        setIsDeleteConfirmationPopupOpen(true);
        setSelectedCard(card);
    }

    function handleUpdateUser(newUserInfo) {
        api.patchUserInfo(newUserInfo)
            .then((newUser) => {
                setCurrentUser(newUser);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(newAvatar) {
        api.patchNewAvatar(newAvatar.avatar)
            .then((avatar) => {
                setCurrentUser(avatar);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCardData) {
        api.postNewCard(newCardData)
            .then((newCard) => setCards([newCard, ...cards]))
            .catch((err) => console.log(err));
    }

    function handleOpenInfoTipTool(result) {
        setInfoTipToolStatus(result);
        setIsInfoTipToolOpen(true);
    }

    function handleLogin(email, password) {
        login(email, password)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('jwt', res.token);
                    setUserEmail(email);
                    setLoggedIn(true);
                    setSignBtn('Регистрация');
                    navigate('/', {replace: true});
                    return res;
                }
            })
            .catch((err) => {
                console.log(err)
                handleOpenInfoTipTool(false);
            });
    }

    function handleRegister(email, password) {
        register(email, password)
            .then((res) => {
                console.log(res);
                if (res) {
                    handleOpenInfoTipTool(true);
                    setSignBtn('Вход');
                    navigate('/signin', {replace: true});
                }
            })
            .catch((err) => {
                console.log(err)
                handleOpenInfoTipTool(false);
            })
    }

    function handleCheckToken() {
        const jwt = localStorage.getItem('jwt')
        if (jwt) {
            auth(jwt)
                .then((res) => {
                    if (res) {
                        setUserEmail(res.data.email);
                        setLoggedIn(true);
                        setSignBtn('Выйти');
                        navigate('/', {replace: true})
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function handleSignOut() {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setUserEmail('');
        setSignBtn('');
        navigate('/signup', {replace: true})
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root">
                <Header email={userEmail} signBtn={signBtn} onSignBtnClick={handleSignOut}/>
                <Routes>
                    <Route path='/' element={
                        <ProtectedRouteElement
                            loggedIn={loggedIn}
                            element={Main}
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onCardImg={handleImagePopupClick}
                            cardHandler={handleImagePopupClick}
                            onCardLikeClick={handleCardLike}
                            cards={cards}
                            onCardDeleteClick={handleCardDelete}
                        />}
                    />
                    <Route path='/signup' element={<Register onSubmit={handleRegister}/>}/>
                    <Route path='/signin' element={<Login onSubmit={handleLogin}/>}/>
                </Routes>
                <Footer/>
                <div className="popups">
                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                        onOutsideClickClose={closePopupsOnOutsideClick}
                    />
                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                        onOutsideClickClose={closePopupsOnOutsideClick}
                    />
                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddNewPlace={handleAddPlaceSubmit}
                        onOutsideClickClose={closePopupsOnOutsideClick}
                    />
                    <ImagePopup onClose={closeAllPopups} card={selectedCard} isOpen={isImagePopupOpen}/>
                    <DeleteConfirmationPopup
                        onClose={closeAllPopups}
                        card={selectedCard}
                        isOpen={isDeleteConfirmationPopupOpen}
                        onConfirmation={handleDeleteConfirmationClick}
                        onOutsideClickClose={closePopupsOnOutsideClick}
                    />
                    <InfoToolTip
                        isOpen={isInfoTipToolOpen}
                        status={infoTipToolStatus}
                        onClose={closeAllPopups}
                        onOutsideClickClose={closePopupsOnOutsideClick}
                    />
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
