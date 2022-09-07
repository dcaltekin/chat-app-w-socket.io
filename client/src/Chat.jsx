import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./App.css";
import { IoMdSend } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [messages, setMessages] = useState(false);
  const [count, setCount] = useState(0);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      setMessages(true);
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
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

  useEffect(() => {
    socket.on("roomData", (count) => {
      setCount(count);
    });
  }, []);
  return (
    <div className="chat-window">
      Online users: {count}
      <p>
        Room ID: {room} as {username}
      </p>
      <div className="chat-header">
        {messages ? (
          <p>
            <AiFillMessage className="icon" size={25} /> Total messages: (
            {messageList.length})
          </p>
        ) : (
          <p>
            <AiFillMessage className="icon" size={25} /> There is no message
            yet!
          </p>
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
