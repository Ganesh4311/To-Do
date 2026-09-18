import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

const readSavedTasks = () => {
  const savedTasks = localStorage.getItem('tasks')

  if (!savedTasks) {
    return []
  }

  try {
    const parsedTasks = JSON.parse(savedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch (error) {
    console.error('Unable to load saved tasks.', error)
    return []
  }
}

const App = () => {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState(readSavedTasks)
  const [filter, setFilter] = useState(FILTERS.ALL)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === FILTERS.ACTIVE) {
      return tasks.filter((task) => !task.isCompleted)
    }

    if (filter === FILTERS.COMPLETED) {
      return tasks.filter((task) => task.isCompleted)
    }

    return tasks
  }, [filter, tasks])

  const remainingTaskCount = tasks.filter((task) => !task.isCompleted).length
  const completedTaskCount = tasks.length - remainingTaskCount
  const areAllTasksCompleted = tasks.length > 0 && remainingTaskCount === 0

  const addTask = (event) => {
    event.preventDefault()
    const text = taskInput.trim()

    if (!text) {
      return
    }

    setTasks((currentTasks) => [...currentTasks, { text, isCompleted: false }])
    setTaskInput('')
  }

  const toggleTaskComplete = (index) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )
  }

  const deleteTask = (index) => {
    setTasks((currentTasks) => currentTasks.filter((_, taskIndex) => taskIndex !== index))
  }

  const editTask = (index) => {
    const currentTask = tasks[index]
    const editedText = prompt('Edit task:', currentTask.text)

    if (editedText === null) {
      return
    }

    const text = editedText.trim()
    if (!text) {
      return
    }

    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, text } : task
      )
    )
  }

  const clearCompletedTasks = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.isCompleted))
  }

  return (
    <div className="App">
      <div className="main-container">
        <h1>To Do List</h1>

        <form className="input-container" onSubmit={addTask}>
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Enter a task"
            aria-label="New task"
          />
          <button className="add_btn" type="submit" disabled={!taskInput.trim()}>
            Add Task
          </button>
        </form>

        <div className="task-summary" aria-live="polite">
          {remainingTaskCount} {remainingTaskCount === 1 ? 'task' : 'tasks'} remaining
          {completedTaskCount > 0 && ` · ${completedTaskCount} completed`}
        </div>

        <div className="filter-controls" aria-label="Filter tasks">
          {Object.entries(FILTERS).map(([label, value]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {label.charAt(0) + label.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <ul>
          {filteredTasks.map((task) => {
            const taskIndex = tasks.indexOf(task)

            return (
              <li key={`${task.text}-${taskIndex}`}>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleTaskComplete(taskIndex)}
                  aria-label={`Mark "${task.text}" as complete`}
                />
                <span className={task.isCompleted ? 'completed-task' : ''}>{task.text}</span>
                <div className="task-btns">
                  <button className="edit-btn" type="button" onClick={() => editTask(taskIndex)}>
                    Edit
                  </button>
                  <button className="delete-btn" type="button" onClick={() => deleteTask(taskIndex)}>
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="empty-state">
            {tasks.length === 0 ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
          </p>
        )}

        <button type="button" onClick={clearCompletedTasks} disabled={completedTaskCount === 0}>
          Clear Completed Tasks
        </button>
        <button type="button" onClick={() => setTasks([])} disabled={tasks.length === 0}>
          Clear All Tasks
        </button>
        <button
          className="taskcompleted"
          type="button"
          onClick={() => alert('All Tasks Completed!')}
          disabled={!areAllTasksCompleted}
        >
          All Tasks Completed
        </button>
      </div>
    </div>
  )
}

export default App
