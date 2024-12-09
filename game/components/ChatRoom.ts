import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import {
  ChatMessageForm,
  ChatMessageList,
} from "@common-module/social-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { CollapseIcon, ExpandIcon } from "@gaiaprotocol/svg-icons";
import { RealtimeChannel } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import ChatMessageEntity from "../chat/ChatMessageEntity.js";
import ChatMessageRepository from "../chat/ChatMessageRepository.js";
import GameConfig from "../GameConfig.js";

const clientId = Date.now() % 32767;

export default class ChatRoom extends DomNode {
  private chatMessageChannel: RealtimeChannel;
  private messageList: ChatMessageList;
  private tempMessages: { id: string; content: string }[] = [];

  constructor() {
    super(".chat-room");

    this.append(
      el(
        "header",
        el("h2", "Chat Room"),
        el(
          ".button-container",
          new Button({
            type: ButtonType.Circle,
            icon: new CollapseIcon(),
          }),
          new Button({
            type: ButtonType.Circle,
            icon: new ExpandIcon(),
          }),
        ),
      ),
      el(
        "main",
        this.messageList = new ChatMessageList(),
        new ChatMessageForm((content) => this.sendMessage(content)),
      ),
    );

    this.chatMessageChannel = GameConfig.supabaseConnector
      .subscribeToDataChanges<ChatMessageEntity>({
        channel: "chat-messages-changes",
        table: "chat_messages",
        onSubscribe: () => this.loadMessages(),
        onInsert: (m) => {
          const index = this.tempMessages.findIndex((tm) =>
            tm.content === m.content
          );
          if (index !== -1) {
            this.messageList.updateMessage(this.tempMessages[index].id, {
              id: m.id.toString(),
              sender: m.sender,
              content: m.content,
              createdAt: m.created_at,
            });
            this.tempMessages.splice(index, 1);
          } else {
            this.messageList.addMessage({
              id: m.id.toString(),
              sender: m.sender,
              content: m.content,
              createdAt: m.created_at,
            });
          }
        },
      });
  }

  private async loadMessages() {
    const messages = await ChatMessageRepository.fetchMessages();
    this.messageList.setMessages(
      messages.reverse().map((m) => ({
        id: m.id.toString(),
        sender: m.sender,
        content: m.content,
        createdAt: m.created_at,
      })),
    );
  }

  private sendMessage(content: string) {
    GameConfig.supabaseConnector.callEdgeFunction(
      "send-chat-message",
      { content, clientId },
    );

    const sender = WalletLoginManager.getLoggedInAddress();
    if (sender) {
      const tempMessageId = uuidv4();
      this.tempMessages.push({ id: tempMessageId, content });
      this.messageList.addMessage({
        id: tempMessageId,
        sender,
        content,
        createdAt: new Date().toISOString(),
        isTemp: true,
      });
    }
  }

  public remove(): void {
    this.chatMessageChannel.unsubscribe();
    super.remove();
  }
}
