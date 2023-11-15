let express = require('express')
let listeningOn = require('listening-on')

let app = express()

app.use(express.static('public'))

let counter = 0

app.get('/counter', function (req, res) {
  counter = counter + 1
  console.log('number of visitors: ' + counter)
  res.end('number of visitors: ' + counter)
})

let port = 3000

app.listen(port)

console.log('server is running...')
listeningOn.print(port)
