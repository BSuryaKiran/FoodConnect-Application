import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('donor');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    organization: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (isRegistering) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (!formData.address) {
        newErrors.address = 'Address is required';
      }
      
      // Organization is required for donors
      if (userType === 'donor' && !formData.organization) {
        newErrors.organization = 'Organization/Restaurant name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isRegistering) {
        // Registration successful
        setSuccessMessage('Account registered successfully');
        setShowSuccessDialog(true);
        // Reset form after successful registration
        setFormData({
          email: '',
          password: '',
          name: '',
          phone: '',
          address: '',
          organization: ''
        });
        setIsRegistering(false);
      } else {
        // Sign in successful (accept any credentials)
        const userData = {
          type: userType,
          email: formData.email,
          name: formData.name || (userType === 'donor' ? 'Food Donor' : 'Food Seeker'),
          id: Date.now()
        };
        setSuccessMessage('Signed in successfully');
        setShowSuccessDialog(true);
        // After showing dialog, proceed to login
        setTimeout(() => {
          setShowSuccessDialog(false);
          onLogin(userData);
        }, 1500);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      organization: ''
    });
    setErrors({});
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="header-nav">
          <button 
            className="back-home-btn"
            onClick={() => window.location.href = '/food-management/'}
            type="button"
          >
            ← Back to Home
          </button>
        </div>
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <h1>FoodConnect</h1>
        </div>
        <p className="tagline">Reduce food wastage, improve food security</p>
      </header>

      <main className="login-main">
        <section className="login-card card fade-in">
          <h2 className="login-title">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="login-subtitle">{isRegistering ? 'Register to get started' : 'Sign in to continue'}</p>

          {/* User Type Selection */}
          <div className="user-type-selector">
            <button
              type="button"
              className={`type-btn ${userType === 'donor' ? 'active' : ''}`}
              onClick={() => {
                setUserType('donor');
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  phone: '',
                  address: '',
                  organization: ''
                });
                setErrors({});
              }}
            >
              <span className="type-icon">🍽️</span>
              <span>Food Donor</span>
            </button>
            <button
              type="button"
              className={`type-btn ${userType === 'seeker' ? 'active' : ''}`}
              onClick={() => {
                setUserType('seeker');
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  phone: '',
                  address: '',
                  organization: ''
                });
                setErrors({});
              }}
            >
              <span className="type-icon">🤝</span>
              <span>Food Seeker</span>
            </button>
          </div>

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {errors.general && (
              <div className="alert alert-error">
                {errors.general}
              </div>
            )}

            {/* Registration fields */}
            {isRegistering && (
              <>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  {errors.name && (
                    <span className="form-error">{errors.name}</span>
                  )}
                </div>

                {userType === 'donor' && (
                  <div className="form-group">
                    <label htmlFor="organization" className="form-label">
                      Organization/Restaurant Name
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      className="form-input"
                      placeholder="Enter organization or restaurant name"
                      value={formData.organization}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.organization && (
                      <span className="form-error">{errors.organization}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.phone && (
                    <span className="form-error">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-input form-textarea"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                  {errors.address && (
                    <span className="form-error">{errors.address}</span>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoFocus={!isRegistering}
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete={isRegistering ? "new-password" : "current-password"}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
            >
              {isLoading ? (isRegistering ? 'Creating Account...' : 'Signing in...') : (isRegistering ? 'Register' : 'Sign In')}
            </button>

            <button
              type="button"
              className="btn btn-outline toggle-btn"
              onClick={toggleMode}
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Don\'t have an account? Register'}
            </button>
          </form>

        </section>

        {/* Success Dialog */}
        {showSuccessDialog && (
          <div className="dialog-overlay" onClick={closeSuccessDialog}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <div className="success-icon">✅</div>
              <h3>{successMessage}</h3>
              <button className="btn btn-primary" onClick={closeSuccessDialog}>
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Login;
