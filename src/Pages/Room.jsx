import React, { useState, useEffect } from "react";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";
import client from "../appwriteConfig";
import {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  databases,
} from "../appwriteConfig";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    // Subscribe to real-time events
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A message was created");
          setMessages((prevState) => [response.payload, ...prevState]); // Fix here
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A message was Deleted");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      // Cleanup subscription on component unmount
      unsubscribe();
    };
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      body: messageBody,
    };

    // Creating a new document which is gonna contain a message
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload
    );

    console.log("Created Rn", response);
    setMessageBody("");
  };

  const getMessages = async () => {
    try {
      // Fetch messages and order them by createdAt
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        [Query.orderDesc("$createdAt")]
      );
      console.log("RESPONSE:", response);
      setMessages(response.documents);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const deleteMessage = async (message_id) => {
    try {
      // Delete a message by its ID
      const response = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        message_id
      );

      console.log("Deleted:", response);
      setMessages((prevState) =>
        prevState.filter((message) => message.$id !== message_id)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <main className="container">
      <div className="room--container">
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Say Something Mate..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div className="message-wrapper" key={message.$id}>
              <div className="message--header">
                <small className="message-timestamp">
                  {new Date(message.$createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
                <Trash2
                  className="delete--btn"
                  onClick={() => {
                    deleteMessage(message.$id);
                  }}
                />
              </div>
              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
