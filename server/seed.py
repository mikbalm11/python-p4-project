from config import app, db
from models import User, Genre, Movie

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
        user.password = raw_pw
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
        ("Forrest Gump", 8.8, "Life's unexpected journey through the eyes of Forrest.", "alice", "Drama"),
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
        ("Parasite", 8.6, "A darkly comedic thriller that examines class disparity.", "eve", "Drama"),
        ("The Matrix", 8.7, "A cyberpunk classic exploring reality and human freedom.", "ikbal", "Sci-Fi"),
        ("John Wick", 7.4, "Stylish and intense action with a revenge-driven narrative.", "bob", "Action"),
        ("The Notebook", 7.8, "A tearjerking love story that spans decades.", "charlie", "Romance"),
        ("Mean Girls", 7.0, "A sharp and funny teen comedy about high school cliques.", "diana", "Comedy"),
        ("The Conjuring", 7.5, "A supernatural horror film based on true events.", "eve", "Horror"),
        ("Gravity", 7.7, "A breathtaking space survival story.", "ikbal", "Sci-Fi"),
        ("Joker", 8.4, "A disturbing character study of a man’s descent into madness.", "alice", "Drama"),
        ("Taken", 7.8, "A fast-paced action thriller about a father's mission.", "bob", "Action"),
        ("500 Days of Summer", 7.7, "An unconventional take on love and heartbreak.", "charlie", "Romance"),
        ("The 40-Year-Old Virgin", 7.1, "A quirky comedy about late-blooming romance.", "diana", "Comedy"),
        ("Insidious", 6.8, "A family faces terrifying forces from the beyond.", "eve", "Horror"),
        ("Ex Machina", 7.7, "An eerie sci-fi tale about AI and ethics.", "ikbal", "Sci-Fi"),
        ("The Pursuit of Happyness", 8.0, "An emotional drama about perseverance and fatherhood.", "alice", "Drama"),
        ("Edge of Tomorrow", 7.9, "A clever action-sci-fi hybrid with time loops.", "bob", "Action"),
        ("Before Sunrise", 8.1, "A romantic encounter between strangers in Europe.", "charlie", "Romance"),
        ("Pitch Perfect", 7.1, "A fun, musical comedy with acapella battles.", "diana", "Comedy"),
        ("It", 7.3, "A terrifying adaptation of Stephen King's horror classic.", "eve", "Horror"),
        ("Dune", 8.1, "An epic sci-fi saga of politics and prophecy.", "ikbal", "Sci-Fi"),
        ("Little Women", 7.9, "A touching adaptation of the literary classic.", "alice", "Drama"),
    ]

    # Map usernames and genres for quick lookup
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
