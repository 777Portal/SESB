import fs from 'fs/promises';

let users = null;

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
    // console.log(message);

    if ( !users[message.fromUser] ) users[message.fromUser] = {
        iq: message.fromIq,
        messages: {}
    };
    users[message.fromUser].messages[message.id] = message;
}

export async function saveMessages(){
  const json = JSON.stringify(users);
  // if ( json == "" ) json = "{}"
  fs.writeFile('users.json', json, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('File written successfully!');
  });
}