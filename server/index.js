const express = require('express');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.env || 'development';
const VIEWS_PATH = path.join(__dirname, 'views');
const DIST_PATH = path.join(__dirname, '..', 'dist');

app.set('port', PORT);
app.set('views', VIEWS_PATH);
app.set('view engine', 'ejs');


// For stylesheets & scripts files loading
app.use(express.static(DIST_PATH));

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(PORT, function () {
  console.log(`Example app listening on port at ${PORT} in ${ENV}`);
})