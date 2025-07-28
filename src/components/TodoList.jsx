import React, { useState, useEffect } from 'react';

function getTodos() {
  try {
    return JSON.parse(localStorage.getItem('todos')) || [];
  } catch {
    return [];
  }
}

function TodoList() {
  const [todos, setTodos] = useState(getTodos);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = e => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([{ id: Date.now(), text: input, done: false }, ...todos]);
    setInput('');
  };
  const toggleDone = id => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const deleteTodo = id => {
    setTodos(todos.filter(t => t.id !== id));
  };
  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };
  const saveEdit = id => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">📝 ລາຍການທີ່ຕ້ອງເຮັດ</h2>
      <form className="mb-4" onSubmit={addTodo}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="ເພີ່ມວຽກໃໝ່..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="New todo item"
          />
          <button type="submit" className="btn btn-primary">ເພີ່ມ</button>
        </div>
      </form>
      <ul className="list-group list-group-flush">
        {todos.length === 0 && <li className="list-group-item text-center text-muted">ຍັງບໍ່ມີວຽກ.</li>}
        {todos.map(todo => (
          <li key={todo.id} className={`list-group-item d-flex justify-content-between align-items-center ${todo.done ? 'list-group-item-success' : ''}`}>
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
                id={`todo-${todo.id}`}
              />
              {editId === todo.id ? (
                <input
                  className="form-control form-control-sm"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)}
                  autoFocus
                />
              ) : (
                <label className={`form-check-label ${todo.done ? 'text-decoration-line-through' : ''}`} htmlFor={`todo-${todo.id}`} onDoubleClick={() => startEdit(todo.id, todo.text)}>
                  {todo.text}
                </label>
              )}
            </div>
            <div>
              {editId === todo.id ? (
                <>
                  <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(todo.id)}>ບັນທຶກ</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>ຍົກເລີກ</button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline-info me-2" onClick={() => startEdit(todo.id, todo.text)} title="Edit">✏️</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTodo(todo.id)} title="Delete">🗑️</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
