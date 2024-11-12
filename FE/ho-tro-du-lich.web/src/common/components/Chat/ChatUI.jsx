import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import { FiSearch, FiSend } from "react-icons/fi";
import * as signalR from "@microsoft/signalr";
import { chatService } from "../../../services/chatService";
import { userService } from "../../../services/userSerivce";
import { toast } from "react-toastify";
import { localStorageService } from "../../../services/localstorageService";
import "./ChatUI.scss";
// Contact List Component
const ContactList = ({
  contacts,
  selectedAdmin,
  onContactClick,
  searchQuery,
}) => {
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ListGroup
      className="chat-ui-group overflow-auto h-100 rounded-0"
      style={{ maxHeight: "100%" }}
    >
      {filteredContacts.map((contact) => (
        <ListGroup.Item
          key={contact.id}
          variant="success"
          action
          active={selectedAdmin?.id === contact.id}
          onClick={() => onContactClick(contact)}
          className={`chat-ui-group__items border-0 p-2 rounded-0 border-1 border-bottom`}
          style={{ minHeight: "60px" }}
        >
          <div className="d-flex align-items-center overflow-hidden">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="rounded-circle me-3 border"
              style={{ width: "55px", height: "55px" }}
            />
            <div className="d-none d-sm-block w-100">
              <h6
                className="mb-0"
                style={{ whiteSpace: "nowrap", overflow: "hidden" }}
              >
                {contact.name || "sadsadsa dsad sad sad sad s"}
              </h6>
              <p
                className="mb-0"
                style={{
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {contact.lastMessage || "No messages yet."}
              </p>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

// Message List Component
const MessageList = ({ messages, loading, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="chat-ui__box-chat-item overflow-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`d-flex ${
            message.isSender ? "justify-content-end" : "justify-content-start"
          } mb-3`}
        >
          <div
            className={`p-2 rounded-3 shadow-sm ${
              message.isSender ? "bg-success text-white" : "bg-light text-dark"
            }`}
            style={{
              maxWidth: "75%",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              textAlign: "justify",
            }}
          >
            <p className="mb-1">{message.message}</p>
            <p className="d-block text-end m-0" style={{ fontSize: "0.7rem" }}>
              {new Date(message.sendDate).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    <div className="bg-white border-top p-3 d-flex">
      <Form.Control
        type="text"
        placeholder="Type a message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button variant="primary" className="ms-2" onClick={handleSendMessage}>
        <FiSend />
      </Button>
    </div>
  );
};

// Main ChatUI Component
const ChatUI = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState(null);

  const messagesEndRef = useRef(null);

  // Fetch admin users
  const fetchAdminUsers = useCallback(async () => {
    try {
      const response = await userService.getAdminUser();
      if (response?.success) {
        const admins = response.data.map((admin) => ({
          id: admin.userId,
          name: admin.fullName,
          avatar: admin.picture || "https://via.placeholder.com/150",
          lastMessage: "No messages yet",
          unread: 0,
        }));
        setContacts(admins);
      }
    } catch (error) {
      toast.error("Error fetching admin users: " + error);
    }
  }, []);

  // Fetch conversation for selected admin
  const fetchConversation = async (admin) => {
    setSelectedAdmin(admin);
    setLoading(true);
    try {
      const response = await chatService.getMyConversations({
        receiverId: admin.id,
      });
      if (response?.success) {
        setMessages(response.data);
        updateLastMessageInContacts(admin.id, response.data);
      }
    } catch (error) {
      toast.error("Error fetching conversations: " + error);
    } finally {
      setLoading(false);
    }
  };

  // Update last message for selected admin in contact list
  const updateLastMessageInContacts = (adminId, conversation) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === adminId
          ? {
              ...contact,
              lastMessage:
                conversation.length > 0
                  ? conversation[conversation.length - 1].message
                  : "No messages yet",
            }
          : contact
      )
    );
  };

  // SignalR connection setup (runs only once)
  useEffect(() => {
    const connectToSignalR = async () => {
      const token = localStorageService.getAccessToken();
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7001/chathub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      newConnection.on(
        "ReceivePrivateMessage",
        (senderId, newMessage, sendDate) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              senderId,
              message: newMessage,
              isSender: false,
              sendDate: sendDate || new Date().toISOString(),
            },
          ]);
          if (selectedAdmin?.id === senderId) {
            updateLastMessageInContacts(senderId, prevMessages);
          }
        }
      );

      try {
        await newConnection.start();
        setConnection(newConnection);
      } catch (error) {
        console.error("Error connecting to SignalR:", error);
        toast.error("Failed to connect to the chat server.");
      }
    };

    connectToSignalR();

    // Fetch admin users once on component mount
    fetchAdminUsers();

    // Cleanup SignalR connection on unmount
    return () => {
      connection?.stop();
    };
  }, []); // Empty dependency array to ensure this effect runs only once when the component mounts

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !selectedAdmin) return;

    const messagePayload = {
      receiverId: selectedAdmin.id,
      message: inputMessage,
      sendDate: new Date().toISOString(),
    };

    try {
      const response = await chatService.sendMessage(messagePayload);
      if (response?.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderId: "You",
            message: inputMessage,
            isSender: true,
            sendDate: messagePayload.sendDate,
          },
        ]);
        setInputMessage("");
      }
    } catch (error) {
      toast.error("Error sending message: " + error);
    }
  };

  return (
    <div className="container-fluid m-0 p-0 bg-white">
      {/* Sidebar */}
      <div className="d-flex">
        <div className="w-25" style={{ minWidth: "100px", maxWidth: "250px" }}>
          <div
            className="frame__list-user__chat border-end d-flex flex-column overflow-hidden bg-white"
            style={{ height: "100vh", maxHeight: "100vh" }}
          >
            <InputGroup className="p-2 pb-3 border-1 border-bottom">
              <Form.Control
                placeholder="Search contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
            </InputGroup>
            <ContactList
              contacts={contacts}
              selectedAdmin={selectedAdmin}
              onContactClick={fetchConversation}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-100">
          <div
            className="d-flex flex-column justify-content-between"
            style={{ height: "100vh" }}
          >
            {selectedAdmin ? (
              <>
                {/* Phần chứa tin nhắn, cho phép cuộn */}
                <div
                  className="overflow-auto h-100"
                  // style={{ maxHeight: "calc(100vh - 160px)" }}
                >
                  <MessageList
                    messages={messages}
                    loading={loading}
                    messagesEndRef={messagesEndRef}
                  />
                </div>

                {/* Phần input chat sẽ luôn ở dưới cùng */}
                <div className="bg-white border-top p-3 d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="success"
                    className="ms-2"
                    onClick={handleSendMessage}
                  >
                    <FiSend />
                  </Button>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center flex-grow-1">
                <h5>Select a contact to start chatting</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
