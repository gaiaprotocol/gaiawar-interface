import { DomNode } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { LoggedInUserAvatarButton } from "@common-module/social-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { MapIcon } from "@gaiaprotocol/svg-icons";
import ChatRoom from "./ChatRoom.js";
import CommandPanel from "./command/CommandPanel.js";
import HistoryPanel from "./history/HistoryPanel.js";
import UserMaterialList from "./material/UserMaterialList.js";
import WorldMapModal from "./worldmap/WorldMapModal.js";

export default class HUD extends DomNode {
  private chatRoom: ChatRoom;
  private commandPanel: CommandPanel;
  private historyPanel: HistoryPanel;

  constructor() {
    super(".hud");
    this.append(
      new UserMaterialList(),
      new LoggedInUserAvatarButton(WalletLoginManager),
      new Button(".world-map", {
        type: ButtonType.Circle,
        icon: new MapIcon(),
        onClick: () => new WorldMapModal(),
      }),
      this.chatRoom = new ChatRoom(),
      this.commandPanel = new CommandPanel(),
      this.historyPanel = new HistoryPanel(),
    );

    this.onWindow("resize", () => this.updateLayout());
    this.updateLayout();
  }

  private updateLayout() {
    if (document.documentElement.clientWidth < 1280) {
      this.commandPanel.style({ bottom: "40px" });
    } else {
      this.commandPanel.style({ bottom: "14px" });
    }
  }
}
