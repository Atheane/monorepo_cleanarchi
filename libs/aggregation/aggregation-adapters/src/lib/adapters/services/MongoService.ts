import * as mongoose from 'mongoose';

export async function initMongooseConnection(uri: string): Promise<void> {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}
