import sqlite from "sqlite3"
import { open } from "sqlite"

sqlite.verbose() // Enable error and warn logging

async function setupDatabase() {
  const db = await open({
    filename: "sqlite.db",
    driver: sqlite.Database,
  })


  // Enable WAL mode
  await db.run('PRAGMA journal_mode = WAL;')

  // Read back all rows
  await readAllRows(db)

  // Crash the process immediately (so we don't checkpoint the WAL)
  process.exit(1)
}

async function readAllRows(db: any) {
  const rows = await db.all('SELECT * FROM users')
  console.log('All rows in the users table:')
  console.log(rows)
}

setupDatabase().catch(console.error)
