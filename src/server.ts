import { startServer } from './httpServer/httpServer'; // Import HTTP server setup

async function main() {

    // Start the HTTP server on all interfaces and port 6000
    const port = 6001;
    startServer(port);
}

main().catch(error => {
    console.error('Error starting server:', error);
});
