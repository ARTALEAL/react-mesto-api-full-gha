const Card = require('../models/card');

const InaccurateDataError = require('../errors/InaccurateDataError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

function receiveCards(req, res, next) {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
      if (card.owner.valueOf() !== _id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card
        .findByIdAndRemove(cardId)
        .then((deletedCard) => res.send(deletedCard))
        .catch(next);
    })
    .catch(next);
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: _id,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send(card);

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: _id,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send(card);

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  receiveCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
