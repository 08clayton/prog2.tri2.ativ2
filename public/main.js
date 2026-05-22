// Seleciona elementos do DOM
const app = document.querySelector('#app')
const input = app.querySelector('#task-input')
const addButton = app.querySelector('#add-button')
const list = app.querySelector('#list')
const itemTemplate = list.querySelector('template')

const API = '/items'


async function getItems() {
  const res = await fetch(API)
  return res.json()
}

async function addItem(title) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  return res.json()
}

async function deleteItem(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' })
}

async function updateItem(id, title) {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
}


function createDomTask({ id, title }) {
  const task = itemTemplate.content.cloneNode(true)
  const li = task.querySelector('li')

  li.dataset.id = id
  li.querySelector('.title').textContent = title

  li.querySelector('.bt-delete').addEventListener('click', async () => {
    await deleteItem(id)
    li.remove()
  })

  li.querySelector('.title').addEventListener('dblclick', async (e) => {
    const span = e.target
    const newTitle = prompt('Novo título:', span.textContent)
    if (!newTitle || newTitle.trim() === span.textContent) return
    await updateItem(id, newTitle.trim())
    span.textContent = newTitle.trim()
  })

  return task
}

async function createNewTask() {
  const title = input.value.trim()
  if (!title) return

  const item = await addItem(title)
  list.appendChild(createDomTask(item))
  input.value = ''
}

addButton.addEventListener('click', createNewTask)

input.addEventListener('keypress', (e) =>
  e.key === 'Enter' ? createNewTask() : null
)

getItems().then(items =>
  items.forEach(item => list.appendChild(createDomTask(item)))
)
