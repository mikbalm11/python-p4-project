// src/NavBar.js
import React from "react";

function NavBar({ user, onLogout, onNavigate }) {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.title}>🎬 Movie Tracker</h2>

      {user ? (
        <div style={styles.links}>
          <span style={styles.welcome}>Welcome, {user.username}!</span>
          <button onClick={onLogout} style={styles.button}>Logout</button>
        </div>
      ) : (
        <div style={styles.links}>
          <button onClick={() => onNavigate("login")} style={styles.button}>Login</button>
          <button onClick={() => onNavigate("signup")} style={styles.button}>Sign Up</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#222",
    color: "#fff",
    padding: "10px 20px",
  },
  title: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "10px",
  },
  welcome: {
    marginRight: "10px",
  },
  button: {
    background: "#444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default NavBar;
