import { List } from "antd";
import ChatMessage from "../ChatMessage";
import { Message } from "../../types/message";
import { useEffect, useRef } from "react";

type Props = {
    messages: Message[];
    myId?: string;
};

export default function ChatMessageList({ messages, myId }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const nearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (nearBottom) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div
            className="chat-message-list-main-div"
            ref={containerRef}
        >
            <List
                dataSource={messages}
                renderItem={(m) => (
                    <ChatMessage
                        message={m}
                        isMe={m.from === myId}
                    />
                )}
            />

            <div ref={bottomRef}></div>
        </div>
    );
}