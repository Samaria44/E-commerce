import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import "./user.css";

const BACKEND_URL = "http://localhost:8000/contact"; // your backend API

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all contact messages
  const fetchContacts = async () => {
    try {
      const res = await axios.get(BACKEND_URL); // GET all messages
      setContacts(res.data); // assuming backend returns array
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch contacts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete contact message
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${BACKEND_URL}/${id}`);
        setContacts(contacts.filter((contact) => contact._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete message.");
      }
    }
  };

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-table-container">
      <h2 className="user-title">
        Contact Messages <span className="count">({contacts.length})</span>
      </h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                No messages found
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.subject}</td>
                <td>{contact.message}</td>
                <td>
                  <FiTrash2
                    className="delete"
                    onClick={() => handleDelete(contact._id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
