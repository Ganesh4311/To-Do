import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'


const App = () => {

  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks]);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value)
  };


  const addTask = () => {
    if (taskInput) {
      setTasks([...tasks, {text: taskInput.trim(), isCompleted: false}]);
      setTaskInput('')
    }
  };

  const toggleTaskComplete = (index) => {
    const newTasks = [...tasks]
    newTasks[index].isCompleted = !newTasks[index].isCompleted
    setTasks(newTasks)
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks]
    newTasks.splice(index, 1)
    setTasks(newTasks)
  };  

  const editTask = (index) => { 
    const newTasks = [...tasks]
    const task = newTasks[index]
    const newTask = prompt('Edit task:', task.text)
    if (newTask) {
      task.text = newTask.trim()
      setTasks(newTasks)
    }
  };

  const areAllTasksCompleted = tasks.length > 0 && tasks.every(task => task.isCompleted);


  return (
    <div className="App">
      <div className="main-container">
      <h1>To Do List</h1>

      <div className='input-container'>
        <input type="text" 
        value={taskInput}
        onChange={handleInputChange}
        placeholder='Enter a task'
        />
        <button className='add_btn' onClick = {addTask} disabled={!taskInput.trim()}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input 
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => toggleTaskComplete(index)}
            />
            <span style={{textDecoration: task.isCompleted ? 'line-through' : 'none'}}>
              {task.text}
            </span>
            <button className="edit-btn" onClick={() => editTask(index)}>Edit</button>
            <button className="delete-btn" onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => setTasks(tasks.filter(task => !task.isCompleted))}>Clear Completed Tasks</button>
      <button onClick={() => setTasks([])}>Clear All Tasks</button>
      <button className="taskcompleted" onClick={() => alert("All Tasks Completed!")} disabled={!areAllTasksCompleted}>
        All Tasks Completed
      </button>

    </div>
    </div>
  )
}

export default App;
