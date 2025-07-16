import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const endpoint = process.env.HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_TOKEN;

const client = new ApolloClient({
  link: new HttpLink({
    uri: endpoint,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }),
  cache: new InMemoryCache(),
});

export default client;
