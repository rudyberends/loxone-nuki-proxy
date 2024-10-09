import * as http from 'http'; // Import the HTTP module
import logger from '../utils/troxorlogger';
import { informMiniServer } from '../Loxone/Loxone';

// Create the web server
const server = http.createServer(async (req, res) => {

    if (req.method === 'POST' && req.url === '/callback') {
        let body = '';
    
        // Listen for data chunks
        req.on('data', (chunk) => {
            body += chunk.toString(); // Convert buffer to string and append
        });
    
        // When the data stream ends, process the data
        req.on('end', () => {
            // Now you have the full POST data in `body`
            const postData = JSON.parse(body); // Assuming the POST data is JSON
            const action = postData.state === 1 ? 'On' : 'Off';
            informMiniServer(action);
    
            // Respond with the postData or current states
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
        });
    
        // Handle errors
        req.on('error', (err) => {
            console.error('Error while processing POST data:', err);
            res.writeHead(500);
            res.end('Error processing data');
        });
    } else {
        // Respond with a 404 for other routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Function to start the HTTP server
const startServer = (port: number) => {
    server.listen(port, () => {
        logger.info(`Http Server running at ${port}`);
    });
};

export { startServer }; // Export the startServer function
