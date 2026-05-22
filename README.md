# prog2.tri2.ativ2 — To-Do List com SQLite

Aplicação web de lista de tarefas (To-Do List) que persiste os dados em um banco **SQLite** usando o runtime **Bun**.

---

## Como o código funciona

### Estrutura de arquivos

```
prog2.tri2.ativ2/
├── src/
│   └── core.ts        # Classe TodoList — acesso ao banco SQLite
├── public/
│   ├── index.html     # Interface web
│   ├── main.css       # Estilos
│   └── main.js        # Lógica do frontend (fetch para a API)
├── index.ts           # Servidor HTTP (Bun.serve)
├── package.json
└── tsconfig.json
```

### `src/core.ts` — Camada de dados

Define a classe `TodoList`, que encapsula todas as operações no banco SQLite.

O banco é aberto (ou criado) com `new Database("database.sqlite")` do módulo `bun:sqlite`.
A tabela `items` é criada automaticamente na primeira execução:

```sql
CREATE TABLE IF NOT EXISTS items (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL
)
```

#### Métodos implementados

| Método | Operação SQL | Descrição |
|--------|-------------|-----------|
| `getItems()` | `SELECT * FROM items` | Retorna todos os itens do banco |
| `addItem(title)` | `INSERT INTO items (title) VALUES (?)` | Insere um novo item e retorna o objeto com o `id` gerado |
| `deleteItem(id)` | `DELETE FROM items WHERE id = ?` | Remove o item pelo `id`; retorna `true` se deletou |
| `updateItem(id, title)` | `UPDATE items SET title = ? WHERE id = ?` | Atualiza o título; retorna `true` se alterou |

Todos os métodos usam **prepared statements** (`db.prepare(...)`) para evitar SQL injection e melhorar performance.

### `index.ts` — Servidor HTTP

Usa `Bun.serve` para criar um servidor na porta **3000** com as seguintes rotas REST:

| Método | Rota | Ação |
|--------|------|------|
| `GET` | `/items` | Lista todos os itens |
| `POST` | `/items` | Cria um novo item (body: `{ "title": "..." }`) |
| `DELETE` | `/items/:id` | Remove o item com o `id` informado |
| `PUT` | `/items/:id` | Atualiza o item (body: `{ "title": "..." }`) |

Rotas não reconhecidas fazem fallback para servir arquivos estáticos da pasta `/public`.

### `public/main.js` — Frontend

O frontend usa `fetch` para se comunicar com a API REST. As principais funções são:

- **`getItems()`** — busca todos os itens ao carregar a página
- **`addItem(title)`** — chamada ao clicar em "Add Task" ou pressionar Enter
- **`deleteItem(id)`** — chamada ao clicar no botão "Delete" de cada item
- **`updateItem(id, title)`** — chamada ao dar **duplo clique** no título do item

---

## Pré-requisitos

- [Bun](https://bun.sh) instalado (versão 1.0 ou superior)

```bash
# Instalar o Bun (Linux/macOS)
curl -fsSL https://bun.sh/install | bash
```

---

## Como rodar o projeto

```bash
# 1. Clone ou acesse a pasta do projeto
cd prog2.tri2.ativ2

# 2. Instale as dependências
bun install

# 3. Inicie o servidor
bun run index.ts
```

O servidor estará disponível em **http://localhost:3000**.

---

## Testando as rotas via terminal (curl)

### Listar todos os itens
```bash
curl http://localhost:3000/items
```

### Adicionar um item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar pão"}'
```

### Atualizar um item (substitua `1` pelo id real)
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar pão integral"}'
```

### Deletar um item (substitua `1` pelo id real)
```bash
curl -X DELETE http://localhost:3000/items/1
```

---

## Testando pela interface web

1. Acesse **http://localhost:3000** no navegador
2. Digite uma tarefa no campo de texto e clique em **Add Task** (ou pressione Enter)
3. Clique em **Delete** para remover uma tarefa
4. Dê **duplo clique** no título de uma tarefa para editar seu texto
