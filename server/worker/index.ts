// Render worker entrypoint. Provider schedulers and credentials remain disabled until approved.
console.info(JSON.stringify({ service: 'arena-props-worker', status: 'ready', providersEnabled: false }));
