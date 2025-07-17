import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classes from './index.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔹 Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('whiteboard_user_token');
    if (token) {
      fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            navigate('/profile');
          }
        })
        .catch((err) => {
          console.error('Token validation error:', err);
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('whiteboard_user_token', data.token);
        navigate('/profile');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Login</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={classes.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={classes.input}
        />
        <button type="submit" className={classes.button}>
          Login
        </button>
      </form>
      <p className={classes.link}>
        Don't have an account?{' '}
        <Link to="/register" className={classes.linkText}>
          Register here
        </Link>
      </p>
      <footer className={classes.footer}>
        Developed by Akshit Meena
      </footer>
    </div>
  );
};

export default Login;
