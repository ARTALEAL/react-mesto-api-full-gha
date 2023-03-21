import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';
import useForm from '../hooks/useForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, onLoading }) {
  const avatarRef = useRef();

  const { errors, handleChange, isFormValid } = useForm();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      className="popup_avatar"
      isOpen={isOpen}
      title="Обновить аватар"
      onClose={onClose}
      name="edit-avatar"
      buttontext={onLoading ? 'Сохранение...' : 'Сохранить'}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
    >
      <input
        type="url"
        className="popup__input"
        name="avatar"
        id="input-popup-avatar"
        placeholder="Ссылка на аватар"
        required
        ref={avatarRef}
        onChange={handleChange}
      />
      <span className="input-popup-avatar-error popup__error-message">
        {errors.avatar}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
