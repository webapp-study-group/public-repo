import { Link, Redirect } from '../components/router.js'
import { o } from '../jsx/jsx.js'
import { prerender } from '../jsx/html.js'
import Comment from '../components/comment.js'
import SourceCode from '../components/source-code.js'
import Style from '../components/style.js'
import { Script, iife } from '../components/script.js'
import { Raw } from '../components/raw.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { object, string } from 'cast.ts'
import { Task, proxy } from '../../../db/proxy.js'
import { mapArray } from '../components/fragment.js'
import { EarlyTerminate } from '../helpers.js'
import { nodeToVNode } from '../jsx/vnode.js'

// Calling <Component/> will transform the JSX into AST for each rendering.
// You can reuse a pre-compute AST like `let component = <Component/>`.

// If the expression is static (not depending on the render Context),
// you don't have to wrap it by a function at all.

let style = Style(/* css */ `
.new-task {
  padding: 1rem;
  font-size: 1rem;
}
.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.task-item [type="checkbox"] {
  width: 2rem;
  height: 2rem;
}
.task-item [type="text"] {
  padding: 1rem;
  font-size: 1rem;
}
`)

let script = Raw(
  /* html */
  `<script>

</script>
`,
)

let content = (
  <div id="task">
    {style}
    <h1>Task</h1>
    <h2>New Task</h2>
    <form onsubmit="emitForm(event)" method="POST" action="/task/submit">
      <input
        placeholder="What needs to be done?"
        class="new-task"
        name="title"
      />
    </form>
    <TaskList />
    {script}
    <SourceCode page="task.tsx" />
  </div>
)

function TaskList() {
  return (
    <div>
      <h2>Current Tasks</h2>
      <div id="taskList">{mapArray(proxy.task, task => TaskItem(task))}</div>
    </div>
  )
}

function TaskItem(task: Task) {
  return (
    <div data-task-id={task.id} class="task-item">
      <input
        type="checkbox"
        onchange={`emit('/task/${task.id}/toggle', this.checked)`}
        checked={task.is_done ? '' : undefined}
      />
      <input type="text" value={task.title} />
      {/* the delete button can be put in link or form */}
      <Link href={`/task/${task.id}/del`} rel="nofollow">
        <button>Del</button>
      </Link>
    </div>
  )
}

function SubmitNewTask(attrs: {}, context: Context) {
  let body = getContextFormBody(context)
  let input = object({
    title: string(),
  }).parse(body)
  let id = proxy.task.push({ title: input.title, is_done: false })
  let task = proxy.task[id]
  // return <div>Submit new task: {input.title}</div>
  if (context.type == 'ws') {
    context.ws.send([
      'batch',
      [
        ['set-value', '#task .new-task', ''],
        ['append', '#task #taskList', nodeToVNode(TaskItem(task), context)],
      ],
    ])
    throw EarlyTerminate
  }
  return <Redirect href="/task"></Redirect>
}

function DeleteTask(attrs: {}, context: DynamicContext) {
  let id = context.routerMatch?.params['id']
  delete proxy.task[id]
  if (context.type == 'ws') {
    context.ws.send(['remove', `[data-task-id="${id}"]`])
    throw EarlyTerminate
  }
  return <Redirect href="/task"></Redirect>
}

function ToggleTask(attrs: {}, context: DynamicContext) {
  let id = context.routerMatch?.params['id']
  let task = proxy.task[id]
  if (context.type == 'ws') {
    let checked = context.args?.[0]
    console.log('task', { task, checked })
    task.is_done = !!checked
    throw EarlyTerminate
  }
  return <Redirect href="/task"></Redirect>
}

let routes: Routes = {
  '/task': {
    title: title('Task'),
    description: 'One day one task, make a small step toward success',
    menuText: 'Tasks',
    node: content,
  },
  '/task/submit': {
    title: apiEndpointTitle,
    description: 'submit new task',
    node: <SubmitNewTask />,
  },
  '/task/:id/del': {
    title: apiEndpointTitle,
    description: 'delete task by id',
    node: <DeleteTask />,
  },
  '/task/:id/toggle': {
    title: apiEndpointTitle,
    description: 'check or uncheck task by id',
    node: <ToggleTask />,
  },
}

export default { routes }
