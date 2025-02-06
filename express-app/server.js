const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

// Configure Redis
const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis(redisHost);

const app = express();

// CORS Options
const corsOptions = {
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Logging middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Function to map expiration strings to seconds
const mapExpirationToSeconds = (expirationInDays) => {
    switch (expirationInDays) {
        case '30 minutes':
            return 30 * 60;
        case '1 hour':
            return 60 * 60;
        case '1 day':
            return 24 * 60 * 60;
        case '7 days':
            return 7 * 24 * 60 * 60;
        case '14 days':
            return 14 * 24 * 60 * 60;
        default:
            return null;
    }
};

// Namespace prefix for Redis keys
const redisNamespace = 'onetimesecret:';

// Create a secret
app.post('/api/secrets', async (req, res) => {
    const { secret, passphrase, expirationInDays } = req.body;
    
    if (!secret) {
        return res.status(400).json({ message: 'Secret is required' });
    }

    const uuid = uuidv4();
    const expiryTime = mapExpirationToSeconds(expirationInDays);

    try {
        const secretData = { secret, passphrase }; // Store secret with passphrase
        const redisKey = `${redisNamespace}${uuid}`; // Append the namespace prefix
        if (expiryTime) {
            await redis.set(redisKey, JSON.stringify(secretData), 'EX', expiryTime);
        } else {
            await redis.set(redisKey, JSON.stringify(secretData));
        }
        res.status(201).json({ uuid }); // Send back the UUID without the prefix
    } catch (error) {
        console.error('Error saving secret:', error);
        res.status(500).json({ message: 'Error saving secret', error: error.message });
    }
});

/// Retrieve a secret (check if passphrase is required)
app.get('/api/secrets/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const redisKey = `${redisNamespace}${uuid}`; // Add the namespace prefix
    const accessedKey = `${redisNamespace}${uuid}:accessed`; // Key to track access status

    try {
        const secretData = await redis.get(redisKey);
        const accessed = await redis.get(accessedKey); // Check if already accessed

        if (accessed) {
            return res.status(403).json({ message: 'This secret has already been accessed.' });
        }

        if (secretData) {
            const { secret, passphrase } = JSON.parse(secretData);

            // If a passphrase exists, don't return the secret, only indicate that it's required
            if (passphrase) {
                res.json({ passphraseRequired: true });
            } else {
                await redis.set(accessedKey, 'true'); // Mark as accessed
                await redis.del(redisKey); // Remove from Redis after retrieval
                res.json({ secret, passphraseRequired: false });
            }
        } else {
            res.status(404).json({ message: 'Secret not found' });
        }
    } catch (error) {
        console.error('Error retrieving secret:', error);
        res.status(500).json({ message: 'Error retrieving secret' });
    }
});

// Verify passphrase for a secret
app.post('/api/secrets/verify-passphrase/:uuid', async (req, res) => {
    const { uuid, passphrase } = req.params;
    const redisKey = `${redisNamespace}${uuid}`;

    try {
        const secretData = await redis.get(redisKey);
        if (secretData) {
            const { secret, passphrase: storedPassphrase } = JSON.parse(secretData);

            // If the passphrase matches, return the secret and delete the key
            if (passphrase === storedPassphrase) {
                await redis.del(redisKey); // Remove from Redis after verification
                return res.json({ secret }); // Return the secret
            } else {
                return res.status(403).json({ message: 'Incorrect passphrase' });
            }
        } else {
            return res.status(404).json({ message: 'No secret found with this token' });
        }
    } catch (error) {
        console.error('Error verifying passphrase:', error);
        res.status(500).json({ message: 'Error verifying passphrase', error: error.message });
    }
});

// Burn a secret
app.delete('/api/secrets/burn/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const redisKey = `${redisNamespace}${uuid}`;

    try {
        const result = await redis.del(redisKey);
        if (result === 1) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).json({ message: 'Secret not found or already burned' });
        }
    } catch (error) {
        console.error('Error burning secret:', error);
        res.status(500).json({ message: 'Error burning secret', error: error.message });
    }
});

// Check if a secret has been accessed
app.get('/api/secrets/:uuid/accessed', async (req, res) => {
    const uuid = req.params.uuid;
    const accessedKey = `${redisNamespace}${uuid}:accessed`;

    try {
        const accessed = await redis.get(accessedKey);
        res.json({ accessed: !!accessed }); // Return true if accessed, false otherwise
    } catch (error) {
        console.error('Error checking access status:', error);
        res.status(500).json({ message: 'Error checking access status' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
