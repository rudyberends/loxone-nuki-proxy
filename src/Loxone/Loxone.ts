import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/troxorlogger';

// Load environment variables from .env file
dotenv.config();

const MINISERVER_IP = process.env.MINISERVER_IP; // Miniserver IP address
const MINISERVER_USERNAME = process.env.MINISERVER_USERNAME; // Miniserver username
const MINISERVER_PASSWORD = process.env.MINISERVER_PASSWORD; // Miniserver password
const MINISERVER_INPUTNAME = process.env.MINISERVER_INPUTNAME; // Input name for the Zaptec API connector
const FUNCTION_BLOCK = 'Sw'; // Define the function block name here

/**
 * Informs the Loxone Miniserver by sending a command.
 * Introduces a random delay to prevent flooding the server with requests.
 * 
 * @param command - The command to send to the Miniserver, formatted as per Loxone's API requirements.
 */
async function sendStateUpdate(command: string) {
  const url = `http://${MINISERVER_IP}/dev/sps/io/${MINISERVER_INPUTNAME}/${command}`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: MINISERVER_USERNAME || '',
        password: MINISERVER_PASSWORD || '',
      },
    });
    logger.debug(`Response from Miniserver: ${response.data}`);
  } catch (error) {
    console.error('Error informing Miniserver:', error);
  }
}

/**
 * Sends the state update to the Loxone Miniserver based on the state name and its value.
 * 
 * @param stateName - The name of the state to update (e.g., 'EnableCharging').
 *                     This name corresponds to the states defined in the ChargerState.
 * @param value - The value to set for the state, which can be a number or a string.
 *                For digital inputs, this value is interpreted as 'On' or 'Off'.
 */
async function informMiniServer(action: string) {

  // Construct the command based on the input type
  const command = `SET(${FUNCTION_BLOCK};${action};pulse)`; // Command for digital inputs

  await sendStateUpdate(command); // Send the constructed command to the Miniserver
}

export { informMiniServer }; // Export functions for use in other modules
