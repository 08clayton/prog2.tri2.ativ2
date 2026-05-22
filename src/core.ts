import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

const querySelectItems = db.prepare("SELECT * FROM items");
const queryInsertItem = db.prepare("INSERT INTO items (title) VALUES (?)");
const queryDeleteItem = db.prepare("DELETE FROM items WHERE id = ?");
const queryUpdateItem = db.prepare("UPDATE items SET title = ? WHERE id = ?");

export interface Item {
    id: number;
    title: string;
}

export class TodoList {

    getItems(): Item[] {
        return querySelectItems.all() as Item[];
    }

    addItem(title: string): Item {
        const result = queryInsertItem.run(title);
        return { id: result.lastInsertRowid as number, title };
    }

    deleteItem(id: number): boolean {
        const result = queryDeleteItem.run(id);
        return result.changes > 0;
    }

    updateItem(id: number, title: string): boolean {
        const result = queryUpdateItem.run(title, id);
        return result.changes > 0;
    }
}
