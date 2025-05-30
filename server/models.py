from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password = db.Column(db.String, nullable=False)

    movies = db.relationship('Movie', back_populates='user', cascade='all, delete-orphan')
    genres = db.relationship('Genre', secondary='movies', viewonly=True)

    serialize_rules = ('-movies.user', '-genres', '-_password',)

    @hybrid_property
    def password(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password = password_hash.decode('utf-8')

    def authenticate(self, password):
        try:
            return bcrypt.check_password_hash(self._password, password.encode('utf-8'))
        except ValueError as e:
            raise ValueError(f"Password hash is invalid: {self._password}") from e

    @validates('username')
    def validate_username(self, key, username):
        if not username or not isinstance(username, str) or len(username.strip()) < 3:
            raise ValueError("Username must be a non-empty string of at least 3 characters.")
        return username

    def __repr__(self):
        return f"<User {self.username}>"

class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    movies = db.relationship('Movie', back_populates='genre', cascade='all, delete-orphan')
    users = db.relationship('User', secondary='movies', viewonly=True)

    serialize_rules = ('-movies.genre', '-users')

    @validates('name')
    def validate_name(self, key, name):
        if not name or not isinstance(name, str) or len(name.strip()) < 2:
            raise ValueError("Genre name must be a non-empty string of at least 2 characters.")
        return name

    def __repr__(self):
        return f"<Genre {self.name}>"

class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    points = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=False)

    user = db.relationship('User', back_populates='movies')
    genre = db.relationship('Genre', back_populates='movies')

    serialize_rules = ('-user', '-genre.movies', '-genre.users')

    @validates('name')
    def validate_name(self, key, name):
        if not name or not isinstance(name, str) or len(name.strip()) < 1:
            raise ValueError("Movie name must be a non-empty string.")
        return name.strip()

    @validates('points')
    def validate_points(self, key, points):
        try:
            points = float(points)
        except (ValueError, TypeError):
            raise ValueError("Points must be a number.")

        if not (0 <= points <= 10):
            raise ValueError("Points must be a non-negative float between 0 and 10.")
        
        return points

    @validates('notes')
    def validate_notes(self, key, notes):
        if notes:
            if not isinstance(notes, str) or len(notes.strip()) < 10:
                raise ValueError("Notes must be at least 10 characters long.")
            return notes
        return None

    def __repr__(self):
        return f"<Movie {self.name} (User {self.user_id}, Genre {self.genre_id})>"
