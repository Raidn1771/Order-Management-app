import React, { useState } from 'react';
import { signup } from '../../Utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(formData);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={formData.fname}
            onChange={e => setFormData({ ...formData, fname: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lname}
            onChange={e => setFormData({ ...formData, lname: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmpassword}
            onChange={e =>
              setFormData({ ...formData, confirmpassword: e.target.value })
            }
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
