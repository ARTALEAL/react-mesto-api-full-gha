import { Link } from 'react-router-dom';
import useForm from '../hooks/useForm';

function Register({ onRegister }) {
  const { enteredValues, errors, handleChange } = useForm({});
  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(enteredValues);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="form auth__form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          autoComplete="email"
          value={enteredValues.email || ''}
          onChange={handleChange}
          required
        />
        <span className="auth__error">{errors.email}</span>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Пароль"
          autoComplete="password"
          value={enteredValues.password || ''}
          onChange={handleChange}
          required
        />
        <span className="auth__error">{errors.password}</span>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <Link to="/sign-in" className="auth__login-hint">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}

export default Register;
