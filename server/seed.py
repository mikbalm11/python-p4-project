from config import app, db
from models import User, Genre, Movie
from flask_bcrypt import Bcrypt
from random import choice, uniform

bcrypt = Bcrypt()

with app.app_context():
    print("🌱 Seeding database...")

    # Reset database
    Movie.query.delete()
    Genre.query.delete()
    User.query.delete()

    # Seed Users with real example usernames
    users_data = [
        ("ikbal", "password"),
        ("alice", "password"),
        ("bob", "password"),
        ("charlie", "password"),
        ("diana", "password"),
        ("eve", "password"),
    ]
    users = []
    for username, raw_pw in users_data:
        user = User(username=username)
        user.password = raw_pw  # uses the @password.setter and hashes automatically
        db.session.add(user)
        users.append(user)
        print(f"Created user: {username} with password: {raw_pw}")

    # Seed Genres
    genre_names = ["Action", "Drama", "Sci-Fi", "Romance", "Comedy", "Horror"]
    genres = []
    for name in genre_names:
        genre = Genre(name=name)
        db.session.add(genre)
        genres.append(genre)

    db.session.commit()

    # Seed Movies with real titles and notes
    movies_data = [
        ("Inception", 9.0, "A mind-bending thriller that explores dreams within dreams.", "ikbal", "Sci-Fi"),
        ("The Shawshank Redemption", 9.5, "An inspiring story of hope and friendship in prison.", "alice", "Drama"),
        ("The Dark Knight", 9.3, "Batman faces the Joker in this critically acclaimed action film.", "bob", "Action"),
        ("Titanic", 8.5, "A tragic romance set against the sinking of the Titanic.", "charlie", "Romance"),
        ("Superbad", 7.6, "A hilarious coming-of-age comedy about high school friends.", "diana", "Comedy"),
        ("Get Out", 8.0, "A chilling horror film with sharp social commentary.", "eve", "Horror"),
        ("Interstellar", 8.8, "A visually stunning sci-fi epic exploring space and time.", "ikbal", "Sci-Fi"),
        ("Forrest Gump", 8.8, "Life’s unexpected journey through the eyes of Forrest.", "alice", "Drama"),
        ("The Hangover", 7.7, "A wild comedy about a bachelor party gone wrong.", "bob", "Comedy"),
        ("A Quiet Place", 7.5, "A suspenseful horror about silence and survival.", "charlie", "Horror"),
        ("La La Land", 8.0, "A modern musical romance set in Los Angeles.", "diana", "Romance"),
        ("Mad Max: Fury Road", 8.1, "High-octane action in a post-apocalyptic world.", "eve", "Action"),
        ("Arrival", 7.9, "A thoughtful sci-fi film about language and alien contact.", "ikbal", "Sci-Fi"),
        ("The Godfather", 9.2, "A classic crime drama about a powerful mafia family.", "alice", "Drama"),
        ("Bridesmaids", 6.8, "A raunchy comedy centered around friendship and weddings.", "bob", "Comedy"),
        ("Hereditary", 7.3, "A deeply unsettling horror about family secrets.", "charlie", "Horror"),
        ("Pride & Prejudice", 8.1, "A timeless romantic drama based on Jane Austen’s novel.", "diana", "Romance"),
        ("Gladiator", 8.5, "An epic action film about revenge and honor in ancient Rome.", "eve", "Action"),
        ("Blade Runner 2049", 8.0, "A visually striking sci-fi sequel exploring identity.", "ikbal", "Sci-Fi"),
        ("The Fault in Our Stars", 7.7, "A heartfelt romance about young love and loss.", "alice", "Romance"),
    ]

    # Add movies with correct user and genre IDs
    username_to_user = {user.username: user for user in users}
    genre_name_to_genre = {genre.name: genre for genre in genres}

    for name, points, notes, username, genre_name in movies_data:
        movie = Movie(
            name=name,
            points=points,
            notes=notes,
            user_id=username_to_user[username].id,
            genre_id=genre_name_to_genre[genre_name].id,
        )
        db.session.add(movie)

    db.session.commit()
    print("✅ Seeding complete.")
