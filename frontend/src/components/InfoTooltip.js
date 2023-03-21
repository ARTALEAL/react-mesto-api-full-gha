import successIcon from '../images/Success-icon.svg';
import faultIcon from '../images/fault-icon.svg';

const InfoTooltip = ({ isOpen, onClose, isSuccess }) => {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
        <img
          src={isSuccess ? successIcon : faultIcon}
          alt={
            isSuccess ? 'Регистрация прошла успешно' : 'Регистрация не прошла'
          }
          className="popup__signup-icon"
        />
        <h3 className="popup__signup-title">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h3>
      </div>
    </div>
  );
};

export default InfoTooltip;
