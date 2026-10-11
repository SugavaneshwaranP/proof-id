#!/usr/bin/env bash
# ============================================================================
# BACKED / PROOF-ID — DEPLOY PRIVILEGED EDGE FUNCTIONS
# Deploys all 5 hardened Edge Functions to Supabase
# ============================================================================

set -e

echo "[1/6] Setting environment secrets..."
npx supabase secrets set --env-file supabase/.env.secrets

echo "[2/6] Deploying moderate-action..."
npx supabase functions deploy moderate-action

echo "[3/6] Deploying generate-upload-url..."
npx supabase functions deploy generate-upload-url

echo "[4/6] Deploying send-verification-email..."
npx supabase functions deploy send-verification-email

echo "[5/6] Deploying delete-account..."
npx supabase functions deploy delete-account

echo "[6/6] Deploying aggregate-analytics..."
npx supabase functions deploy aggregate-analytics --no-verify-jwt

echo "All 5 Edge Functions successfully deployed and hardened!"
