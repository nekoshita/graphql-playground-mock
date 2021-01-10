import { importSchema } from 'graphql-import'
import { ApolloServer } from 'apollo-server'

export const server = (filepath: string) => {
  const typeDefs = importSchema(filepath)

  return new ApolloServer({
    typeDefs,
    mocks: true
  })
}
