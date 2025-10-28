import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)

  // Load todos from localStorage when app starts
  useEffect(() => {
    const todoString = localStorage.getItem("todos")
    if (todoString) {
      setTodos(JSON.parse(todoString))
    }
  }, [])

  // Auto-save todos whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  const handleEdit = (e, id) => {
    const t = todos.find(item => item.id === id)
    setTodo(t.todo)
    const newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos)
  }

  const handleDelete = (e, id) => {
    const newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos)
  }

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
      setTodo("")
    }
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => {
    const id = e.target.name
    const newTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    )
    setTodos(newTodos)
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-200 max-w-360 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-2xl'>iTask - Manage and just do it</h1>

        {/* Add Task Section */}
        <div className="add-todo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Task</h2>
          <input
            onChange={handleChange}
            value={todo}
            className='w-full bg-white rounded-lg px-5 py-1'
            type="text"
            placeholder="Enter your task..."
          />
          <button
            onClick={handleAdd}
            disabled={todo.length <= 3}
            className='bg-violet-800 hover:bg-violet-950 px-3 py-1 text-sm font-bold text-white rounded-md'>
            Add
          </button>
        </div>

        {/* Show Finished Toggle */}
        <div>
          <input
            className='my-4'
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
          /> Show Finished
        </div>

        {/* Task List */}
        <h2 className="font-bold text-lg">Your Tasks</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Tasks to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo my-3 flex justify-between">
                <div className='flex gap-5'>
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 px-3 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 px-3 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  )
}

export default App

