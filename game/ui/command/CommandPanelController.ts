import { DomNode } from "@common-module/app";
import BuildingCommandPanel from "./BuildingCommandPanel.js";
import WorldCommandPanel from "./WorldCommandPanel.js";

class CommandPanelController {
  private panelContainer: DomNode | undefined;

  public setPanelContainer(container: DomNode) {
    this.panelContainer = container;
    this.changePanel("world");
  }

  public changePanel(
    type: "world" | "player-building" | "enemy-building",
    data?: any,
  ) {
    if (!this.panelContainer) return;

    this.panelContainer.clear();

    if (type === "world") this.panelContainer.append(new WorldCommandPanel());
    else if (type === "player-building") {
      this.panelContainer.append(new BuildingCommandPanel(data.buildingId));
    }
  }
}

export default new CommandPanelController();
