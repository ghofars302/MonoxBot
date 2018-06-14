module.exports = {
	description: 'Evaluates code on rextester.com',
	category: 'Utils',
	args: '(language) (code..)',
	run: async function (ctx, args, argsString) {
        if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

        if (args[0].toLowerCase() === 'list') {
            return ctx.send(this.util.inspect(list), {code: 'xl'});
        }
        if (!language.includes(args[0])) return ctx.send(':x: ``Unknown language``');

        const code = encodeURIComponent(argsString.slice(args[0].length));
        const res = await this.fetch(`http://rextester.com/rundotnet/api?LanguageChoice=${list[args[0]]}&Program=${code}`, {
            method: 'POST'
        });

        const result = await res.json();

        if (result['Errors']) return ctx.send(result['Errors'], {
            code: 'js'
        });

        await ctx.send(result['Result'] || 'Empty response.', {
            code: 'js'
        });
	}
};

const list = require('../../const/rex.json');

const language = [
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
