from faker import Faker
from random import choice, uniform
from config import app, db
from models import User, Genre, Movie
from flask_bcrypt import Bcrypt

faker = Faker()
bcrypt = Bcrypt()

with app.app_context():
    print("🌱 Seeding database...")

    # Reset database
    Movie.query.delete()
    Genre.query.delete()
    User.query.delete()

    # Seed Users
    users = []
    for i in range(5):
        username = faker.user_name()
        password_hash = bcrypt.generate_password_hash("password").decode('utf-8')
        user = User(username=username, password_hash=password_hash)
        db.session.add(user)
        users.append(user)

    # Seed Genres
    genre_names = ["Action", "Drama", "Sci-Fi", "Romance", "Comedy", "Horror"]
    genres = []
    for name in genre_names:
        genre = Genre(name=name)
        db.session.add(genre)
        genres.append(genre)

    db.session.commit()

    # Seed Movies
    for _ in range(20):
        movie = Movie(
            name=faker.sentence(nb_words=3),
            points=round(uniform(0, 10), 1),  # ✅ float between 0 and 10
            notes=faker.paragraph(nb_sentences=2),
            user_id=choice(users).id,
            genre_id=choice(genres).id
        )
        db.session.add(movie)

    db.session.commit()
    print("✅ Seeding complete.")
