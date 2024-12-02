import init from "./init.js";

await init({
  isDevMode: true,
  isTestnet: true,

  supabaseUrl: "https://itqgxihqmbuqpbuduktk.supabase.co",
  supabaseKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cWd4aWhxbWJ1cXBidWR1a3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwNzM4ODgsImV4cCI6MjA0MjY0OTg4OH0.ZXKwLDmBweWHCMEFVRKcdr9n2M6sD9wjTPryUIgnrQk",

  walletConnectProjectId: "ddff9be202fe7448ae8d398034514a4d",
});
