import { DomNode, el } from "@common-module/app";
import {
  ChatMessageForm,
  ChatMessageList,
} from "@common-module/social-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { RealtimeChannel } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import GameConfig from "../config/GaiaWarConfig.js";
import ChatMessageEntity from "../data/chat/ChatMessageEntity.js";
import ChatMessageRepository from "../data/chat/ChatMessageRepository.js";

export default class ChatRoom extends DomNode {
  private chatMessageChannel: RealtimeChannel;
  private messageList: ChatMessageList;
  private tempMessages: { id: string; content: string }[] = [];

  private isScrolling = false;
  private fontLoadingPromise: Promise<void>;

  constructor() {
    super(".chat-room");

    this.append(
      el(
        "header",
        el("h2", "Chat Room"),
        /*el(
          ".button-container",
          new Button({
            type: ButtonType.Circle,
            icon: new CollapseIcon(),
          }),
          new Button({
            type: ButtonType.Circle,
            icon: new ExpandIcon(),
          }),
        ),*/
      ),
      el(
        "main",
        this.messageList = new ChatMessageList(),
        new ChatMessageForm((content) => this.sendMessage(content)),
      ),
    );

    this.chatMessageChannel = GameConfig.supabaseConnector
      .subscribeToDataChanges<ChatMessageEntity>("chat-messages-changes", {
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

            // Scroll to bottom after adding a new message
            this.scrollToBottom();
          }
        },
      });

    this.fontLoadingPromise = this.waitForFontsToLoad();
  }

  private async waitForFontsToLoad(): Promise<void> {
    if ("fonts" in document) {
      try {
        // Wait for all fonts to load
        await document.fonts.ready;
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Fallback in case of error
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } else {
      // Fallback for browsers that don't support document.fonts
      console.warn("document.fonts not supported. Using fallback timeout.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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
    this.scrollToBottom();
  }

  private async scrollToBottom(): Promise<void> {
    if (this.isScrolling) return;

    this.isScrolling = true;

    try {
      // Immediate scroll
      this.performScroll();

      // Wait for fonts and scroll again
      await this.fontLoadingPromise;
      this.performScroll();
    } finally {
      this.isScrolling = false;
    }
  }

  private performScroll(): void {
    // Use requestAnimationFrame to ensure the DOM has updated before scrolling
    requestAnimationFrame(() => {
      this.messageList.htmlElement.scrollTop =
        this.messageList.htmlElement.scrollHeight;
    });
  }

  private sendMessage(content: string) {
    ChatMessageRepository.sendMessage(content);

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

      // Scroll to bottom after adding a new message
      this.scrollToBottom();
    }
  }

  public remove(): void {
    this.chatMessageChannel.unsubscribe();
    super.remove();
  }
}
