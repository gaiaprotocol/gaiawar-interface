import init from "./init.js";

await init({
  isDevMode: false,
  isTestnet: false,

  supabaseUrl: "",
  supabaseKey: "",

  walletConnectProjectId: "ddff9be202fe7448ae8d398034514a4d",
});
