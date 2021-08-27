import * as mongoose from 'mongoose';

export async function initMongooseConnection(url: string): Promise<mongoose.Connection> {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  return mongoose.connection;
}
