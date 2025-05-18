#!/usr/bin/env python3

from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api, bcrypt
from models import User, Movie, Genre


@app.before_request
def check_if_logged_in():
    open_access_list = [
        'signup',
        'login',
        'check_session',
        'genres'  # Allow public GET on genres
    ]

    if (request.endpoint) not in open_access_list and (not session.get('user_id')):
        result = make_response(
            {'error': '401 Unauthorized'},
            401
        )
        return result


class Signup(Resource):
    def post(self):
        fields = request.get_json()

        username = fields.get('username')
        password = fields.get('password')

        if not username or not password:
            result = make_response(
                {'error': 'Username and password required'},
                422
            )
            return result

        try:
            hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

            new_user = User(username=username, password_hash=hashed_pw)

            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id

            result = make_response(
                new_user.to_dict(),
                201
            )
            return result

        except IntegrityError:
            db.session.rollback()
            result = make_response(
                {'error': '422 Unprocessable Entity - Username taken'},
                422
            )
            return result

        except ValueError as e:
            result = make_response(
                {'error': str(e)},
                422
            )
            return result


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                result = make_response(
                    user.to_dict(),
                    200
                )
                return result
        result = make_response(
            {},
            401
        )
        return result


class Login(Resource):
    def post(self):
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            result = make_response(
                user.to_dict(),
                200
            )
            return result

        result = make_response(
            {'error': '401 Unauthorized'},
            401
        )
        return result


class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        result = make_response(
            {},
            204
        )
        return result


class GenreList(Resource):
    def get(self):
        genres = Genre.query.all()
        result = make_response(
            [genre.to_dict() for genre in genres],
            200
        )
        return result


class MovieIndex(Resource):
    def get(self):
        if 'user_id' not in session:
            result = make_response(
                {'error': 'Unauthorized'},
                401
            )
            return result

        user = User.query.get(session['user_id'])
        result = make_response(
            [movie.to_dict() for movie in user.movies],
            200
        )
        return result

    def post(self):
        if 'user_id' not in session:
            result = make_response(
                {'error': 'Unauthorized'},
                401
            )
            return result

        fields = request.get_json()

        name = fields.get('name')
        points = fields.get('points')
        notes = fields.get('notes')
        genre_id = fields.get('genre_id')

        try:
            genre = Genre.query.get(genre_id)
            if not genre:
                result = make_response(
                    {'error': 'Genre not found'},
                    422
                )
                return result

            new_movie = Movie(
                name=name,
                points=points,
                notes=notes,
                user_id=session['user_id'],
                genre_id=genre_id
            )

            db.session.add(new_movie)
            db.session.commit()

            result = make_response(
                new_movie.to_dict(),
                201
            )
            return result

        except ValueError as e:
            db.session.rollback()
            result = make_response(
                {'error': str(e)},
                422
            )
            return result

        except IntegrityError:
            db.session.rollback()
            result = make_response(
                {'error': '422 Unprocessable Entity'},
                422
            )
            return result


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(GenreList, '/genres', endpoint='genres')
api.add_resource(MovieIndex, '/movies', endpoint='movies')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
