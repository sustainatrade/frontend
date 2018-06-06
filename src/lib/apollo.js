import { graphqlServer, graphqlWsServer } from '../config'
import { MsGraphqlClient } from '../components' 


const client =  MsGraphqlClient(graphqlServer, graphqlWsServer)

export default client;