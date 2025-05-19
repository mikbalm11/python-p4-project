import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import AddMovieForm from "./AddMovieForm";
import NavBar from "./NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [expandedGenreId, setExpandedGenreId] = useState(null);

  const [editingMovie, setEditingMovie] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPoints, setEditPoints] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editGenreId, setEditGenreId] = useState("");

  useEffect(() => {
    fetch("/check_session")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setUser(data);
        if (data) {
          fetch("/movies").then((r) => r.json()).then(setMovies);
          fetch("/genres").then((r) => r.json()).then(setGenres);               // get all genres
          fetch("/user_genres").then((r) => r.json()).then(setUserGenres);     // get only user-specific genres
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function handleLogin(user) {
    setUser(user);
    setForm(null);
    fetch("/movies").then((r) => r.json()).then(setMovies);
    fetch("/genres").then((r) => r.json()).then(setGenres);
    fetch("/user_genres").then((r) => r.json()).then(setUserGenres);
  }

  function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
        setForm(null);
        setMovies([]);
        setGenres([]);
      }
    });
  }

  function handleAddMovie(newMovie) {
    setMovies((movies) => [...movies, newMovie]);
    fetch("/user_genres").then((r) => r.json()).then(setUserGenres); // Refresh user genre list
  }

  function handleAddGenre(newGenre) {
    // Do nothing here — just let the AddMovieForm receive the new genre for dropdown
  }

  function startEditing(movie) {
    setEditingMovie(movie.id);
    setEditName(movie.name);
    setEditPoints(movie.points);
    setEditNotes(movie.notes || "");
    setEditGenreId(movie.genre.id);
  }

  function cancelEditing() {
    setEditingMovie(null);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    fetch(`/movies/${editingMovie}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        points: editPoints,
        notes: editNotes,
        genre_id: editGenreId,
      }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        else return r.json().then((err) => Promise.reject(err));
      })
      .then((updatedMovie) => {
        setMovies((movies) =>
          movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
        );
        setEditingMovie(null);
      })
      .catch((err) => alert(err.error || "Failed to update movie"));
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    fetch(`/movies/${id}`, { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setMovies((movies) => movies.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete movie");
      }
    });
  }

  if (loading) return <p>Loading...</p>;

  if (user) {
    // Group movies by genre
    const moviesByGenre = {};
    genres.forEach((genre) => {
      moviesByGenre[genre.id] = movies.filter((m) => m.genre.id === genre.id);
    });

    return (
      <div>
        <NavBar user={user} onLogout={handleLogout} onNavigate={setForm} />

        <h2>Your Movies by Genre</h2>
        {userGenres.map((genre) => (
          <div key={genre.id} style={{ marginBottom: "1rem" }}>
            <h3
              style={{ cursor: "pointer", color: "#0077cc" }}
              onClick={() =>
                setExpandedGenreId(
                  expandedGenreId === genre.id ? null : genre.id
                )
              }
            >
              {genre.name}
            </h3>

            {expandedGenreId === genre.id && (
              <ul>
                {(moviesByGenre[genre.id] || []).map((movie) =>
                  editingMovie === movie.id ? (
                    <li key={movie.id}>
                      <form onSubmit={handleEditSubmit}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={editPoints}
                          onChange={(e) => setEditPoints(e.target.value)}
                          required
                        />
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          required
                        />
                        <select
                          value={editGenreId}
                          onChange={(e) => setEditGenreId(e.target.value)}
                          required
                        >
                          {genres.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                        <button type="submit">Save</button>
                        <button type="button" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </form>
                    </li>
                  ) : (
                    <li key={movie.id}>
                      <strong>{movie.name}</strong> — Points: {movie.points}
                      <br />
                      <em>Notes:</em> {movie.notes || "No notes"}
                      <br />
                      <button onClick={() => startEditing(movie)}>Edit</button>
                      <button onClick={() => handleDelete(movie.id)}>
                        Delete
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        ))}

        <AddMovieForm
          genres={genres}
          onAddMovie={handleAddMovie}
          onAddGenre={handleAddGenre}
        />
      </div>
    );
  }

  return (
    <div>
      {form === "login" && <LoginForm onLogin={handleLogin} />}
      {form === "signup" && <SignUpForm onLogin={handleLogin} />}

      {!form && (
        <>
          <button onClick={() => setForm("login")}>Login</button>
          <button onClick={() => setForm("signup")}>Sign Up</button>
        </>
      )}

      {(form === "login" || form === "signup") && (
        <button onClick={() => setForm(null)}>Back</button>
      )}
    </div>
  );
}

export default App;
