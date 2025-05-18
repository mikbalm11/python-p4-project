import pytest
from sqlalchemy.exc import IntegrityError
from app import app
from models import db, User, Genre, Movie

class TestUserModel:
    '''User model in models.py'''

    def setup_method(self):
        '''Clear User table before each test.'''
        with app.app_context():
            User.query.delete()
            db.session.commit()

    def test_valid_user_creation(self):
        '''creates a User with valid username and password_hash.'''
        with app.app_context():
            user = User(username="ikbal", password_hash="hashed_pw")
            db.session.add(user)
            db.session.commit()
            assert user.id is not None

    def test_invalid_username_too_short(self):
        '''raises ValueError if username is too short.'''
        with app.app_context():
            with pytest.raises(ValueError):
                User(username="ab", password_hash="hashed_pw")


class TestGenreModel:
    '''Genre model in models.py'''

    def setup_method(self):
        '''Clear Genre table before each test.'''
        with app.app_context():
            Genre.query.delete()
            db.session.commit()

    def test_valid_genre_creation(self):
        '''creates a Genre with a valid name.'''
        with app.app_context():
            genre = Genre(name="Drama")
            db.session.add(genre)
            db.session.commit()
            assert genre.id is not None

    def test_invalid_genre_name_too_short(self):
        '''raises ValueError if Genre name is too short.'''
        with app.app_context():
            with pytest.raises(ValueError):
                Genre(name="A")


class TestMovieModel:
    '''Movie model in models.py'''

    def setup_method(self):
        '''Clear Movie, User, and Genre tables before each test.'''
        with app.app_context():
            Movie.query.delete()
            User.query.delete()
            Genre.query.delete()
            db.session.commit()

    def test_valid_movie_creation(self):
        '''creates a Movie with valid fields and links to User and Genre.'''
        with app.app_context():
            user = User(username="ikbal", password_hash="hashed_pw")
            genre = Genre(name="Action")
            db.session.add_all([user, genre])
            db.session.commit()

            movie = Movie(
                name="Matrix",
                points=10,
                notes="Amazing classic movie",
                user_id=user.id,
                genre_id=genre.id
            )
            db.session.add(movie)
            db.session.commit()
            assert movie.id is not None

    def test_invalid_movie_name_empty(self):
        '''raises ValueError if Movie name is empty.'''
        with app.app_context():
            with pytest.raises(ValueError):
                Movie(name="", points=5, user_id=1, genre_id=1)

    def test_invalid_movie_points_negative(self):
        '''raises ValueError if Movie points are negative.'''
        with app.app_context():
            with pytest.raises(ValueError):
                Movie(name="Valid", points=-5, user_id=1, genre_id=1)

    def test_invalid_notes_too_short(self):
        '''raises ValueError if Movie notes are too short.'''
        with app.app_context():
            with pytest.raises(ValueError):
                Movie(name="Movie", points=5, notes="Too short", user_id=1, genre_id=1)

    def test_valid_movie_without_notes(self):
        '''creates a Movie successfully without notes.'''
        with app.app_context():
            user = User(username="ikbal", password_hash="hashed_pw")
            genre = Genre(name="Comedy")
            db.session.add_all([user, genre])
            db.session.commit()

            movie = Movie(
                name="Funny Movie",
                points=5,
                user_id=user.id,
                genre_id=genre.id
            )
            db.session.add(movie)
            db.session.commit()
            assert movie.id is not None
