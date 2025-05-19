import React, { useState } from "react";
import AddGenreForm from "./AddGenreForm";

function AddMovieForm({ genres, onAddMovie, onAddGenre }) {
  const [name, setName] = useState("");
  const [points, setPoints] = useState("");
  const [notes, setNotes] = useState("");
  const [genreId, setGenreId] = useState("");
  const [showGenreForm, setShowGenreForm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!genreId) {
      alert("Please select a genre or add a new one");
      return;
    }
    fetch("/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        points,
        notes,
        genre_id: genreId,
      }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        else return r.json().then((err) => Promise.reject(err));
      })
      .then((newMovie) => {
        onAddMovie(newMovie);
        setName("");
        setPoints("");
        setNotes("");
        setGenreId("");
      })
      .catch((err) => alert(err.error || "Failed to add movie"));
  }

  return (
    <div>
      <h2>Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Movie title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Points (0-10)"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
        <textarea
          placeholder="Notes (min 10 characters)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <select
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          required
        >
          <option value="">-- Select Genre --</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Movie</button>
      </form>

      <button onClick={() => setShowGenreForm(!showGenreForm)}>
        {showGenreForm ? "Cancel Adding Genre" : "Add New Genre"}
      </button>

      {showGenreForm && <AddGenreForm onAddGenre={onAddGenre} />}
    </div>
  );
}

export default AddMovieForm;
