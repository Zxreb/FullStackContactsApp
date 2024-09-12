import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";

function App() {
  // State to store list of contacts fetched from server
  const [contacts, setContacts] = useState([]);
  // State to control the visibility of the modal (true if open)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // State to store the contact currently being edited or viewed
  const [currentContact, setCurrentContact] = useState({})

  // Fetch contacts when the component mounts
  useEffect(() => {
    fetchContacts()
  }, []);

  // Fetch contacts from server and update state
  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  // Close the modal and reset the current contact
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  // Open the modal for creating a new contact
  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  // Open the modal for editing and existing contact
  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  // Handle update of contacts, called after a contact is created or edited
  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }

  return (
    <>
      <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Contact</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}

export default App;