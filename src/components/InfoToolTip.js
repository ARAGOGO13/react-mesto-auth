import infoToolTipConfirm from '../images/info-tool-tip_confirm.svg';
import infoToolTipReject from '../images/info-tool-tip_reject.svg';

export default function InfoToolTip({isOpen, status, onClose, onOutsideClickClose}) {
    return (<div
        className={`popup popup_type_with-form ${isOpen ? 'popup_opened' : ''}`}
        onClick={onOutsideClickClose}
    >
        <div className="popup__container">
            <div className="info-tip-tool">
                <img src={status ? infoToolTipConfirm : infoToolTipReject} className="info-tip-tool__mark"
                     alt="Картинка результата регистрации"/>
                <p className="info-tip-tool__text">{status ? 'Вы успешно зарегистрировались!' : 'Попробуйте еще раз'}</p>
            </div>
            <button
                arial-label="Close"
                className="popup__close-btn"
                type="button"
                onClick={onClose}
            ></button>
        </div>
    </div>);
}