import { TodoList } from "./src/core";

const todo = new TodoList();


function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function notFound(msg = "Not found"): Response {
  return json({ error: msg }, 404);
}

function badRequest(msg: string): Response {
  return json({ error: msg }, 400);
}


Bun.serve({
  port: 3000,

  async fetch(req) {
    const url  = new URL(req.url);
    const path = url.pathname;          
    const method = req.method;

    if (!path.startsWith("/items")) {
      const filePath = path === "/" ? "/index.html" : path;
      const file = Bun.file(`./public${filePath}`);
      if (await file.exists()) return new Response(file);
      return notFound("File not found");
    }

    if (method === "GET" && path === "/items") {
      return json(todo.getItems());
    }

    if (method === "POST" && path === "/items") {
      const body = await req.json().catch(() => null);
      if (!body?.title?.trim()) return badRequest("Campo 'title' é obrigatório");
      const item = todo.addItem(body.title.trim());
      return json(item, 201);
    }

    const deleteMatch = path.match(/^\/items\/(\d+)$/);
    if (method === "DELETE" && deleteMatch) {
      const id = Number(deleteMatch[1]);
      const ok = todo.deleteItem(id);
      return ok ? json({ message: "Item deletado" }) : notFound("Item não encontrado");
    }

    const updateMatch = path.match(/^\/items\/(\d+)$/);
    if (method === "PUT" && updateMatch) {
      const id   = Number(updateMatch[1]);
      const body = await req.json().catch(() => null);
      if (!body?.title?.trim()) return badRequest("Campo 'title' é obrigatório");
      const ok = todo.updateItem(id, body.title.trim());
      return ok ? json({ message: "Item atualizado" }) : notFound("Item não encontrado");
    }

    return notFound("Rota não encontrada");
  },
});

console.log("Servidor rodando em http://localhost:3000");
