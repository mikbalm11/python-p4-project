import "./../NavBar.css";

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

};

export default NavBar;
