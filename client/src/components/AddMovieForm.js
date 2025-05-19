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

    onAddMovie({
      name,
      points,
      notes,
      genreId,
    });

    // Clear form
    setName("");
    setPoints("");
    setNotes("");
    setGenreId("");
  }

  return (
    <div className="add-movie-container">
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <input
          type="text"
          placeholder="Movie title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Movie title"
          className="input-text"
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
          aria-label="Points (0 to 10)"
          className="input-number"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Notes about the movie"
          className="textarea-notes"
        />
        <select
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          required
          aria-label="Select genre"
          className="select-genre"
        >
          <option value="">-- Select Genre --</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Add Movie
        </button>
      </form>

      <button
        onClick={() => setShowGenreForm((prev) => !prev)}
        className="btn btn-secondary toggle-genre-form-btn"
      >
        {showGenreForm ? "Cancel Adding Genre" : "Add New Genre"}
      </button>

      {showGenreForm && <AddGenreForm onAddGenre={onAddGenre} />}
    </div>
  );
}

export default AddMovieForm;
