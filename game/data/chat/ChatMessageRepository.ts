import { SupabaseDataRepository } from "@common-module/supabase";
import GameConfig from "../../config/GaiaWarConfig.js";
import ChatMessageEntity, { ChatMessageQuery } from "./ChatMessageEntity.js";

const clientId = Date.now() % 32767;

class ChatMessageRepository extends SupabaseDataRepository<ChatMessageEntity> {
  constructor() {
    super("chat_messages", ChatMessageQuery);
  }

  public async sendMessage(content: string): Promise<void> {
    await GameConfig.supabaseConnector.callEdgeFunction(
      "send-chat-message",
      { content, clientId },
    );
  }

  public async fetchMessages(): Promise<ChatMessageEntity[]> {
    return this.fetch((b) => b.order("id", { ascending: false }));
  }
}

export default new ChatMessageRepository();
