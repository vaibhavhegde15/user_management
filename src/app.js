const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
