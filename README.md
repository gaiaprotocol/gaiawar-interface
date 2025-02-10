# Gaia War

```
cd utils
node --loader ts-node/esm ./upgrade-map-data.ts
cd ..
```

## Deploy Edge Function
```
supabase functions deploy api
```

```
deno cache --reload https://raw.githubusercontent.com/yjgaia/wallet-login-module/refs/heads/main/supabase/functions-module/serve-wallet-api.ts
```

## Run dev entrypoint
```
deno run --allow-net --allow-read --watch server/entrypoint-dev.ts
```