#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function listTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
    }
    // Sort tasks alphabetically by text (case-insensitive)
    tasks.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));
    // ANSI color codes for alternating colors
    const colors = ['\x1b[37m', '\x1b[36m']; // white, cyan
    tasks.forEach((task, i) => {
        const color = colors[i % colors.length];
        console.log(color + `${i + 1}. [${task.done ? 'x' : ' '}] ${task.text}` + '\x1b[0m');
    });
}

function addTask(text) {
    const tasks = loadTasks();
    tasks.push({ text, done: false });
    saveTasks(tasks);
    console.log('Task added.');
}

function completeTask(index) {
    const tasks = loadTasks();
    if (index < 1 || index > tasks.length) {
        console.log('Invalid task number.');
        return;
    }
    tasks[index - 1].done = true;
    saveTasks(tasks);
    console.log('Task marked as complete.');
}

function deleteTask(index) {
    const tasks = loadTasks();
    if (index < 1 || index > tasks.length) {
        console.log('Invalid task number.');
        return;
    }
    tasks.splice(index - 1, 1);
    saveTasks(tasks);
    console.log('Task deleted.');
}

function printHelp() {
    console.log(`Usage: node todo.js <command> [args]\n`);
    console.log('Commands:');
    console.log('  list                List all tasks');
    console.log('  add <task>          Add a new task');
    console.log('  complete <number>   Mark a task as complete');
    console.log('  delete <number>     Delete a task');
    console.log('  help                Show this help message');
}

const [,, cmd, ...args] = process.argv;

switch (cmd) {
    case 'list':
        listTasks();
        break;
    case 'add':
        addTask(args.join(' '));
        break;
    case 'complete':
        completeTask(Number(args[0]));
        break;
    case 'delete':
        deleteTask(Number(args[0]));
        break;
    case 'help':
    default:
        printHelp();
        break;
}
