import HeaderLogo from '../images/header__logo.svg';

export default function Header({email, signBtn, onSignOutBtnClick}) {
    return (
        <header className="header">
            <img className="header__logo" src={HeaderLogo} alt="Логотип приложения `Место`" />
            <div className="header__profile-info">
                <p className="header__email">{email}</p>
                <button className="header__sign-btn" onClick={onSignOutBtnClick}>{signBtn}</button>
            </div>
        </header>
    );
}
