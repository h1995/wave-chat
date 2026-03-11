import { Input, Button, Space } from "antd";

type Props = {
    text: string;
    setText: (value: string) => void;
    sendMessage: () => void;
};

export default function ChatInput({ text, setText, sendMessage }: Props) {
    return (
        <Space.Compact className="chat-input-main-space-compact">
            <Input
                placeholder="Type message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPressEnter={sendMessage}
            />
            <Button type="primary" onClick={sendMessage}>
                Send
            </Button>
        </Space.Compact>
    );
}