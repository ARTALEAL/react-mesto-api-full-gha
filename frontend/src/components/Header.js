import { Link, Route, Routes } from 'react-router-dom';
function Header({ loggedIn, userEmail, onSignOut }) {
  return (
    <header className="header">
      <div className="header__logo"></div>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <Link to="/sign-up" className="header__link">
              Регистрация
            </Link>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Link to="/sign-in" className="header__link">
              Войти
            </Link>
          }
        />
        <Route
          path="/"
          element={
            <nav className="header__nav">
              <span>{userEmail}</span>
              <button className="header__sign-out" onClick={() => onSignOut()}>
                Выйти
              </button>
            </nav>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
