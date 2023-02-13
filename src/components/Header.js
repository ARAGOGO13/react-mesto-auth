import HeaderLogo from '../images/header__logo.svg';
import {Routes, Route, Link} from 'react-router-dom'

export default function Header({email, signBtn, onSignBtnClick}) {
    return (
        <header className="header">
            <img className="header__logo" src={HeaderLogo} alt="Логотип приложения `Место`" />
            <div className="header__profile-info">
                <p className="header__email">{email}</p>
                <Routes>
                    <Route path='/' element={<Link to='/signup' className='header__sign-btn' onClick={onSignBtnClick}> Выйти </Link>} />
                    <Route path='/signup' element={<Link to='/signin' className='header__sign-btn' > Войти </Link>} />
                    <Route path='/signin' element={<Link to='/signup' className='header__sign-btn' > Регистрация </Link>} />
                </Routes>
            </div>
        </header>
    );
}
