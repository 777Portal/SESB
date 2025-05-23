import { arrayStringFormat } from "../util.js";
import { getUsers } from "../features/messageLogger.js";

export class Command {
    constructor(name, description, aliases, args, callback, permissions) {
      this.name = name;
      this.description = description;
      this.aliases = aliases;
      this.args = args;
      this.callback = callback;
      this.prefix = process.env.PREFIX;
      this.permissions = (permissions && typeof permissions === 'object') ? permissions : {};
    }
    toString (){
        return `${this.prefix}${this.name} ${arrayStringFormat(this.args)}`
    }
    checkPermissions(username){
        let user = getUsers()[username]
        let hasAtLeastOnePerm = false;

        for (let perm in this.permissions) {
          const isHard = this.permissions[perm]?.hard === true;
          const userHasPerm = user?.permissions?.[perm];
        
          if (isHard && !userHasPerm) {
            return { matches: false, feedback: `You do not have the permissions to use [${this.name}]` };
          }

          if (userHasPerm) {
            hasAtLeastOnePerm = true;
            continue; 
          }        
        }
        
        if (!hasAtLeastOnePerm && Object.keys(this.permissions).length > 0) {
          return { matches: false, feedback: `You do not have any of the required permissions to use [${this.name}]`};
        }

        return { matches: true }
    }
    matches (message){
        let user = getUsers()[message.fromUser]
        
        const text = message.text;
        if (!text.startsWith(this.prefix)) return false;

        let trimmed = text.substring(this.prefix.length).toLowerCase();
        let commandArr = [...this.aliases, this.name];
        
        for (let cmd of commandArr){
            let argsString = trimmed.substring(cmd.length).trim();
            let providedArgs = argsString.length ? argsString.split(' ') : [];

            if ( !(trimmed === cmd || trimmed.startsWith(cmd + ' ')) ) continue;           
            if ( this.args.length !== providedArgs.length ) return {matches:false, feedback:`incorrect length of arguments. correct usage ( ${this.prefix}${cmd}${arrayStringFormat(this.args)} )`};
            if ( user?.permissions?.[this.name]?.banned == true ) return {matches:false, feedback:`You are barred from using the command [${this.name}]`};
            
            let permsCheck = this.checkPermissions(message.fromUser);
            if ( !permsCheck.matches ) return permsCheck;
            
            return {matches: true, arguments: trimmed.substring(cmd.length).trim().split(' ')};
        }

        return false;
    }
    run(...args) {
        this.callback(...args);
    }
}