import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { XIcon } from "@gaiaprotocol/svg-icons";

export default class Intro extends DomNode {
  constructor() {
    super(".intro");
    this.append(
      el("header", el("h1", "Gaia War")),
      el(
        "main",
        new Button({
          type: ButtonType.Contained,
          title: "Login with Wallet",
          onClick: () => WalletLoginManager.login(),
        }),
      ),
      el(
        "footer",
        el(
          ".credit",
          "Created by ",
          el("a", "Gaia Protocol", {
            href: "https://gaiaprotocol.com",
            target: "_blank",
          }),
        ),
        el(
          ".social",
          el(
            "a",
            new XIcon(),
            {
              href: "https://x.com/GaiaWarGame",
              target: "_blank",
            },
          ),
        ),
      ),
    );
  }
}
