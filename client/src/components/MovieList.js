import React, { useEffect, useState } from "react";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [notes, setNotes] = useState("");
  const [genre_id, setGenreId] = useState(1); // default, change as needed

  useEffect(() => {
    fetch("/movies")
      .then(res => res.json())
      .then(setMovies);
  }, []);

  function handleAddMovie(e) {
    e.preventDefault();

    fetch("/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, points, notes, genre_id }),
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to add movie");
      })
      .then(newMovie => setMovies([...movies, newMovie]))
      .catch(err => alert(err.message));
  }

  return (
    <div>
      <h3>Your Movies</h3>
      <ul>
        {movies.map(m => (
          <li key={m.id}>{m.name} — {m.points}/10</li>
        ))}
      </ul>

      <form onSubmit={handleAddMovie}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Movie name" />
        <input value={points} onChange={e => setPoints(e.target.value)} placeholder="Points" type="number" step="0.1" />
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <input value={genre_id} onChange={e => setGenreId(e.target.value)} placeholder="Genre ID" type="number" />
        <button>Add Movie</button>
      </form>
    </div>
  );
}

export default MovieList;
