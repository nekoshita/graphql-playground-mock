#!/usr/bin/env node

import * as meow from 'meow'
import { server } from '.'

const cli = meow(
  `
Usage: 
  $ graphql-playground-mock FILE_PATH

GraphQL Playground Server mocks givin GraphQL Schema file(File must be GraphQL SDL syntax) at http://localhost:4000 (by default)

Options:
  --port, -p      Output in JSON format (based on introspection query)
`,
  {
    flags: {
      port: {
        type: 'number',
        alias: 'p',
      },
    },
  },
)

const defaultPort = 4000

interface IFlags extends Record<string, meow.AnyFlag> {
  port: {
    type: "number"
    alias: string
  }
}

const getPortFromInput = (cli: meow.Result<IFlags>) => {
  if (Number.isNaN(cli.flags.port) || typeof cli.flags.port === 'undefined') {
    return defaultPort
  } else {
    return cli.flags.port
  }
}

const main = (cli: meow.Result<IFlags>) => {
  const [filepath] = cli.input

  if (!filepath) {
    console.warn('No filepath provided')
    return
  }

  const port = getPortFromInput(cli)

  server(filepath).listen(port).then(({ url }) => {
    console.log(`🚀 GraphQL Mock Server is ready at ${url}`)
  })
}

if (process.env.NODE_ENV !== 'test') main(cli)
