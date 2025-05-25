import { arrayStringFormat } from "../util.js";
import { getUsers } from "../features/messageLogger.js";

export class Command {
    constructor(name, description, aliases, args, callback, permissions) {
      this.name = name;
      this.description = description;
      this.aliases = aliases;
      this.args = Array.isArray(args) ? args.map(x => ({ name: x, required: true, default: null })) : [args];
      this.callback = callback;
      this.prefix = process.env.PREFIX;
      this.permissions = (permissions && typeof permissions === 'object') ? permissions : {};
    }

    toString(verbose) {
        const argsString = arrayStringFormat(this.getArgs())
        const aliasString = verbose ? ` ( ${this.aliases.join(', ')} ) Desc: "${this.description}" ` : "";
        return `${this.prefix}${this.name}${aliasString} ${argsString}`;
    }
    
    getArgs() {
        return this.args.map(x => x.name + (x.required ? '' : ' (optional)'));
    }

    checkArguments(providedArgs) {
        if (this.args.length === 0) return { matches: true, parsedArgs: {} };
      
        const parsedArgs = {};
      
        for (let i = 0; i < this.args.length; i++) {
            const expectedArg = this.args[i];
            const provided = providedArgs[i];
        
            if (expectedArg.required && (provided === undefined || provided === null)) {
                return {
                    matches: false,
                    feedback: `Incorrect usage... Correct usage: ${this.toString()}`
                };
            }
        
            if (provided !== undefined && provided !== '') {
                parsedArgs[expectedArg.name] = provided;
            } else {
                parsedArgs[expectedArg.name] = expectedArg.default ?? null;
            }
        }
      
        return { matches: true, parsedArgs };
    }

    checkPermissions(username){
        let user = getUsers()[username]
        let hasAtLeastOnePerm = false;
                
        if ( user?.permissions?.[this.name+".banned"] === true ) return {matches:false, feedback:`You are barred from using the command [${this.name}]`};
        
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
            return { 
                matches: false, 
                feedback: `You do not have any of the required permissions to use [${this.name}]`
            };
        }

        return { matches: true }
    }

    splitArgs(input) {
        const args = [];
        let current = '';
        let insideQuotes = false;
      
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
      
            if (char === '"') {
                insideQuotes = !insideQuotes;
                continue;
            }
        
            if (char === ' ' && !insideQuotes) {
                if (current.length > 0) {
                    args.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
      
        if (current.length > 0) {
          args.push(current);
        }
      
        return args;
    }

    matches (message){
        let user = getUsers()[message.fromUser]

        const text = message.text;
        if (!text.startsWith(this.prefix)) return false;

        if ( user?.permissions?.["banned"] == true ) return {matches:false, feedback:`You are barred from commands.`};

        let trimmed = text.substring(this.prefix.length).toLowerCase();
        let commandArr = [...this.aliases, this.name];
        
        for (let cmd of commandArr){
            let argsString = text.substring(this.prefix.length).substring(cmd.length).trim();
            let providedArgs = this.splitArgs(argsString);

            if ( !(trimmed === cmd || trimmed.startsWith(cmd + ' ')) ) continue;

            let permsCheck = this.checkPermissions(message.fromUser);
            if ( !permsCheck.matches ) return permsCheck;

            let argsCheck = this.checkArguments(providedArgs);
            if ( !argsCheck.matches ) return argsCheck;
            
            return { matches: true, arguments: Object.values(argsCheck.parsedArgs)};
        }

        return false;
    }

    run(...args) {
        console.log("running "+this.name+" with args ", ...args);
        this.callback(...args);
    }
}