import init from "./init.js";

await init({
  isDevMode: true,
  isTestnet: true,

  supabaseUrl: "https://djdupcitqaopbnqzwqqh.supabase.co",
  supabaseKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZHVwY2l0cWFvcGJucXp3cXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODcyNDIsImV4cCI6MjA0NTE2MzI0Mn0.TiEupt3ZsMcEASfYUHOdEy0bBIvzlNfNLEyeugjM-mI",
});
