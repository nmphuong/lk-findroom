const express = require('express')
// const dbinit = require('./src/includes/dbInit')
const app = express()
const port = 8080

const generalRouter = require('./src/routers/index')

// cấu hình bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// kết nối mongoose (database)
const connectDB = require('./src/config/config')
connectDB();

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
      res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
      return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => res.send('Hello World!'))
app.use(generalRouter)
app.listen(port, () => console.log(`Server listing port: ${port}`))