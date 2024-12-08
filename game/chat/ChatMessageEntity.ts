export default interface ChatMessageEntity {
  id: number;
  sender: string;
  content: string;
  created_at: string;
}

export const ChatMessageQuery = "id, sender, content, created_at";
