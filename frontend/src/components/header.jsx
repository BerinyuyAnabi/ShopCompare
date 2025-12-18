import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/header.css";

function Header() {
  return (
    <header className="app-header">
      <nav className="auth-nav">
        <div className="nav1">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="search">
          <input
            type="search"
            className="search-input"
            placeholder="Search products here..."
            aria-label="Search products"
          />
          <button type="button" className="search-button">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="nav2">
          <Link to="/signup" className="nav-link">
            Customer Sign Up
          </Link>
          <Link to="/storeSignup" className="nav-link">
            Store Sign Up
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
