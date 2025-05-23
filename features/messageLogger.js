import fs from 'fs/promises';

let users = null;

const filePath = 'users.json';
const tempPath = 'users.tmp.json';

export async function initJson() {
  try {
    const data = await fs.readFile('users.json', 'utf8');
    users = JSON.parse(data);
    return users;
  } catch (err) {
    console.error("Error reading users.json:", err);
    return {};
  }
}

export function getUsers() {
  return users;
}

export async function logMessage(message){
  console.log(message.fromUser + ": "+message.text);
  if ( !users[message.fromUser] ) users[message.fromUser] = {
    iq: message.fromIQ,
    permissions: {},
    messages: {}
  };

  if (! users[message.fromUser].permissions) {
    users[message.fromUser].permissions = {}
  }

  users[message.fromUser].messages[message.id] = message;
}

export async function saveMessages() {
  try {
    const json = JSON.stringify(users);
    await fs.writeFile(tempPath, json, 'utf8');
    await fs.rename(tempPath, filePath);
    // console.log('File written successfully!');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}