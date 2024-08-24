"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FaSpinner } from "react-icons/fa";

// Toast component definition
const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

// Dashboard component
export default function Dashboard() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [deletingTodoId, setDeletingTodoId] = useState(null); // State for delete loading
  const [toastMessage, setToastMessage] = useState(""); // State for toast notifications

  const router = useRouter();

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
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

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
          user_id: 1,
        }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setTask("");
        setDueDate("");
        setPriority("Medium");
        setError("");
        setToastMessage("Todo added successfully");
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred");
        setToastMessage("Failed to add todo");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      setError("An error occurred");
      setToastMessage("An error occurred");
    }
  };

  const handleDeleteTodo = async (id) => {
    setDeletingTodoId(id); // Start delete loading

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        setDeletingTodoId(null); // End delete loading
        setToastMessage("Todo deleted successfully");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete todo");
        setDeletingTodoId(null); // End delete loading
        setToastMessage("Failed to delete todo");
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("An error occurred");
      setDeletingTodoId(null); // End delete loading
      setToastMessage("An error occurred");
    }
  };

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
        setToastMessage("Todo updated successfully");
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred");
        setToastMessage("Failed to update todo");
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("An error occurred");
      setToastMessage("An error occurred");
    }
  };

  const handleCloseToast = () => setToastMessage("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 btn-black">
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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
          </div>
        ) : (
          <TransitionGroup component="ul" className="space-y-6">
            {todos.map((todo) => (
              <CSSTransition key={todo.id} timeout={500} classNames="fade">
                <li className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 transition-transform transform hover:scale-105 relative">
                  {deletingTodoId === todo.id && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-200 opacity-75 rounded-lg">
                      <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
                    </div>
                  )}
                  <h2 className="text-xl font-medium text-gray-800 mb-2">
                    {todo.task}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Due: {new Date(todo.due_date).toLocaleDateString()} -{" "}
                    {todo.priority}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setEditTodoId(todo.id);
                        setEditTask(todo.task);
                        setEditDueDate(todo.due_date);
                        setEditPriority(todo.priority);
                      }}
                      className="py-2 px-4 btn-black hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deletingTodoId === todo.id}
                      className="py-2 px-4 btn-black hover:bg-red-700"
                    >
                      {deletingTodoId === todo.id ? (
                        <FaSpinner className="animate-spin text-white" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
        {editTodoId && (
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Edit ToDo
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTodo(editTodoId);
              }}
              className="space-y-4"
            >
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
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 btn-black">
                Update ToDo
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={handleCloseToast} />
      )}
    </div>
  );
}
