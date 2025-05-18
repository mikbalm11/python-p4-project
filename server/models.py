from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)

    # Relationships
    movies = db.relationship('Movie', back_populates='user', cascade='all, delete-orphan')
    genres = association_proxy('movies', 'genre')

    # Serialization rules
    serialize_rules = ('-movies.user', '-password_hash',)

    def __repr__(self):
        return f"<User {self.username}>"

class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    # Relationships
    movies = db.relationship('Movie', back_populates='genre', cascade='all, delete-orphan')
    users = association_proxy('movies', 'user')

    serialize_rules = ('-movies.genre',)

    def __repr__(self):
        return f"<Genre {self.name}>"

class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='movies')
    genre = db.relationship('Genre', back_populates='movies')

    serialize_rules = ('-user.movies', '-genre.movies')

    def __repr__(self):
        return f"<Movie {self.name} (User {self.user_id}, Genre {self.genre_id})>"
