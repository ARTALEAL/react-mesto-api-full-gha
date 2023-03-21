function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_${props.name} 
      ${props.isOpen ? 'popup_opened' : ''}`}
    >
      <div className="popup__container">
        <h2 className="popup__title">{props.title}</h2>
        <form
          method="post"
          className="popup__form"
          name={`${props.name}`}
          onSubmit={props.onSubmit}
          noValidate
        >
          {props.children}
          <button
            className={
              props.isFormValid
                ? 'button popup__submit-button'
                : 'button popup__submit-button popup__submit-button_disabled'
            }
            type="submit"
            disabled={props.isFormValid ? false : true}
          >
            {props.buttontext}
          </button>
        </form>

        <button
          onClick={props.onClose}
          className="button popup__close-button"
          type="button"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default PopupWithForm;
