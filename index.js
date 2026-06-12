const { spawn } = require('node:child_process')
const logger = require('./utils/log')
function startBot(message) {
  console.clear()
  if (message) logger(message, '[ Starting ]')
  const child = spawn('node', ['--trace-warnings', '--async-stack-traces', 'mirai.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  })
  child.on('close', (_codeExit) => {
    startBot('Restarting...')
  })

  child.on('error', (error) => {
    logger(`An error occurred: ${JSON.stringify(error)}`, '[ Starting ]')
  })
}
startBot()
