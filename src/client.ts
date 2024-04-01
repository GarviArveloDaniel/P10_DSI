import net from 'net';

/**
 * Connect to server in port 60300
 */
const client = net.connect({ port: 60300 });

const commandOptions = process.argv;
const commandName = commandOptions[2];
const commandParameters = commandOptions.slice(3);

/**
 * Represents a message object.
 * @property {string} command - The command name.
 * @property {any} options - The command parameters.
 */
const message = {
  command: commandName,
  options: commandParameters
};

/**
 * Writes the message to the socket as a JSON file
 */
client.write(JSON.stringify(message));

/**
 * Retrieves all the data the server sent, even if
 * it is sent in chunks.
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

/**
 * When the connection is closed, it
 * prints the command output.
 */
client.on('end', () => {
  const message = JSON.parse(wholeData)
  console.log(message.output);
});
