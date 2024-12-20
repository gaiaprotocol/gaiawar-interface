import { DomNode } from "@common-module/app";
import TileCommandPanel from "./TileCommandPanel.js";
import WorldCommandPanel from "./WorldCommandPanel.js";

class CommandPanelController {
  private panelContainer: DomNode | undefined;

  public setPanelContainer(container: DomNode) {
    this.panelContainer = container;
    this.changePanel("world");
  }

  public changePanel(
    type: "world" | "tile",
    data?: any,
  ) {
    if (!this.panelContainer) return;

    this.panelContainer.clear();

    if (type === "world") this.panelContainer.append(new WorldCommandPanel());
    else if (type === "tile") {
      this.panelContainer.append(
        new TileCommandPanel(data.coordinates, data.tileData),
      );
    }
  }
}

export default new CommandPanelController();
