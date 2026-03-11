import { List } from "antd";
import { Message } from "../../types/message";

type Props = {
    message: Message;
    isMe: boolean;
};

export default function ChatMessage({ message, isMe }: Props) {
    return (
        <List.Item className={`chat-message-list-item-${isMe ? `right` : `left`}`} >
            <div className={`chat-message-list-item-message-${isMe ? `right` : `left`}`}>
                {message.message}
            </div>
        </List.Item>
    );
}