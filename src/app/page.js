"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md p-8 bg-white rounded-xl shadow-md"
      >
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-900">
          Sign In
        </h1>
        <div className="mb-6 relative">
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black pr-12"
            placeholder="Enter your password"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="mb-6 flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium text-gray-700"
          >
            Remember Me
          </label>
        </div>
        <button
          type="submit"
          className="py-3 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out w-full flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
}
