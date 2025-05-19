
# Python P4 Project

This repository contains a full-stack web application built using **Flask** for the backend and **React** for the frontend. The project is based on the Flatiron School Phase 4 curriculum template, designed to demonstrate the integration of a Python API backend with a modern React frontend.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Setup and Installation](#setup-and-installation) 
- [Running the Application](#running-the-application)  
- [Testing](#testing)  
- [Project Structure](#project-structure)  

---

## Project Overview

This project implements a web application that leverages a Flask API backend to handle business logic, database models, and routing, while React manages the frontend user interface. The backend and frontend communicate via RESTful API calls.

The application allows users to interact with models such as `User`, `Movie`, and `Genre`. Each user can have many movies, each movie belongs to one genre and one user, establishing relationships between models.

---

## Tech Stack

- **Backend:** Python, Flask, SQLAlchemy, SQLite  
- **Frontend:** React, JavaScript 
- **Testing:** Pytest (backend)
- **Package Management:** Pipenv (Python), npm (Node.js)  

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mikbalm11/python-p4-project.git
cd python-p4-project
```

---

### 2. Backend Setup

Navigate to the `server` directory, create a virtual environment, and install dependencies.

```bash
cd server
```

Use the `Pipfile` with Pipenv:

```bash
pip install pipenv
pipenv install ; pipenv shell
```

---

### 3. Frontend Setup

Navigate to the `client` directory and install the npm packages:

```bash
cd ../client
npm install --prefix client
```

---

## Running the Application

### Backend

Run the Flask server:

```bash
cd server
python app.py
```

This will start the backend server on `http://localhost:5555`.

---

### Frontend

In a separate terminal, start the React app:

```bash
cd client
npm start --prefix client
```

This launches the frontend on `http://localhost:4000`.

---

## Testing

### Backend Tests

Run backend tests using `pytest`:

```bash
cd server
pytest
```

---

## Project Structure

```
.
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── server/                  # Flask backend
│   ├── app.py               # Flask application entry point
│   ├── models.py            # Database models
│   ├── requirements.txt     # Python dependencies
│   ├── Pipfile             # Alternative Python dependency manager
│   └── ...
├── README.md                # This file
└── ...
```
