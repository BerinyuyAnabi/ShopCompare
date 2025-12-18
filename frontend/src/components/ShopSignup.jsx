import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/shopSignup.css";

const ShopSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    owner_first_name: '',
    owner_last_name: '',
    position: '',
    shop_name: '',
    employees: '',
    address: '',
    country: '',
    phone: '',
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailValid, setEmailValid] = useState(null);
  const [confirmEmailValid, setConfirmEmailValid] = useState(null);

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    if (password.length < 6) {
      setPasswordStrength('weak');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) setPasswordStrength('weak');
    else if (strength === 2) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const validateEmail = (email) => {
    if (!email) {
      setEmailValid(null);
      return;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(isValid);
  };

  const validateConfirmEmail = (confirmEmail) => {
    if (!confirmEmail) {
      setConfirmEmailValid(null);
      return;
    }
    const matches = confirmEmail === formData.email;
    setConfirmEmailValid(matches);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation
    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'confirm_email') {
      validateConfirmEmail(value);
    }
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.owner_first_name.trim()) {
      newErrors.owner_first_name = 'First name is required';
    }

    if (!formData.owner_last_name.trim()) {
      newErrors.owner_last_name = 'Last name is required';
    }

    if (!formData.shop_name.trim()) {
      newErrors.shop_name = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.email !== formData.confirm_email) {
      newErrors.confirm_email = 'Email addresses do not match';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_type: 'shop_owner',
          shop_name: formData.shop_name,
          owner_first_name: formData.owner_first_name,
          owner_last_name: formData.owner_last_name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          address: formData.address,
          country: formData.country
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check your backend configuration.');
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // Handle successful signup
        console.log('Shop signup successful:', data);
        // Show success message and redirect to login
        alert('Shop registration successful! Please login with your credentials.');
        // Redirect shop owner to login page
        navigate('/login');
      } else {
        // Handle server errors
        setErrors({ submit: data.message || 'Shop registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again later.' });
      console.error('Shop signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-signup-container">
      <form className="customer-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/')}
        >
          ← Go Back
        </button>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <div className="general-information">
          <h2>General Information</h2>

          <label htmlFor="title">Title</label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="mr">Mr</option>
            <option value="mrs">Mrs</option>
            <option value="ms">Ms</option>
          </select>

          <label htmlFor="owner_first_name">First Name</label>
          <input
            type="text"
            id="owner_first_name"
            name="owner_first_name"
            value={formData.owner_first_name}
            onChange={handleChange}
            className={errors.owner_first_name ? 'error' : ''}
            required
          />
          {errors.owner_first_name && (
            <span className="error-message">{errors.owner_first_name}</span>
          )}

          <label htmlFor="owner_last_name">Last Name</label>
          <input
            type="text"
            id="owner_last_name"
            name="owner_last_name"
            value={formData.owner_last_name}
            onChange={handleChange}
            className={errors.owner_last_name ? 'error' : ''}
            required
          />
          {errors.owner_last_name && (
            <span className="error-message">{errors.owner_last_name}</span>
          )}

          <label htmlFor="position">Position</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="owner">Owner</option>
            <option value="sales">Sales Person</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="shop_name">Company Name</label>
          <input
            type="text"
            id="shop_name"
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            className={errors.shop_name ? 'error' : ''}
            required
          />
          {errors.shop_name && (
            <span className="error-message">{errors.shop_name}</span>
          )}

          <label htmlFor="employees">Number of Employees</label>
          <select
            id="employees"
            name="employees"
            value={formData.employees}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="1-2">1-2</option>
            <option value="3-5">3-5</option>
            <option value="6-10">6-10</option>
            <option value="10+">10 or more</option>
          </select>
        </div>

        <div className="contact-details">
          <h2>Contact Details</h2>

          <label htmlFor="address">Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <label htmlFor="country">Area in Ghana</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="Greater Accra">Greater Accra</option>
            <option value="Ashanti">Ashanti</option>
            <option value="Central">Central</option>
            <option value="Eastern">Eastern</option>
            <option value="Western">Western</option>
            <option value="Volta">Volta</option>
            <option value="Northern">Northern</option>
          </select>

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : emailValid === false ? 'error' : emailValid === true ? 'success' : ''}
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          {!errors.email && emailValid === false && formData.email && (
            <span className="error-message">Please enter a valid email address</span>
          )}
          {!errors.email && emailValid === true && (
            <span className="success-message">✓ Valid email address</span>
          )}

          <label htmlFor="confirm_email">Confirm Email Address</label>
          <input
            type="email"
            id="confirm_email"
            name="confirm_email"
            value={formData.confirm_email}
            onChange={handleChange}
            className={errors.confirm_email ? 'error' : confirmEmailValid === false ? 'error' : confirmEmailValid === true ? 'success' : ''}
            required
          />
          {errors.confirm_email && (
            <span className="error-message">{errors.confirm_email}</span>
          )}
          {!errors.confirm_email && confirmEmailValid === false && formData.confirm_email && (
            <span className="error-message">Email addresses do not match</span>
          )}
          {!errors.confirm_email && confirmEmailValid === true && (
            <span className="success-message">✓ Email addresses match</span>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
          {!errors.password && passwordStrength && (
            <div className="password-strength">
              <div className="strength-label">
                Password strength:
                <span className={`strength-${passwordStrength}`}>
                  {passwordStrength === 'weak' && ' Weak - Add more characters'}
                  {passwordStrength === 'medium' && ' Medium - Add numbers or symbols'}
                  {passwordStrength === 'strong' && ' Strong ✓'}
                </span>
              </div>
              <div className="strength-bar">
                <div className={`strength-fill strength-fill-${passwordStrength}`}></div>
              </div>
            </div>
          )}

          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className={errors.confirm_password ? 'error' : formData.confirm_password && formData.password === formData.confirm_password ? 'success' : ''}
            required
          />
          {errors.confirm_password && (
            <span className="error-message">{errors.confirm_password}</span>
          )}
          {!errors.confirm_password && formData.confirm_password && formData.password !== formData.confirm_password && (
            <span className="error-message">Passwords do not match</span>
          )}
          {!errors.confirm_password && formData.confirm_password && formData.password === formData.confirm_password && (
            <span className="success-message">✓ Passwords match</span>
          )}

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className={errors.terms ? 'error' : ''}
              required
            />
            <label htmlFor="terms">I agree to the terms and conditions</label>
          </div>
          {errors.terms && (
            <span className="error-message">{errors.terms}</span>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering Shop...' : 'Register Shop'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopSignup;
