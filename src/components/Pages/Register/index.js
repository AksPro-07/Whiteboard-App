import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classes from './index.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Register</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={classes.input}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={classes.input}
        />
        <button type="submit" className={classes.button}>
          Register
        </button>
      </form>
      <p className={classes.link}>
        Already have an account?{' '}
        <Link to="/login" className={classes.linkText}>
          Login here
        </Link>
      </p>
      <footer className={classes.footer}>
        Developed by Akshit Meena
      </footer>
    </div>
  );
};

export default Register;
