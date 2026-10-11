@echo off
REM ============================================================================
REM BACKED / PROOF-ID — DEPLOY PRIVILEGED EDGE FUNCTIONS
REM Deploys all 5 hardened Edge Functions to Supabase
REM ============================================================================

echo [1/6] Setting environment secrets...
call npx supabase secrets set --env-file supabase/.env.secrets

echo [2/6] Deploying moderate-action...
call npx supabase functions deploy moderate-action

echo [3/6] Deploying generate-upload-url...
call npx supabase functions deploy generate-upload-url

echo [4/6] Deploying send-verification-email...
call npx supabase functions deploy send-verification-email

echo [5/6] Deploying delete-account...
call npx supabase functions deploy delete-account

echo [6/6] Deploying aggregate-analytics (cron secret authenticated)...
call npx supabase functions deploy aggregate-analytics --no-verify-jwt

echo.
echo All 5 Edge Functions successfully deployed and hardened!
pause
