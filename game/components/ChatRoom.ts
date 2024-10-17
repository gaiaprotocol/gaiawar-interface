import { DomNode } from "@common-module/app";
import { SupabaseConnector } from "@common-module/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import ChatMessageEntity from "../entities/ChatMessageEntity.js";
import ChatMessageRepository from "../repositories/ChatMessageRepository.js";

export default class ChatRoom extends DomNode {
  private chatMessageChannel: RealtimeChannel;

  constructor() {
    super(".chat-room");
    this.append();

    this.chatMessageChannel = SupabaseConnector.subscribeToDataChanges<
      ChatMessageEntity
    >({
      channel: "chat-messages-changes",
      table: "chat_messages",
    });

    this.loadMessages();
  }

  private async loadMessages() {
    const messages = await ChatMessageRepository.fetchMessages();
    for (const message of messages) {
      //TODO:
    }
  }

  public remove(): void {
    this.chatMessageChannel.unsubscribe();
    super.remove();
  }
}
