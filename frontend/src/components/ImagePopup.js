function ImagePopup({ isOpen, card, onClose }) {
  return (
    <div
      className={`popup popup_gallery ${isOpen ? `popup_opened` : ''}`}
      onClick={onClose}
    >
      <div className="popup__preview">
        <figure className="popup__figure">
          <img className="popup__image" src={card.link} alt={card.name} />
          <figcaption className="popup__figcaption">{card.name}</figcaption>
        </figure>
        <button className="button popup__close-button" type="button">
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default ImagePopup;
