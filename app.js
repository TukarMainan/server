if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const router = require("./routes");
// const { errorHandler } = require("./middlewares");
const app = express();

app.use(cors());
app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})
// app.use(router);

// app.use(errorHandler);

module.exports = app;