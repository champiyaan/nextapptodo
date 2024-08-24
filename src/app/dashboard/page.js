"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  const router = useRouter();

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todos");
        if (res.ok) {
          const data = await res.json();
          setTodos(data);
        } else {
          console.error("Failed to fetch todos");
        }
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, []);

  // Handle adding a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
          due_date: dueDate,
          priority,
          user_id: 1, // Replace with actual user ID from your auth system
        }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setTask("");
        setDueDate("");
        setPriority("Medium");
        setError("");
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      setError("An error occurred");
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete todo");
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("An error occurred");
    }
  };

  // Handle editing a todo
  const handleEditTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: editTask,
          due_date: editDueDate,
          priority: editPriority,
        }),
      });

      if (res.ok) {
        const updatedTodo = await res.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        setEditTodoId(null);
        setEditTask("");
        setEditDueDate("");
        setEditPriority("Medium");
        setError("");
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("An error occurred");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-8">
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          Add a New ToDo
        </h1>
        <form onSubmit={handleAddTodo} className="space-y-6">
          <div>
            <label
              htmlFor="task"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Task:
            </label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter task"
            />
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Due Date:
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Priority:
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
          >
            Add ToDo
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>

      {/* Todos List Section */}
      <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-lg border-t md:border-l md:border-t-0">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          ToDos List
        </h1>
        <ul className="space-y-6">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
            >
              {editTodoId === todo.id ? (
                <div>
                  <div>
                    <label
                      htmlFor="editTask"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Task:
                    </label>
                    <input
                      id="editTask"
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black mb-4"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editDueDate"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Due Date:
                    </label>
                    <input
                      id="editDueDate"
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black mb-4"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editPriority"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Priority:
                    </label>
                    <select
                      id="editPriority"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black mb-4"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleEditTodo(todo.id)}
                    className="bg-black text-white p-2 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditTodoId(null)}
                    className="bg-gray-600 text-white p-2 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {todo.task}
                    </p>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(todo.due_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Priority: {todo.priority}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditTodoId(todo.id)}
                      className="bg-black text-white p-2 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="bg-black text-white p-2 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
