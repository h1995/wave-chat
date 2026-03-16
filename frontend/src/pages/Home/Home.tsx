import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import { Card, Input, Button, Typography, Space } from "antd";

const { Title, Text } = Typography;

export default function Home({ socket }: { socket: Socket }) {

  const [username, setUsername] = useState("");
  const [targetUsername, setTargetUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    socket.on("chat-start", () => {
      navigate(`/chat/${targetUsername}`);
    });

    socket.on("incoming-chat", ({ from }) => {
      navigate(`/chat/${from}`);
    });

    socket.on("user-not-found", () => {
      alert("User not found");
    });

    return () => {
      socket.off("chat-start");
      socket.off("incoming-chat");
      socket.off("user-not-found");
    };

  }, [socket, targetUsername, navigate]);


  const joinChat = () => {

    if (!username) return;

    socket.emit("join", {
      username,
    });

    setJoined(true);
  };


  const connectUser = () => {

    if (!targetUsername) return;

    socket.emit("connect-user", {
      targetUsername,
    });

  };


  return (
    <div className="home-main-div">

      <Card className="home-main-div-card">

        <Space className="home-main-div-card-space" direction="vertical" size="large">

          <Title level={3}>Chat App</Title>

          {!joined && (
            <>
              <div>
                <Text type="secondary">Enter Your Name</Text>
              </div>

              <Input
                placeholder="Your username"
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
              />

              <Button
                type="primary"
                block
                onClick={joinChat}
                disabled={!username}
              >
                Join Chat
              </Button>
            </>
          )}

          {joined && (
            <>
              <div>
                <Text type="secondary">
                  Logged in as: <strong>{username}</strong>
                </Text>
              </div>

              <Input
                placeholder="Enter username to connect"
                value={targetUsername}
                onChange={(e: any) => setTargetUsername(e.target.value)}
              />

              <Button
                type="primary"
                block
                onClick={connectUser}
                disabled={!targetUsername}
              >
                Connect
              </Button>
            </>
          )}

        </Space>

      </Card>

    </div>
  );
}
