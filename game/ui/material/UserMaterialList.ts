import { DomNode } from "@common-module/app";
import UserMaterialListItem from "./UserMaterialListItem.js";

export default class UserMaterialList extends DomNode {
  public children: UserMaterialListItem[] = [];

  constructor() {
    super(".user-material-list");
    this.append(
      new UserMaterialListItem("wood"),
      new UserMaterialListItem("stone"),
      new UserMaterialListItem("iron"),
      new UserMaterialListItem("ducat"),
    );
  }
}
