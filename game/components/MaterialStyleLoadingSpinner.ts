import { DomNode } from "@common-module/app";

export default class MaterialStyleLoadingSpinner extends DomNode {
  constructor() {
    super(".loading-spinner");
    this.htmlElement.innerHTML =
      `<svg width="24px" height="24px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
   <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
</svg>`;
  }
}
