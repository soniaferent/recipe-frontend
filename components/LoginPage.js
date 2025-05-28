import React, { useState } from "react";
import config from '../config';

export default function LoginPage({ setPage, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${config.API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("token", data.token); 
      setToken(data.token);                      
      setPage("home");                         
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="page-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="add-recipe-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
