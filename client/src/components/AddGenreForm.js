import React, { useState } from "react";

function AddGenreForm({ onAddGenre }) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add genre");
      }

      const newGenre = await res.json();
      onAddGenre(newGenre); // send new genre up
      setName("");
    } catch (error) {
      alert(error.message);
    }
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
      />
      <button type="submit" className="btn btn-success">
        Add Genre
      </button>
    </form>
  );
}

export default AddGenreForm;
