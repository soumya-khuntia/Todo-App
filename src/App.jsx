import React, { useState, useEffect } from 'react';
import './App.css'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'todos'; // Constant for local storage key

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showFinished, setShowFinished] = useState(true); // State to track checkbox
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State to track delete confirmation

  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const savetols = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { id: uuidv4(), text: inputValue, completed: false }]);
      setInputValue('');
      savetols();
    }
  };

  const handleRemoveTodo = (id) => {
    if (deleteConfirmation === id) {
      const newTodos = todos.filter(todo => todo.id !== id);
      setTodos(newTodos);
      setDeleteConfirmation(null);
      // Update local storage with the filtered todos
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    } else {
      setDeleteConfirmation(id);
    }
  };

  const handleEditTodo = (id) => {
    const index = todos.findIndex(todo => todo.id === id);
    setEditIndex(index);
    setEditValue(todos[index].text);
    savetols();
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleSaveEdit = (id) => {
    const newTodos = [...todos];
    const index = newTodos.findIndex(todo => todo.id === id);
    newTodos[index].text = editValue;
    setTodos(newTodos);
    setEditIndex(null);
    savetols();
  };

  const handleToggleComplete = (id) => {
    const newTodos = [...todos];
    const index = newTodos.findIndex(todo => todo.id === id);
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
    savetols();
  };

  const filteredTodos = showFinished ? todos : todos.filter(todo => !todo.completed);

  return (
    <div className="md:container mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2 shadow-lg" >
      <h1 className="text-2xl font-bold mb-4">Stask - Manage your todos</h1>
      <div className="flex mb-4">
        <input type="text" value={inputValue} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 mr-2 rounded-md flex-grow shadow-md" placeholder="Enter your todo..." />
        <button onClick={handleAddTodo} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md">Add</button>
      </div>
      <div className="mb-4">
        <input type="checkbox" checked={showFinished} onChange={() => setShowFinished(!showFinished)}  className="mr-2 cursor-pointer" />
        <label>Show Finished</label>
      </div>
      <ul>
        <h2 className="text-lg font-bold">Your todos</h2>
        {todos.length === 0 && <div className="mx-7">No todos...</div>}
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`flex items-center justify-between mb-2 ${todo.completed ? 'line-through' : ''}`}>
            <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} className="mr-3 cursor-pointer" />
            {editIndex === todos.indexOf(todo) ? (
              <input type="text" value={editValue} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-md mr-2"/>
            ) : (
              <div className="w-full overflow-hidden mr-1">
                <span className="break-all">{todo.text}</span>
              </div>
            )}
           <div className="flex">
              {editIndex === todos.indexOf(todo) ? (
                <button onClick={() => handleSaveEdit(todo.id)} className="px-3 py-1 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600">Save</button>
              ) : (
                <button onClick={() => handleEditTodo(todo.id)} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"><FaEdit /></button>
              )}
              {deleteConfirmation === todo.id ? (
                <>
                  <button onClick={() => handleRemoveTodo(todo.id)} className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"><MdCheck /></button>
                  <button onClick={() => setDeleteConfirmation(null)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"><MdClose /></button>
                </>
              ) : (
                <button onClick={() => handleRemoveTodo(todo.id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"><MdDelete /></button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
