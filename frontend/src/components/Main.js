import React, { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);
  const { name, about, avatar } = currentUser;

  return (
    <main className="main">
      <section className="profile">
        <img className="profile__image" src={avatar} alt="Фотография профиля" />
        <button
          className="profile__avatar-btn"
          onClick={props.onEditAvatar}
        ></button>
        <div className="profile__info-container">
          <div className="profile__info">
            <h1 className="profile__name">{name}</h1>
            <button
              className="button profile__button-edit"
              type="button"
              aria-label="редактирование профиля"
              onClick={props.onEditProfile}
            ></button>
            <p className="profile__description">{about}</p>
          </div>
          <button
            className="button profile__button-add"
            type="button"
            aria-label="добавить"
            onClick={props.onAddPlace}
          ></button>
        </div>
      </section>
      <section className="elements" aria-label="Секция с карточками">
        {props.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
