import React, { useState } from "react";
import AddMovieForm from "./AddMovieForm";

function MovieList({ movies, genres, userGenres, refreshData }) {
  const [expandedGenreId, setExpandedGenreId] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPoints, setEditPoints] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editGenreId, setEditGenreId] = useState("");

  function startEditing(movie) {
    setEditingMovie(movie.id);
    setEditName(movie.name);
    setEditPoints(movie.points.toString());
    setEditNotes(movie.notes || "");
    setEditGenreId(movie.genre.id.toString());
  }

  function cancelEditing() {
    setEditingMovie(null);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/movies/${editingMovie}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          points: parseFloat(editPoints),
          notes: editNotes,
          genre_id: parseInt(editGenreId, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update movie");
      }

      await refreshData();
      setEditingMovie(null);
    } catch (error) {
      alert(error.message);
    }
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    fetch(`/movies/${id}`, { method: "DELETE" }).then((r) => {
      if (r.ok) {
        refreshData();
      } else {
        alert("Failed to delete movie");
      }
    });
  }

  async function handleAddMovie({ name, points, notes, genreId }) {
    const parsedGenreId = parseInt(genreId, 10);
    if (isNaN(parsedGenreId)) {
      alert("Please select a valid genre.");
      return;
    }

    try {
      const res = await fetch("/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          points: parseFloat(points),
          notes,
          genre_id: parsedGenreId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add movie");
      }

      await refreshData();
    } catch (error) {
      alert(error.message);
    }
  }

  const moviesByGenre = {};
  genres.forEach((genre) => {
    moviesByGenre[genre.id] = movies.filter((m) => m.genre.id === genre.id);
  });

  return (
    <div>
      {userGenres.map((genre) => (
        <div key={genre.id} style={{ marginBottom: "1rem" }}>
          <h3
            style={{ cursor: "pointer", color: "#0077cc" }}
            onClick={() =>
              setExpandedGenreId(expandedGenreId === genre.id ? null : genre.id)
            }
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setExpandedGenreId(expandedGenreId === genre.id ? null : genre.id);
              }
            }}
            aria-expanded={expandedGenreId === genre.id}
            role="button"
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
                        aria-label="Edit movie name"
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={editPoints}
                        onChange={(e) => setEditPoints(e.target.value)}
                        required
                        aria-label="Edit movie points"
                      />
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        aria-label="Edit movie notes"
                      />
                      <select
                        value={editGenreId}
                        onChange={(e) => setEditGenreId(e.target.value)}
                        required
                        aria-label="Edit movie genre"
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
                  <li key={movie.id} className="movie-item">
                    <div className="movie-buttons">
                      <button
                        onClick={() => startEditing(movie)}
                        aria-label={`Edit ${movie.name}`}
                        className="btn-icon"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        aria-label={`Delete ${movie.name}`}
                        className="btn-icon"
                      >
                        🗑️
                      </button>
                    </div>

                    <strong>{movie.name}</strong> — Points: {movie.points}
                    <br />
                    <em>Notes:</em> {movie.notes || "No notes"}
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
        onAddGenre={refreshData}
      />
    </div>
  );
}

export default MovieList;
