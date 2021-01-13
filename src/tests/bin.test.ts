import { importSchema } from 'graphql-import'

import { getPortFromInput, main } from '../bin'
import * as index from '../'

jest.mock('graphql-import')

describe('getPortFromInput', () => {
  test('returns default port when givin port is undefined', () => {
    const noport = getPortFromInput({
      flags: {
        port: undefined,
      },
    } as any)
    expect(noport).toEqual(4000)
  })

  test('returns default port when givin port is NaN', () => {
    const noport = getPortFromInput({
      flags: {
        port: NaN,
      },
    } as any)
    expect(noport).toEqual(4000)
  })

  test('return givin port', () => {
    const noport = getPortFromInput({
      flags: {
        port: 5000,
      },
    } as any)
    expect(noport).toEqual(5000)
  })
})

describe('main', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('warns on missing filepath', async () => {
    /**
     * Mocks
     */
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)

    const serverMock = jest.spyOn(index, 'server')

    /**
     * Execution
     */
    await main({ input: [] } as any)

    /**
     * Tests
     */
    expect(consoleWarnMock).toBeCalledWith('No filepath provided')
    expect(consoleWarnMock).toBeCalledTimes(1)
    expect(consoleLogMock).toBeCalledTimes(0)
    expect(serverMock).toBeCalledTimes(0)
  })

  test('starts server with correct filepath', async () => {
    /**
     * Mocks
     */
    (importSchema as jest.Mock).mockReturnValueOnce(sampleGraphqlSchema)
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => false)
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => false)

    const server = index.server('filepath')
    const serverMock = jest.spyOn(index, 'server').mockImplementation(() => server)


    /**
     * Execution
     */
    await main({
      input: ["hoge"],
      flags: { port: undefined }
    } as any)

    /**
     * Tests
     */
    expect(consoleWarnMock).toBeCalledTimes(0)
    expect(consoleLogMock).toBeCalledTimes(1)
    expect(serverMock).toBeCalledTimes(1)

    server.stop()
  })
})

const sampleGraphqlSchema = `
type Book {
  title: String
}
type Query {
  books: [Book]
}
`
