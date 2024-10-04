# Silently osing commits with SQLite

A simple bit flip in the WAL can silently lose committed entries.


> ***SQLite assumes that the detection and/or correction of bit errors** caused by cosmic rays, thermal noise, quantum fluctuations, device driver bugs, or other mechanisms, **is the responsibility of the underlying hardware and operating system**. SQLite does not add any redundancy to the database file for the purpose of detecting corruption or I/O errors. **SQLite assumes that the data it reads is exactly the same data that it previously wrote.***

[*https://sqlite.org/atomiccommit.html*](https://sqlite.org/atomiccommit.html)

No errors.

**NOT GOOD!**

### See the expected case:

```
npm run write
npm run read
```

Output (committed entries in the WAL):

```
All rows in the users table:
[
  { id: 1, name: 'User 1', email: 'user1@example.com' },
  { id: 2, name: 'User 2', email: 'user2@example.com' },
  { id: 3, name: 'User 3', email: 'user3@example.com' },
  { id: 4, name: 'User 4', email: 'user4@example.com' },
  { id: 5, name: 'User 5', email: 'user5@example.com' },
  { id: 6, name: 'User 6', email: 'user6@example.com' },
  { id: 7, name: 'User 7', email: 'user7@example.com' },
  { id: 8, name: 'User 8', email: 'user8@example.com' },
  { id: 9, name: 'User 9', email: 'user9@example.com' },
  { id: 10, name: 'User 10', email: 'user10@example.com' }
]
```

### Clean and flip a single bit in the WAL:

```
rm sqlite.*
npm run write
npm run break
npm run read
```

Output (will change based on random bit flipped):

```
All rows in the users table:
[ { id: 1, name: 'User 1', email: 'user1@example.com' } ]
```

Sometimes you might get more rows:

```
All rows in the users table:
[
  { id: 1, name: 'User 1', email: 'user1@example.com' },
  { id: 2, name: 'User 2', email: 'user2@example.com' },
  { id: 3, name: 'User 3', email: 'user3@example.com' },
  { id: 4, name: 'User 4', email: 'user4@example.com' },
  { id: 5, name: 'User 5', email: 'user5@example.com' },
  { id: 6, name: 'User 6', email: 'user6@example.com' },
  { id: 7, name: 'User 7', email: 'user7@example.com' },
  { id: 8, name: 'User 8', email: 'user8@example.com' }
]
```

As you can see, a single bit flip against _committed entries_ will lose data. This is because when a corrupted entry is found in the log, SQLite truncates it, despite the existence of successfully committed entries later in the log.
