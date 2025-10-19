import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/notices');
  }, [token, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', form);
      login(res.data.token, res.data.user);
      navigate('/notices');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="input-group">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="login-input"
              autoComplete="email"
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="login-input"
              autoComplete="current-password"
            />
            <label>Password</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
      <div className="login-footer">
        <p>Don't have an account? <a href="/register">Register now</a></p>
      </div>
    </div>
  );
};

export default Login;
