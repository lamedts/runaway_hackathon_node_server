var postData = {
  name: 'test',
  value: 'test'
}

var url = 'https://www.example.com'
var options = {
  method: 'post',
  body: postData,
  json: true,
  url: url
}
request(options, function (err, res, body) {
  if (err) {
    console.error('error posting json: ', err)
    throw err
  }
  var headers = res.headers
  var statusCode = res.statusCode
  console.log('headers: ', headers)
  console.log('statusCode: ', statusCode)
  console.log('body: ', body)
})