import { createConnection, Connection } from 'mongoose';

export const initMongooseConnection = async (cosmosDbConnectionString: string): Promise<Connection> => {
  return createConnection(cosmosDbConnectionString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
