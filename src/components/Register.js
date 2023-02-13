import {useState} from 'react';
import {Link} from 'react-router-dom'

export default function Register({onSubmit}) {

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    function handleEmailChange(e) {
        setUserEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setUserPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(userEmail, userPassword);
    }

    return (
        <div className="form__container">
            <form className="form_type_sign" onSubmit={handleSubmit} name='register'>
                <h2 className="form__heading form__heading_type_sign">Регистрация</h2>
                <input
                    className="form__input form__input_type_sign"
                    type="email"
                    name="sign-form_email"
                    required
                    minLength="2"
                    maxLength="40"
                    placeholder="Email"
                    onChange={handleEmailChange}
                />
                <span className="form__input-error"></span>
                <input
                    className="form__input form__input_type_sign"
                    type="password"
                    name="sign-form_password"
                    required
                    minLength="2"
                    maxLength="200"
                    placeholder="Пароль"
                    onChange={handlePasswordChange}
                />
                <span className="form__input-error"></span>
                <button className="form__submit-btn form__submit-btn_type_sign" type="submit">Регистрация
                </button>
                <Link to="/signin" className="form__login-link">
                    Уже зарегистрированы? Войти
                </Link>
            </form>
        </div>
    );
}