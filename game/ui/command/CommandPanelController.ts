import { DomNode } from "@common-module/app";
import { Coordinates } from "@gaiaengine/2d";
import TileCommandPanel from "./TileCommandPanel.js";
import WorldCommandPanel from "./WorldCommandPanel.js";

class CommandPanelController {
  private panelContainer: DomNode | undefined;

  public setPanelContainer(container: DomNode) {
    this.panelContainer = container;
    this.changeToWorldPanel();
  }

  public changeToWorldPanel() {
    this.panelContainer?.clear().append(new WorldCommandPanel());
  }

  public changeToTilePanel(position: Coordinates) {
    this.panelContainer?.clear().append(new TileCommandPanel(position));
  }
}

export default new CommandPanelController();
