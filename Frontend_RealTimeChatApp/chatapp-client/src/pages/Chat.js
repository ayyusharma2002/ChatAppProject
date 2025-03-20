import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socket = useRef(null);
  const backgroundImage = "/assets/chatground.jpg"; 

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:5100/ws/chat");

    socket.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Chat Card */}
      <div
        className="card shadow-lg p-4"
        style={{
          width: "60%",
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-3">Chat Room</h2>
        <div
          className="chat-box border p-3 mb-3"
          style={{
            height: "300px",
            overflowY: "scroll",
            background: "#f8f9fa",
            borderRadius: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="alert alert-secondary">
              {msg}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
