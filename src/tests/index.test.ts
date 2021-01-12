import { importSchema } from 'graphql-import'

import { server } from '..'

jest.mock('graphql-import')

describe('server', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('should return server with correct schema', (): void => {
    (importSchema as jest.Mock).mockReturnValueOnce(sampleGraphqlSchema)
    const response = server("filepath")
    expect(response).toBeDefined()
  })

  test('should error with invalid schema', (): void => {
    (importSchema as jest.Mock).mockReturnValueOnce('invalid graphql schema')
    expect(() => { server("filepath") }).toThrowError()
  })

  test('should error with invalid filepath', (): void => {
    expect(() => { server("invalidFilePath") }).toThrowError()
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
