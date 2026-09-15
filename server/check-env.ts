// Report presence only. Never print credentials, lengths, prefixes or URLs.
const providerKeys = ['BALLDONTLIE_API_KEY', 'THE_ODDS_API_KEY', 'THESPORTSDB_API_KEY'] as const;
const databaseKeys = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

for (const key of providerKeys) {
  console.info(`${key}: ${process.env[key]?.trim() ? 'configured' : 'missing'}`);
}
for (const key of databaseKeys) {
  console.info(`${key}: ${process.env[key]?.trim() ? 'configured' : 'not configured (later)'}`);
}
console.info('Presence check only; no API calls or credential validation performed.');
if (providerKeys.some((key) => !process.env[key]?.trim())) process.exitCode = 1;
