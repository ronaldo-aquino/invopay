-- Force PostgREST to refresh schema cache
-- This can be done by calling NOTIFY on a channel that PostgREST listens to
NOTIFY pgrst, 'reload schema';

-- Alternative: Query the tables directly to force cache refresh
SELECT * FROM subscriptions LIMIT 0;
SELECT * FROM subscription_payments LIMIT 0;
SELECT * FROM subscription_cancellations LIMIT 0;

-- Verify tables are accessible
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_payments', 'subscription_cancellations')
ORDER BY table_name;



