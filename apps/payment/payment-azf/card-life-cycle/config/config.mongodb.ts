import { connect } from 'mongoose';

export async function initMongooseConnection(url: string): Promise<void> {
  await connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}
