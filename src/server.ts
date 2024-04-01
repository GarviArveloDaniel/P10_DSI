import net from 'net';
import {spawn} from 'child_process';

/**
 * The server recieves a bash command and executes it,
 * the ouptut of the commend is then sent to the client.
 * It also handles the errors of the command and an error in case
 * the command doesn't exist.
 */
net.createServer((connection) => {
  console.log('A client has connected.');

  connection.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    const commandName: string = message.command;
    const options: string[] = message.options;
    const commandProcess = spawn(commandName, options);
    let commandOutput = '';
    let commandError = '';
    commandProcess.stdout.on('data', (piece) => { commandOutput += piece});
    commandProcess.on('error', (piece) => { commandError += piece})
    commandProcess.stderr.on('data', (piece) => { commandError += piece});

    commandProcess.on('close', () => {
      if (commandError) {
        const message = {
          output: commandError
        }
        connection.write(JSON.stringify(message));
      } else {
        const message = {
          output: commandOutput
        }
        connection.write(JSON.stringify(message));
      }
      connection.end();
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });

}).listen(60300, () => {
  console.log('Waiting for clients to connect');
});