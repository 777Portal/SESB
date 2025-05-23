import { arrayStringFormat } from "../util.js";

export class Command {
    constructor(name, description, aliases, args, callback) {
      this.name = name;
      this.description = description;
      this.aliases = aliases;
      this.args = args;
      this.callback = callback;
      this.prefix = process.env.PREFIX;
    }
    toString (){
        return `${this.prefix}${this.name} ${arrayStringFormat(this.args)}`
    }
    matches (message){
        const text = message.text;
        if (!text.startsWith(this.prefix)) return false;

        let trimmed = text.substring(this.prefix.length).toLowerCase();
        let commandArr = [...this.aliases, this.name];
        
        for (let cmd of commandArr){
            let argsString = trimmed.substring(cmd.length).trim();
            let providedArgs = argsString.length ? argsString.split(' ') : [];

            if ( !(trimmed === cmd || trimmed.startsWith(cmd + ' ')) ) continue;           
            if ( this.args.length !== providedArgs.length ) return {matches:false, feedback:`incorrect length of arguments. correct usage ( ${this.prefix}${cmd}${arrayStringFormat(this.args)} )`};

            return {matches: true, arguments: trimmed.substring(cmd.length).trim().split(' ')};
        }

        return false;
    }
    run(...args) {
        this.callback(...args);
    }
}