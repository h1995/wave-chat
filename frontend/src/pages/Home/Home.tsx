import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import { Card, Input, Button, Typography, Space } from "antd";

const { Title, Text } = Typography;

export default function Home({ socket }: { socket: Socket }) {
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    if (socket.connected) {
      setMyId(socket.id || "");
    }

    socket.on("connect", () => {
      setMyId(socket.id || "");
    });

    socket.on("chat-start", () => {
      navigate(`/chat/${targetId}`);
    });


    socket.on("incoming-chat", ({ from }) => {
      navigate(`/chat/${from}`);
    });

    socket.on("user-not-found", () => {
      alert("User not found");
    });

    return () => {
      socket.off("connect");
      socket.off("chat-start");
      socket.off("incoming-chat");
      socket.off("user-not-found");
    };
  }, [socket, targetId, navigate]);

  const connectUser = () => {
    if (!targetId) return;

    socket.emit("connect-user", {
      targetId,
    });
  };

  return (
    <div className="home-main-div">
      <Card className="home-main-div-card">
        <Space className="home-main-div-card-space" direction="vertical" size="large">

          <Title level={3}>Chat App</Title>

          <div>
            <Text type="secondary">Your ID</Text>
            <br />
            <Text copyable strong>
              {myId}
            </Text>
          </div>

          <Input
            placeholder="Enter user ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />

          <Button
            type="primary"
            block
            onClick={connectUser}
            disabled={!targetId}
          >
            Connect
          </Button>

        </Space>
      </Card>
    </div>
  );
}