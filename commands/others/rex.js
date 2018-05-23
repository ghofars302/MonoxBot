const MonoxCommand = require('../../const/MonoxCommand.js');

const prefer = [
    'c#',
    'VBNET',
    'vbnet',
    'f#',
    'java',
    'Java',
    'JAVA',
    'python27',
    'Python27',
    'py27',
    'Py27',
    'PYTHON27',
    'PY27',
    'C',
    'c',
    'C++',
    'cplusplus',
    'php',
    'Php',
    'PHP',
    'Pascal',
    'pascal',
    'objectivec',
    'OjectiveC',
    'haskell',
    'Haskell',
    'ruby',
    'RUBY',
    'Ruby',
    'Perl',
    'PERL',
    'perl',
    'lua',
    'Lua',
    'LUA',
    'nasm',
    'Nasm',
    'SQLServer',
    'sqlserver',
    'Sqlserver',
    'javascript',
    'js',
    'JavaScript',
    'JS',
    'javaScript',
    'Lisp',
    'lisp',
    'Prolog',
    'prolog',
    'Go',
    'go',
    'scala',
    'Scala',
    'Scheme',
    'scheme',
    'node.js',
    'nodejs',
    'node',
    'Node.js',
    'Nodejs',
    'Node',
    'python3',
    'Python3',
    'python',
    'Python',
    'py3',
    'Py3',
    'PYTHON3',
    'PY3',
    'Octave',
    'octave',
    'Clang',
    'clang',
    'Cvc',
    'cvc',
    'D',
    'R',
    'Tcl',
    'tcl',
    'MySql',
    'mysql',
    'mySql',
    'PostgreSQL',
    'postgresql',
    'Postgresql',
    'postgres',
    'Postgres',
    'oracle',
    'Oracle',
    'Swift',
    'swift',
    'bash',
    'Bash'
];

class Rex extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'rex',
			aliases: [],
			group: 'others',
			memberName: 'rex',
			description: 'Execute code from spetific programing language.',
            examples: ['(Programing language) (Code...)'],
			throttling: {
				usages: 1,
				duration: 2.5
			}
		})
	}
	
	async run(msg, args) {
        let array = args.split(' ');

        let code = args.slice(array[0].length).slice(1);
        if (!args) return this.utils.invalidArgument(msg);

        if (prefer.includes(array[0])) {
            let Result = await this.utils.fetchRexAPI(code, array[0]);
            
            if (Result.status === 200) {
                let json = await Result.json();
                if (json.Errors) {
                    return msg.channel.send(`\`\`\`${json.Errors}\`\`\``);
                } else {
                    if (json.Result.length < 1) {
                        return msg.channel.send('Empty response.');
                    }
                    await msg.channel.send(`\`\`\`${json.Result}\`\`\``);
                }
            } else {
                msg.channel.send(':x: ``Error while calling the service.``')
            }
        } else if (array[0] === 'list') {
            let list = require('../../const/endpoints.json')
            list = await this.util.inspect(list);

            msg.channel.send(list, {code: 'xl'});
        } else {
            msg.channel.send(':x: ``Unknown programing language``');
        }
	}
}

module.exports = Rex