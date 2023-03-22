require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const limiter = require('./middlewares/rateLimiter');

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);
app.use(limiter);
// Подключение логгера
app.use(requestLogger);
// Регистрация
app.post('/signup', routeUsers);
app.post('/signin', routeUsers);

app.use(auth);
// Авторизированные пользователи
app.use('/users', routeUsers);
app.use('/cards', routeCards);

// логгер ошибок
app.use(errorLogger);

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
