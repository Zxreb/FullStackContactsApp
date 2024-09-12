from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask Application
app = Flask(__name__)
# Allows for cross origin requests
CORS(app)

# Initializes the SQL lite DB
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
# No need to track every modification
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Create an instance of the DB
# Gives access to the DB from before and makes life easier
db = SQLAlchemy(app)