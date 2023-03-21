import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';
import useForm from '../hooks/useForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, onLoading }) {
  const currentUser = useContext(CurrentUserContext);

  const { enteredValues, errors, handleChange, isFormValid, resetForm } =
    useForm();

  function handleSubmit(e) {
    e.preventDefault();
    // // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: enteredValues.name,
      about: enteredValues.about,
    });
  }

  React.useEffect(() => {
    currentUser ? resetForm(currentUser) : resetForm();
  }, [resetForm, isOpen, currentUser]);

  return (
    <PopupWithForm
      className="profile-edit"
      isOpen={isOpen}
      title="Редактировать профиль"
      onClose={onClose}
      name="profile"
      buttontext={onLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      happy
    >
      <input
        type="text"
        name="name"
        className="popup__input popup__input_data_name"
        placeholder="Имя"
        id="input-popup-title"
        value={enteredValues.name || ''}
        minLength="2"
        maxLength="40"
        required
        onChange={handleChange}
      />
      <span className="popup__error-message input-popup-title-error">
        {errors.name}
      </span>
      <input
        type="text"
        name="about"
        className="popup__input popup__input_data_job"
        placeholder="Вид деятельности"
        id="input-popup-subtitle"
        value={enteredValues.about || ''}
        minLength="2"
        maxLength="200"
        required
        onChange={handleChange}
      />
      <span className="popup__error-message input-popup-subtitle-error">
        {errors.about}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
