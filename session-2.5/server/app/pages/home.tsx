import { Link } from '../components/router.js'
import { o } from '../jsx/jsx.js'
import { prerender } from '../jsx/html.js'
import Comment from '../components/comment.js'
import SourceCode from '../components/source-code.js'
import Style from '../components/style.js'
import { Context } from '../context.js'
import { readFileSync, writeFileSync } from 'fs'
import { sessions } from '../session.js'

// Calling <Component/> will transform the JSX into AST for each rendering.
// You can reuse a pre-compute AST like `let component = <Component/>`.

// If the expression is static (not depending on the render Context),
// you don't have to wrap it by a function at all.

let style = Style(/* css */ `
body {
  text-align: center;
}
img {
  height: 250px;
}
div {
  font-size: 32px;
}
button {
  margin: 64px;
  font-size: 32px;
}
`)

let visitorCounts = 0

try {
  visitorCounts = +readFileSync('data/counter.txt').toString()
} catch (error) {
  // file not exist yet
  // console.log('failed to read counter.txt:', error)
}

function Counter(attrs: {}, context: Context) {
  // console.log('context.type:', context.type)
  if (context.type == 'express') {
    // visitorCounts = visitorCounts + 1
    visitorCounts++
    writeFileSync('data/counter.txt', visitorCounts.toString())
  }

  // sessions.forEach(function(session){
  // })

  sessions.forEach(session => {
    if (session.url == '/') {
      session.ws.send(['update-text', '#counter', visitorCounts])
    }
  })

  return (
    <div>
      number of visitors: <span id="counter">{visitorCounts}</span>
    </div>
  )
}

let content = (
  <div id="home">
    {style}
    <h1>Home Page</h1>
    <img src="/logo.webp" />
    <div>ABC Restaurant</div>
    <a href="menu.html">
      <button>Place Order</button>
    </a>
    <Counter />
  </div>
)

// And it can be pre-rendered into html as well
// let Home = prerender(content)
let Home = content

export default Home
