# To-Do CLI

A simple Node.js command-line to-do list app that saves tasks to a JSON file.

## Features
- Add, list, complete, and delete tasks
- Tasks are listed alphabetically
- Alternating colors for better readability
- Data is persisted in `tasks.json`

## Usage

```
node todo.js <command> [args]
```

### Commands
- `list` — List all tasks
- `add <task>` — Add a new task
- `complete <number>` — Mark a task as complete
- `delete <number>` — Delete a task
- `help` — Show help message

## Example
```
node todo.js add "Buy milk"
node todo.js list
node todo.js complete 1
node todo.js delete 1
```

## Requirements
- Node.js (v12 or higher)

## License
MIT
