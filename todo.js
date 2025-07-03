#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File where tasks are stored
const DATA_FILE = path.join(__dirname, 'tasks.json');

// ANSI color codes for alternating list colors
const COLOR_WHITE = '\x1b[37m';
const COLOR_CYAN = '\x1b[36m';
const COLOR_RESET = '\x1b[0m';
const LIST_COLORS = [COLOR_WHITE, COLOR_CYAN];

/**
 * Load tasks from the JSON file.
 * @returns {Array<{text: string, done: boolean}>}
 */
function loadTasks() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

/**
 * Save tasks to the JSON file.
 * @param {Array<{text: string, done: boolean}>} tasks
 */
function saveTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

/**
 * List all tasks, sorted alphabetically, with alternating colors.
 */
function listTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
    }
    tasks.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));
    tasks.forEach((task, i) => {
        const color = LIST_COLORS[i % LIST_COLORS.length];
        console.log(color + `${i + 1}. [${task.done ? 'x' : ' '}] ${task.text}` + COLOR_RESET);
    });
}

/**
 * Add a new task.
 * @param {string} text
 */
function addTask(text) {
    if (!text.trim()) {
        console.log('Cannot add an empty task.');
        return;
    }
    const tasks = loadTasks();
    tasks.push({ text, done: false });
    saveTasks(tasks);
    console.log('Task added.');
}

/**
 * Mark a task as complete by its index (1-based).
 * @param {number} index
 */
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

/**
 * Delete a task by its index (1-based).
 * @param {number} index
 */
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

/**
 * Print help message.
 */
function printHelp() {
    console.log(`Usage: node todo.js <command> [args]\n`);
    console.log('Commands:');
    console.log('  list                List all tasks');
    console.log('  add <task>          Add a new task');
    console.log('  complete <number>   Mark a task as complete');
    console.log('  delete <number>     Delete a task');
    console.log('  help                Show this help message');
}

// --- Main CLI logic ---
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
