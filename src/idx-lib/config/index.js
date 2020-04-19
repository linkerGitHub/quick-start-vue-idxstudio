import idxCfg from 'idxConfig'

const serverHost = process.env.NODE_ENV === 'production' ? idxCfg.production.serverHost : idxCfg.dev.serverHost
const clientHost = process.env.NODE_ENV === 'production' ? idxCfg.production.clientHost : idxCfg.dev.clientHost

const url = {
  server: {
    hostname: `${serverHost}`,
    api_base: `${serverHost}/api`
  },
  client: {
    hostname: process.env.NODE_ENV === 'production' ? `${clientHost}/client/#` : `${clientHost}/#`
  }
}

export {
  url
}
