#Allows us to request Json data
from flask import request, jsonify
from config import app, db
from models import Contact

@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    # New list which contains Json for the contacts through the to_Json method
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    # Return the contacts as Json data
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    # These following lines request the info for the contact 
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    phone = request.json.get("phone")
    
    # If one of the pieces of information was not unput, we return an error response
    if not first_name or not last_name or not email or not phone:
        return (
            jsonify({"message": "You must include a first name, last name, email, and phone #"}),
            400,
        )

    # After the initial checks, we create the actual contact and store it in our DB
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email, phone=phone)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    # Search the DB for the contact ID that is being requested to update
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    # What we are passing to update in the contacts list
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)
    contact.phone = data.get("phone", contact.phone)

    db.session.commit()

    return jsonify({"message": "User has been updated."}), 200

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    # Search the DB for the contact ID that is being requested to delete
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

# Run the flask application
# Protects us from  running the app unnecessarily
if __name__ == "__main__":
    # Create all of the different models that are defined in our DB
    with app.app_context():
        db.create_all()
    app.run(debug=True)