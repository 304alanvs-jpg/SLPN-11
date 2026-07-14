# SLPN1 NOVA

Nowa wersja portalu: bez herbów klubowych, z prawdziwym OAuth Discord i Roblox oraz panelem właściciela do dodawania zawodników i przyznawania nagród.

## Uruchomienie lokalne
1. `npm install`
2. Skopiuj `.env.example` do `.env.local`
3. Uzupełnij zmienne
4. `npm run dev`

## Discord OAuth
W Discord Developer Portal utwórz aplikację. W OAuth2 dodaj redirect:
`http://localhost:3000/api/auth/discord/callback`
Dla produkcji dodaj też:
`https://TWOJA-DOMENA/api/auth/discord/callback`
Ustaw `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` i swoje Discord User ID jako `DISCORD_OWNER_ID`.

## Roblox OAuth
W Creator Dashboard zarejestruj aplikację OAuth 2.0 ze scope `openid profile`. Dodaj redirect:
`http://localhost:3000/api/auth/roblox/callback`
Dla produkcji:
`https://TWOJA-DOMENA/api/auth/roblox/callback`
Ustaw `ROBLOX_CLIENT_ID`, `ROBLOX_CLIENT_SECRET` i swoje Roblox User ID jako `ROBLOX_OWNER_ID`.

## Vercel
Importuj repozytorium, a w Settings → Environment Variables dodaj wszystkie wartości z `.env.example`. `APP_URL` ustaw na pełną domenę produkcyjną. Po zmianie zmiennych zrób Redeploy.

## Ważne
Zawodnicy i nagrody są w tej wersji zapisywani w localStorage przeglądarki. OAuth jest prawdziwy i działa serwerowo, ale wspólna baza danych dla wszystkich użytkowników wymaga kolejnego kroku, np. Supabase.
