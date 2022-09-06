import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./App.css";
import { IoMdSend } from "react-icons/io";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [messages, setMessages] = useState(false);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      setMessages(true);
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  return (
    <div className="chat-window">
      <p>
        Room ID: {room} as {username}
      </p>
      <div className="chat-header">
        {messages ? (
          <p>Total messages: ({messageList.length})</p>
        ) : (
          <p>There is no message yet!</p>
        )}
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    {messageContent.message}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Send to Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <IoMdSend size={25} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
