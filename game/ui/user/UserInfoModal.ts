import { el } from "@common-module/app";
import {
  AppCompConfig,
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { PersonaDisplay, PersonaRepository } from "gaiaprotocol";

export default class UserInfoModal extends StructuredModal {
  constructor(address: string) {
    super(".user-info-modal");
    this.appendToHeader(el("h2", "User Info"));
    this.loadPersona(address);
  }

  private async loadPersona(walletAddress: string) {
    const loginUser = WalletLoginManager.getLoggedInAddress();

    const loadingSpinner = new AppCompConfig.LoadingSpinner();
    this.appendToMain(loadingSpinner);

    const persona = await PersonaRepository.fetchPersona(walletAddress);

    loadingSpinner.remove();

    if (!persona) {
      this.appendToMain(el(".no-persona", "No persona found"));
      if (loginUser === walletAddress) {
        this.appendToFooter(
          new Button({
            type: ButtonType.Contained,
            title: "Create Persona",
            onClick: () =>
              window.open("https://personas.gaia.cc/onboarding", "_blank"),
          }),
        );
      }
    } else {
      this.appendToMain(
        new PersonaDisplay({
          persona,
          showEditButton: persona.wallet_address === loginUser,
          onEditClick: () =>
            window.open("https://personas.gaia.cc/edit-persona", "_blank"),
        }),
        el(
          ".powered-by",
          "Powered by ",
          el("a", "Gaia Personas", {
            href: "https://personas.gaia.cc",
            target: "_blank",
          }),
        ),
      );
    }
  }
}
