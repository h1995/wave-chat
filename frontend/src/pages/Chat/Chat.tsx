import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router";
import { Card, Button, Typography, Space } from "antd";

import ChatMessageList from "../../components/ChatMessageList";
import ChatInput from "../../components/ChatInput";
import { Message } from "../../types/message";

const { Title } = Typography;

export default function Chat({ socket }: { socket: Socket }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const receiveHandler = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    const endHandler = () => {
      alert("Chat ended");
      navigate("/");
    };

    socket.on("receive-message", receiveHandler);
    socket.on("chat-ended", endHandler);

    return () => {
      socket.off("receive-message", receiveHandler);
      socket.off("chat-ended", endHandler);
    };
  }, [socket, navigate]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      from: socket.id || "",
      message: text,
    };

    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const endChat = () => {
    socket.emit("end-chat");
  };

  return (
    <div className="chat-main-div">
      <Card className="chat-main-div-card">
        <Space direction="vertical" className="chat-main-div-card-space" size="large">

          <Title level={4}>Chat with {userId}</Title>

          <ChatMessageList
            messages={messages}
            myId={socket.id}
          />

          <ChatInput
            text={text}
            setText={setText}
            sendMessage={sendMessage}
          />

          <Button danger block onClick={endChat}>
            End Chat
          </Button>

        </Space>
      </Card>
    </div>
  );
}