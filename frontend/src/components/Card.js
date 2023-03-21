import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some((i) => i === currentUser._id);
  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like-button ${
    isLiked && 'element__like-button_active'
  }`;

  function handleCardClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="element">
      {isOwn && (
        <button
          className="element__delete-button"
          onClick={handleDeleteClick}
          type="button"
        ></button>
      )}
      <img
        className="element__picture"
        src={card.link}
        alt={card.name}
        onClick={handleCardClick}
      />
      <div className="element__description">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-number">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <span className="element__like-container">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
