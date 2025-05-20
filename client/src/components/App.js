import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import MovieList from "./MovieList";
import NavBar from "./NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [userGenres, setUserGenres] = useState([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/check_session", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();

        setUser(data); // updated shape
        setUserGenres(data.genres); // nested genres from backend

        // fetch genres for form dropdown (no movies)
        const genreRes = await fetch("/genres");
        setGenres(await genreRes.json());

      } catch {
        setUser(null);
        setGenres([]); // no need to fetch genres if not logged in
        setUserGenres([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  async function handleLogin() {
    try {
      const sessionRes = await fetch("/check_session", {
        credentials: "include",
      });
      if (!sessionRes.ok) throw new Error("Login session check failed");

      const userData = await sessionRes.json();
      setUser(userData);
      setUserGenres(userData.genres);

      const genresRes = await fetch("/genres");
      const allGenres = await genresRes.json();
      setGenres(allGenres);

      setForm(null);
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  function handleLogout() {
    fetch("/logout", { method: "DELETE", credentials: "include" }).then((r) => {
      if (r.ok) {
        setUser(null);
        setForm(null);
        setGenres([]);
        setUserGenres([]);
      }
    });
  }

  if (loading) return <p>Loading...</p>;

  if (user) {
    return (
      <div className="app-logged-in">
        <NavBar user={user} onLogout={handleLogout} onNavigate={setForm} />

        <h2>Your Movies by Genre</h2>

        <MovieList
          genres={genres}             // for the form dropdown
          userGenres={userGenres}     // already contains user’s movies per genre
          setGenres={setGenres}
          setUserGenres={setUserGenres}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar user={user} onLogout={handleLogout} onNavigate={setForm} />
      {form === "login" && <LoginForm onLogin={handleLogin} />}
      {form === "signup" && <SignUpForm onLogin={handleLogin} />}
      {(form === "login" || form === "signup") && (
        <button onClick={() => setForm(null)} className="btn btn-secondary">
          Back
        </button>
      )}
    </div>
  );
}

export default App;
