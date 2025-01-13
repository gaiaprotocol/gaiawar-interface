export default interface ChatMessageEntity {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

export const ChatMessageQuery = "id, author, content, created_at";
