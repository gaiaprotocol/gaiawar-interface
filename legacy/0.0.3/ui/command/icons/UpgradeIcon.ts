import { SvgIcon } from "@common-module/app-components";

export default class UpgradeIcon extends SvgIcon {
  constructor() {
    super(
      ".upgrade",
      "0 -960 960 960",
      '<path d="M280-160v-80h400v80H280Zm160-160v-327L336-544l-56-56 200-200 200 200-56 56-104-103v327h-80Z"/>',
    );
  }
}
