import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import {
  ChatMessageForm,
  ChatMessageList,
} from "@common-module/social-components";
import { CollapseIcon, ExpandIcon } from "@gaiaprotocol/svg-icons";
import ChatMessageRepository from "../chat/ChatMessageRepository.js";
import GameConfig from "../GameConfig.js";

export default class ChatRoom extends DomNode {
  private messageList: ChatMessageList;

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

    this.loadMessages();
  }

  private async loadMessages() {
    const messages = await ChatMessageRepository.fetchMessages();
    for (const message of messages) {
    }
  }

  private async sendMessage(content: string) {
    const messageId = await GameConfig.supabaseConnector.callEdgeFunction(
      "send-chat-message",
      { content },
    );
    console.log(messageId);
  }
}
