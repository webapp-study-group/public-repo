let http = require('http')
let fs = require('fs')

let server = http.createServer(function (request, response) {
  console.log(request.url)
  let content
  if (request.url == '/') {
    content = fs.readFileSync('public/index.html')
  } else if (request.url == '/menu.html') {
    content = fs.readFileSync('public/menu.html')
  } else {
    content = 'unknown'
  }
  response.write(content)
  response.end()
})

let port = 3000

server.listen(port)

console.log('server is running...')
console.log('http://192.168.80.85:' + port)
