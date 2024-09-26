# Gaia War

```
cd utils
node --loader ts-node/esm ./package-tiles.ts
node --loader ts-node/esm ./generate-map.ts
```

## Deploy Edge Function
```
supabase functions deploy api
```

```
deno cache --reload https://raw.githubusercontent.com/yjgaia/wallet-login-module/refs/heads/main/supabase/functions-module/serve-wallet-api.ts
```