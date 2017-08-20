const express = require('express');
const path = require('path')
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.env || 'development';
const VIEWS_PATH = path.join(__dirname, 'views');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const PY_SERVER_PATH_SEARCH = 'http://10.170.4.85:5000/search';
const PY_SERVER_PATH_PLOT = 'http://10.170.4.85:5000/plot';
const SEMANTIC_UI_PATH = path.join(__dirname, '..', 'semantic');

// Seed Data
let mockData = require('../seeds/mockResponse.json');
let testData = require('../seeds/testData.json');
let mock_vendor_no_arr_json = array_to_json(['Vendor 14', 'Vendor 7'])


app.set('port', PORT);
app.set('views', VIEWS_PATH);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

// For stylesheets & scripts files loading
app.use(express.static(DIST_PATH));
app.use(express.static(SEMANTIC_UI_PATH));

// Setting local variables
app.locals.hasLoaded = false;
app.locals.defaultLoaded = true;
app.locals.newOrder = null;
app.locals.hasLoadedIframe = false;
app.locals.vendorCompareIframe = false; 


// Pass Mock Data For Now
app.get('/', (req, res) => {
  res.render('index', {serverResult: null});
})

app.get('/uploadOrder', (req, res) => {
  // Later coming back from edware server
  serviceAnalyzeOrder((serverResult, newOrder) => {
    // Change application load state
    app.locals.defaultLoaded = false;
    app.locals.hasLoaded = true;

    // Default List
    if (!serverResult) {
      // Get the iframe work vendors comparison
      serviceGetIframe(mock_vendor_no_arr_json, (err, body) => {
        app.locals.hasLoadedIframe = true;
        res.render('index', {serverResult: mockData, newOrder: newOrder, vendorCompareIframe: body});
      });
    // Dynamic List
    } else {
      // Render page with new order and suggestion list of vendors
      // Get the iframe work vendors comparison
      let vendor_no_arr_json = getVendorIdArr(serverResult);
      vendor_no_arr_json = array_to_json(vendor_no_arr_json);
      console.log(`DEBUG`,vendor_no_arr_json)
      // mock_vendor_no_arr_json
      serviceGetIframe(vendor_no_arr_json, (err, body) => {
        app.locals.hasLoadedIframe = true; 
        res.render('index', {serverResult: serverResult, newOrder: newOrder, vendorCompareIframe: body});
      });
    }
  })
})

// get one random data from test data set to simulate new order
function getOneTestData() {
  return testData[Math.floor(Math.random() * testData.length)];
}


// POST /plot
// @params vendor_number_arr: [ Vendor_No ]
function serviceGetIframe(data, callback) {
  console.log(`CALL ${PY_SERVER_PATH_PLOT}`)
  let options = {
    method: 'post',
    body: data,
    json: true,
    url: PY_SERVER_PATH_PLOT
  }
  request(options, (err, res, body) => {
    console.log(`HAS CALLED AND GOT RESPONDED: ${body}`) 
    callback(err, body); 
  })
}


// /search/id
function serviceAnalyzeOrder(callback) {
  let newOrder = getOneTestData();
  let newOrderId = newOrder['Unique_No'];
  let pyServerPath = `${PY_SERVER_PATH_SEARCH}/${newOrderId}`;
  console.log(`NEW ORDER: ${newOrderId}`);
  console.log(`CALL: ${pyServerPath}`);

  // CALL SEARCH
  request(`${pyServerPath}`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log(`${body}`);

      // body is the data coming back from /search
      console.log(body)
      body = JSON.parse(body);
      callback(body, newOrder);
    } else {
      console.log(`error: ${error}`);
      callback(null, newOrder);
    }
  })
}

function getVendorIdArr(arr) {
  return arr.map(i => i.Vendor_No);
}

function array_to_json(arr) {
  return JSON.stringify(arr);
}

app.listen(PORT, function () {
  console.log(`Example app listening on port at ${PORT} in ${ENV}`);
})