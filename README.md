# Gaia War

```
cd utils
node --loader ts-node/esm ./package-tiles.ts
cd ..
```

```
cd utils
node --loader ts-node/esm ./generate-map.ts
cd ..
```

```
cd utils
node --loader ts-node/esm ./package-units.ts
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