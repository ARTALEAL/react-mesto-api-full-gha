import React from 'react';
import PopupWithForm from './PopupWithForm';
import useForm from '../hooks/useForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace, onLoading }) {
  const { enteredValues, errors, handleChange, isFormValid, resetForm } =
    useForm();

  function handleSubmit(e) {
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddPlace({
      name: enteredValues.name,
      link: enteredValues.url,
    });
  }

  React.useEffect(() => {
    resetForm();
  }, [resetForm, isOpen]);

  return (
    <PopupWithForm
      className="add-card"
      isOpen={isOpen}
      title="Новое место"
      onClose={onClose}
      name="add-card"
      buttontext={onLoading ? 'Сохранение...' : 'Создать'}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
    >
      <input
        type="text"
        name="name"
        className="popup__input popup__input_place_name"
        placeholder="Название"
        id="card-name"
        minLength="2"
        maxLength="30"
        required
        onChange={handleChange}
        value={enteredValues.name || ''}
      />
      <span className="popup__error-message card-name-error">
        {errors.name}
      </span>
      <input
        type="url"
        name="url"
        className="popup__input popup__input_image_url"
        placeholder="Ссылка на картинку"
        id="url"
        required
        onChange={handleChange}
        value={enteredValues.url || ''}
      />
      <span className="popup__error-message link-error">{errors.url}</span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
