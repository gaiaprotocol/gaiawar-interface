## Deploy Edge Function

```
supabase secrets set --env-file ./supabase/.env

supabase functions deploy inject-login-credentials
supabase functions deploy send-chat-message
```
