import { SvgIcon } from "@common-module/app-components";

export default class LootIcon extends SvgIcon {
  constructor() {
    super(
      ".loot",
      "0 -960 960 960",
      '<path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z"/>',
    );
  }
}
