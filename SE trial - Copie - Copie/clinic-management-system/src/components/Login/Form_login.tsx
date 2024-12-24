import React from "react";
import { useNavigate } from "react-router-dom";
import "./Form_login.css";

const Form_login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/medications/:family");
  };

  return (
    <div className="login-container">
      <div className="login-modal">
        <h1 className="textStyle">Welcome back to</h1>
        <h2 className="textStyle">Inventory Management System</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username" className="textStyle">Username</label>
          <input type="text" id="username" placeholder="Username" />
          <label htmlFor="password" className="textStyle">Password</label>
          <input type="password" id="password" placeholder="Password" />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Form_login;
