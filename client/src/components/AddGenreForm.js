import React, { useState } from "react";

function AddGenreForm({ onAddGenre }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        else return r.json().then((err) => Promise.reject(err));
      })
      .then((newGenre) => {
        onAddGenre(newGenre);
        setName("");
      })
      .catch((err) => alert(err.error || "Failed to add genre"));
  }

  return (
    <form onSubmit={handleSubmit} className="add-genre-form">
      <input
        type="text"
        placeholder="New genre name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        aria-label="New genre name"
        className="input-text"
      />
      <button type="submit" className="btn btn-primary">
        Add Genre
      </button>
    </form>
  );
}

export default AddGenreForm;
