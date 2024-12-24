import { Fadeable, SFXPlayer, Sprite } from "@gaiaengine/2d";
import { BuildingMetadata } from "../../data/building/BuildingData.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileFaction from "../../data/tile/TileFaction.js";

export default class Building extends Fadeable {
  private metadata: BuildingMetadata | undefined;

  constructor(faction: TileFaction, buildingId: number) {
    super(0, 0);
    this.metadata = BuildingManager.getBuildingMetadata(buildingId);
    if (this.metadata) {
      this.append(
        new Sprite(0, 0, `/assets/buildings/${this.metadata.sprites.base}`),
        new Sprite(0, 0, `/assets/buildings/${this.metadata.sprites[faction]}`),
      );
      this.fadeIn(0.2);
    }
  }

  public playSelectEffect() {
    if (this.metadata?.sfx.select) {
      SFXPlayer.play(`/assets/sfx/buildings/${this.metadata.sfx.select}`);
    }
  }

  public destroy() {
    if (this.metadata?.sfx.destroy) {
      SFXPlayer.play(`/assets/sfx/buildings/${this.metadata.sfx.destroy}`);
    }
    this.fadeOut(0.2, () => this.remove());
  }
}
