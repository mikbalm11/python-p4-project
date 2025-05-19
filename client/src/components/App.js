import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import MovieList from "./MovieList";
import NavBar from "./NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userGenres, setUserGenres] = useState([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/check_session");
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);

        if (data) {
          const [moviesRes, genresRes, userGenresRes] = await Promise.all([
            fetch("/movies"),
            fetch("/genres"),
            fetch("/user_genres"),
          ]);
          setMovies(await moviesRes.json());
          setGenres(await genresRes.json());
          setUserGenres(await userGenresRes.json());
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  async function refreshData() {
    const [moviesRes, genresRes, userGenresRes] = await Promise.all([
      fetch("/movies"),
      fetch("/genres"),
      fetch("/user_genres"),
    ]);
    setMovies(await moviesRes.json());
    setGenres(await genresRes.json());
    setUserGenres(await userGenresRes.json());
  }

  async function handleLogin(user) {
    setUser(user);
    setForm(null);
    await refreshData();
  }

  function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
        setForm(null);
        setMovies([]);
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
          movies={movies}
          genres={genres}
          userGenres={userGenres}
          refreshData={refreshData}
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
