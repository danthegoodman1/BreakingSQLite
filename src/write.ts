import sqlite from "sqlite3"
import { open } from "sqlite"

async function setupDatabase() {
  const db = await open({
    filename: "sqlite.db",
    driver: sqlite.Database,
  })

  // Enable WAL mode
  await db.run('PRAGMA journal_mode = WAL;')

  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `)

  // insert 10 rows
  for (let i = 1; i <= 10; i++) {
    await db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [`User ${i}`, `user${i}@example.com`])
  }

  console.log("Table created and 10 rows inserted")

  // Crash the process immediately (so we don't checkpoint the WAL)
  process.exit(1)
}

setupDatabase().catch(console.error)
