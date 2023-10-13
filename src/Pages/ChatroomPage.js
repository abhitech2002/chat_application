import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

const ChatroomPage = ({ match, socket }) => {
    const chatroomId = match.params.id;
    const [messages, setMessages] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const messageRef = useRef();
    const [userId, setUserId] = useState("");
    const [showChatHistory, setShowChatHistory] = useState(false);
    const [loadedMessages, setLoadedMessages] = useState(100); // Number of initially loaded chat history messages

    const sendMessage = () => {
        if (socket) {
            socket.emit("chatroomMessage", {
                chatroomId,
                message: messageRef.current.value,
            });

            messageRef.current.value = "";
        }
    };

    const toggleChatHistory = () => {
        setShowChatHistory(!showChatHistory);
    };

    const loadMoreChatHistory = () => {
        // Increase the number of loaded messages to load more chat history
        setLoadedMessages(loadedMessages + 100);
    };

    useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
        if (socket) {
            socket.on("newMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
            socket.on("chatHistory", (history) => {
                setChatHistory(history);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", {
                chatroomId,
            });
        }

        return () => {
            if (socket) {
                socket.emit("leaveRoom", {
                    chatroomId,
                });
            }
        };
    }, [chatroomId, socket]);

    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                {showChatHistory ? (
                    <div className="chatroomContent chatHistory">
                        {chatHistory.slice(0, loadedMessages).map((message, i) => (
                            <div key={i} className="message">
                                <span className="otherMessage">{message.name}:</span> {message.message}
                            </div>
                        ))}
                        {loadedMessages < chatHistory.length && (
                            <button className="loadMoreHistory" onClick={loadMoreChatHistory}>
                                Load More
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="chatroomContent">
                        {messages.map((message, i) => (
                            <div key={i} className="message">
                                <span className={userId === message.userId ? "ownMessage" : "otherMessage"}>
                                    {message.name}:
                                </span>{" "}
                                {message.message}
                            </div>
                        ))}
                    </div>
                )}
                <div className="chatroomActions">
                    <div>
                        <input type="text" name="message" placeholder="Say something!" ref={messageRef} />
                    </div>
                    <div>
                        <button className="join" onClick={sendMessage}>
                            Send
                        </button>
                        <button className="history" onClick={toggleChatHistory}>
                            History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(ChatroomPage);
