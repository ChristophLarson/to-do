const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');
const TODO_CMD = `node ${path.join(__dirname, 'todo.js')}`;

function resetTasksFile(content = '[]') {
  fs.writeFileSync(DATA_FILE, content);
}

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

function testAddEmptyTask() {
  resetTasksFile();
  run(`${TODO_CMD} add ""`);
  const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (tasks.length !== 1 || tasks[0].text !== "") {
    throw new Error('Failed to handle empty task text');
  }
  console.log('testAddEmptyTask passed');
}

function testCompleteInvalidIndex() {
  resetTasksFile('[{"text":"Task 1","done":false}]');
  const output = run(`${TODO_CMD} complete 5`);
  if (!output.includes('Invalid task number.')) {
    throw new Error('Failed to handle invalid complete index');
  }
  console.log('testCompleteInvalidIndex passed');
}

function testDeleteFromEmptyList() {
  resetTasksFile();
  const output = run(`${TODO_CMD} delete 1`);
  if (!output.includes('Invalid task number.')) {
    throw new Error('Failed to handle delete from empty list');
  }
  console.log('testDeleteFromEmptyList passed');
}

// Run tests
try {
  testAddEmptyTask();
  testCompleteInvalidIndex();
  testDeleteFromEmptyList();
  console.log('All edge-case tests passed.');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
