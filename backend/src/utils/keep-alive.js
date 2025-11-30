/**
 * Keep-Alive Utility for Render Free Tier
 * 
 * Render's free tier spins down services after 15 minutes of inactivity.
 * This utility pings the server every 10 minutes to keep it warm.
 * 
 * Note: This reduces but doesn't eliminate cold starts, as Render may
 * still spin down during very low traffic periods.
 */

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
const HEALTH_ENDPOINT = '/health';

let intervalId = null;

const startKeepAlive = () => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
        console.log('Keep-alive disabled in development mode');
        return;
    }

    console.log('Starting keep-alive service...');
    console.log(`Will ping ${HEALTH_ENDPOINT} every ${PING_INTERVAL / 60000} minutes`);

    // Self-ping function
    const ping = async () => {
        try {
            const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
            const host = process.env.HOST || 'localhost';
            const port = process.env.PORT || 5000;

            // Use the deployed URL if available, otherwise construct from env vars
            const baseUrl = process.env.RENDER_EXTERNAL_URL || `${protocol}://${host}:${port}`;
            const url = `${baseUrl}${HEALTH_ENDPOINT}`;

            const response = await fetch(url);
            const data = await response.json();

            console.log(`[Keep-Alive] Ping successful at ${new Date().toISOString()}`, data);
        } catch (error) {
            console.error('[Keep-Alive] Ping failed:', error.message);
        }
    };

    // Initial ping after 1 minute
    setTimeout(ping, 60000);

    // Set up recurring pings
    intervalId = setInterval(ping, PING_INTERVAL);
};

const stopKeepAlive = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Keep-alive service stopped');
    }
};

module.exports = {
    startKeepAlive,
    stopKeepAlive
};
