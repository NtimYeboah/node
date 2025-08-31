//1. node todo.js add Write script to run node todo app
//2. node todo.js add Investigate how to run a node script in Linux crontab
//3. node todo.js list - List will list tasks in the todo column and tasks in the done column
    // 1. Write script to run node todo app
    // 2. Investigate how to run a node script in Linux crontab
//4. node todo.js done 1 or Write script to run node todo app
//5. node todo.js list-done
    //1. Write script to run node todo app


import { argv } from 'node:process'
import { appendFile, readFile, writeFile } from 'node:fs/promises'

const scriptCommand = argv[2]
const task = argv[3]

const commands = ["add", "display", "wip", "done"]

if (!commands.includes(scriptCommand)) {
    throw new Error(`Command not recognizable: ${scriptCommand}`)
}

// Add task
async function addTask(filePath, content) {
    await appendFile(filePath, `${content}\n`)
}

// Read task
async function readTasks(filePath) {
    const contents = await readFile(filePath, 'utf-8')
    return contents
}

// Replace content
async function replaceContent(filePath, content) {
    await writeFile(filePath, content)
}

if (scriptCommand === "add") {
    addTask('todo.txt', task);
}

if (scriptCommand === "wip") {
    const content = await readTasks('todo.txt')
    const todoTasks = content.split("\n")

    if (todoTasks.includes(task)) {
        addTask('wip.txt', `${task}\n`)

        const wipTaskIndex = todoTasks.indexOf(task)

        if (wipTaskIndex > -1) {
            todoTasks.splice(wipTaskIndex, 1)
        }

        const todoTaskString = todoTasks.join("\n")

        replaceContent('todo.txt', todoTaskString)
    }
}

if (scriptCommand === "done") {
    const content = await readTasks('wip.txt')
    const wipTasks = content.split("\n")

    if (wipTasks.includes(task)) {
        addTask('done.txt', `${task}\n`)

        const doneTaskIndex = wipTasks.indexOf(task)

        if (doneTaskIndex > -1) {
            wipTasks.splice(doneTaskIndex, 1)
        }

        const wipTasksString = wipTasks.join("\n")

        replaceContent('wip.txt', wipTasksString)
    }
}


if (scriptCommand === "display") {
    const undoneTasks = await readTasks('todo.txt')
    const wipTasks = await readTasks('wip.txt')
    const doneTasks = await readTasks('done.txt')

    const todos = {
        'Todo': undoneTasks.split("\n"),
        'Work In Progress': wipTasks.split("\n"),
        'Done': doneTasks.split("\n")
    }

    console.table(todos)
}