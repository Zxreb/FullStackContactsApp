import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
    // State for the variables we need
    const [firstName, setFirstName] = useState(existingContact.firstName || "");
    const [lastName, setLastName] = useState(existingContact.lastName || "");
    const [email, setEmail] = useState(existingContact.email || "");
    const [phone, setPhone] = useState(existingContact.phone || "");

    const updating = Object.entries(existingContact).length !== 0

    // Once button is pressed this function begines
    const onSubmit = async (e) => {
        e.preventDefault()
        
        // Defining data that we want to pass with our Json as the request 
        const data = {
            firstName,
            lastName,
            email,
            phone
        }
        // Setting up the URL
        const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact")
        const options = {
            // Manually specify the options
            method: updating ? "PATCH" : "POST",
            // Let API know we have Json data
            headers: {
                "Content-Type": "application/json"
            },
            //Stringify Json Data
            body: JSON.stringify(data)
        }
        // Sending the request
        const response = await fetch(url, options)
        // Check for valid response
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            // Successfull
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phone">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ContactForm