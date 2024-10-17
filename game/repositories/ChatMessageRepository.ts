import { SupabaseDataRepository } from "@common-module/supabase";
import ChatMessageEntity, {
  ChatMessageQuery,
} from "../entities/ChatMessageEntity.js";

class ChatMessageRepository extends SupabaseDataRepository<ChatMessageEntity> {
  constructor() {
    super("chat_messages", ChatMessageQuery);
  }

  public async fetchMessages(): Promise<ChatMessageEntity[]> {
    return this.fetch((b) => b.order("id", { ascending: false }));
  }
}

export default new ChatMessageRepository();
