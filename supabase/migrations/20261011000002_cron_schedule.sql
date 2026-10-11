-- ============================================================================
-- BACKED / PROOF-ID — AUTOMATED DAILY ANALYTICS CRON SCHEDULE (pg_cron + pg_net)
-- Runs nightly at 00:05 UTC with secret-authenticated HTTP webhook.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove previous scheduled job if exists to remain idempotent
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-analytics-rollup') THEN
        PERFORM cron.unschedule('daily-analytics-rollup');
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Register cron job to invoke aggregate-analytics edge function
SELECT cron.schedule(
    'daily-analytics-rollup',
    '5 0 * * *',
    $$
    SELECT net.http_post(
        url := 'https://yvzfmfpzhanwlxstdmkk.supabase.co/functions/v1/aggregate-analytics',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', 'c8f7e2a9b4d160e3a5f82c7d9e1b4a6f'
        ),
        body := '{}'::jsonb
    );
    $$
);
