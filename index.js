var config = require('./config')
var http = require('http')
var fs = require('fs')
var request = require('request')
var Router = require('routes')
var router = Router()

function pickRandom (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function telegramSendMessage (user, message) {
  var url = config.telegram.apiUrl + config.telegram.botToken + '/sendMessage'
  var body = {
    chat_id: user,
    text: message
  }

  request.post({
    url: url,
    formData: body
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
      console.log('message "' + message + '" was sent to ' + user)
    } else {
      console.log(error)
    }
  })
}

function telegramSendPhoto (user, photo) {
  var url = config.telegram.apiUrl + config.telegram.botToken + '/sendPhoto'
  var body = {
    chat_id: user,
    photo: fs.createReadStream(__dirname + '/assets/' + photo)
  }

  request.post({
    url: url,
    formData: body
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
      console.log('photo was sent to ' + user)
    } else {
      console.log(error)
    }
  })
}

router.addRoute('/api/:token/dingDong', function (req, res, match) {
  if (match.params.token !== config.token) {
    res.end('wrong token, go away\n')
    return
  }

  telegramSendMessage(
    config.telegram.users.artur,
    pickRandom(config.answers)
  )

  telegramSendPhoto(
    config.telegram.users.artur,
    pickRandom(config.photos)
  )

  res.end('oh hello, somebody at the door\n')
})

var server = http.createServer(function (req, res) {
  var match = router.match(req.url)
  if (match) {
    match.fn(req, res, match)
  } else {
    res.statusCode = 404
    res.end('not found\n')
  }
})

server.listen(5000)
