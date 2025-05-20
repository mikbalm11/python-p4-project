import React, { useState } from "react";
import AddMovieForm from "./AddMovieForm";

function MovieList({ genres, userGenres, setGenres, setUserGenres }) {
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

  function handleAddGenre(newGenre) {
    setGenres((prev) => [...prev, newGenre]);
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
          genre_id: parseInt(editGenreId),
        }),
      });

      if (!res.ok) throw new Error("Failed to update movie");

      const updatedMovie = await res.json();

      setUserGenres((prev) => {
        const updated = prev.map((genre) => {
          let movies = genre.movies?.filter((m) => m.id !== updatedMovie.id) || [];
          if (genre.id === updatedMovie.genre.id) {
            movies = [...movies, updatedMovie];
          }
          return { ...genre, movies };
        });
        return updated;
      });

      setEditingMovie(null);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    const res = await fetch(`/movies/${id}`, { method: "DELETE" });

    if (res.ok) {
      setUserGenres((prev) =>
        prev
          .map((genre) => ({
            ...genre,
            movies: genre.movies?.filter((movie) => movie.id !== id),
          }))
          .filter((genre) => genre.movies.length > 0)
      );
    } else {
      alert("Failed to delete movie");
    }
  }

  async function handleAddMovie({ name, points, notes, genreId }) {
    try {
      const res = await fetch("/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          points: parseFloat(points),
          notes,
          genre_id: parseInt(genreId),
        }),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      const newMovie = await res.json();

      setUserGenres((prev) => {
        const genreExists = prev.some((genre) => genre.id === newMovie.genre.id);

        if (genreExists) {
          // add to existing genre
          return prev.map((genre) =>
            genre.id === newMovie.genre.id
              ? { ...genre, movies: [...(genre.movies || []), newMovie] }
              : genre
          );
        } else {
          // new genre with one movie
          return [...prev, { ...newMovie.genre, movies: [newMovie] }];
        }
      });
    } catch (error) {
      alert(error.message);
    }
  }

  const uniqueUserGenres = Array.from(
    new Map(userGenres.map(g => [g.id, g])).values()
  );

  return (
    <div>
      {uniqueUserGenres.map((genre) => (
        <div key={`genre-${genre.id}`} style={{ marginBottom: "1rem" }}>
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
              {(genre.movies || []).map((movie) =>
                editingMovie === movie.id ? (
                  <li key={`movie-edit-${movie.id}`}>
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
                  <li key={`movie-${movie.id}`} className="movie-item">
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
        onAddGenre={handleAddGenre}
      />
    </div>
  );
}

export default MovieList;
