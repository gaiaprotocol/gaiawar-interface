"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[353],{4306:(e,t,o)=>{o.r(t),o.d(t,{W3mModal:()=>c});var i=o(9280),n=o(1428),s=o(2169),a=o(5219);const r=s.iv`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation-duration: 0.2s;
    animation-name: zoom-in;
    animation-fill-mode: backwards;
    animation-timing-function: var(--wui-ease-out-power-2);
    outline: none;
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation-name: slide-in;
    }
  }
`;var l=function(e,t,o,i){var n,s=arguments.length,a=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(s<3?n(a):s>3?n(t,o,a):n(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};const d="scroll-lock";let c=class extends s.oi{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.open=i.IN.state.open,this.caipAddress=i.AccountController.state.caipAddress,this.isSiweEnabled=i.OptionsController.state.isSiweEnabled,this.connected=i.AccountController.state.isConnected,this.loading=i.IN.state.loading,this.initializeTheming(),i.ApiController.prefetch(),this.unsubscribe.push(i.IN.subscribeKey("open",(e=>e?this.onOpen():this.onClose())),i.IN.subscribeKey("loading",(e=>{this.loading=e,this.onNewAddress(i.AccountController.state.caipAddress)})),i.AccountController.subscribeKey("isConnected",(e=>this.connected=e)),i.AccountController.subscribeKey("caipAddress",(e=>this.onNewAddress(e))),i.OptionsController.subscribeKey("isSiweEnabled",(e=>this.isSiweEnabled=e))),i.Xs.sendEvent({type:"track",event:"MODAL_LOADED"})}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),this.onRemoveKeyboardListener()}render(){return this.open?s.dy`
          <wui-flex @click=${this.onOverlayClick.bind(this)}>
            <wui-card role="alertdialog" aria-modal="true" tabindex="0">
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
            </wui-card>
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){if(this.isSiweEnabled){const{SIWEController:e}=await o.e(164).then(o.bind(o,1164));"success"!==e.state.status&&this.connected&&await i.ConnectionController.disconnect()}i.IN.close()}initializeTheming(){const{themeVariables:e,themeMode:t}=i.ThemeController.state,o=n.UiHelperUtil.getColorTheme(t);(0,n.initializeTheming)(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),i.SnackController.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=d,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${d}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",(t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){const{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}}),this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){if(!this.connected||this.loading)return;const t=i.j1.getPlainAddress(this.caipAddress),n=i.j1.getPlainAddress(e),s=i.j1.getNetworkId(this.caipAddress),a=i.j1.getNetworkId(e);if(this.caipAddress=e,this.isSiweEnabled){const{SIWEController:e}=await o.e(164).then(o.bind(o,1164)),i=await e.getSession();if(i&&t&&n&&t!==n)return void(e.state._client?.options.signOutOnAccountChange&&(await e.signOut(),this.onSiweNavigation()));if(i&&s&&a&&s!==a)return void(e.state._client?.options.signOutOnNetworkChange&&(await e.signOut(),this.onSiweNavigation()));this.onSiweNavigation()}}onSiweNavigation(){this.open?i.RouterController.push("ConnectingSiwe"):i.IN.open({view:"ConnectingSiwe"})}};c.styles=r,l([(0,a.SB)()],c.prototype,"open",void 0),l([(0,a.SB)()],c.prototype,"caipAddress",void 0),l([(0,a.SB)()],c.prototype,"isSiweEnabled",void 0),l([(0,a.SB)()],c.prototype,"connected",void 0),l([(0,a.SB)()],c.prototype,"loading",void 0),c=l([(0,n.customElement)("w3m-modal")],c)}}]);