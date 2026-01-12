import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } else {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    }
  };

  const isHomePage = location.pathname === "/";

  return (
      <nav
            className={`navbar ${isHomePage ? "navbar-home" : ""} ${
              isScrolled ? "navbar-scrolled" : ""
            }`}
          >      {/* Logo linking to Home */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="src/assets/tritonscript.png" alt="TritonScript Logo" className="logo-image" />
        </Link>
      </div>

      <div className="navbar-center">
        <ul className="navbar-links">
          {!isLoggedIn ? (
            <>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/upload">My Notes</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="auth-button">
        <button onClick={handleAuthClick}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
