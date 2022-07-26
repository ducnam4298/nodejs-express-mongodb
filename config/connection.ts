import mongoose from 'mongoose';

export default async () => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-clothing.oadslci.mongodb.net/?retryWrites=true&w=majority`;
  try {
    mongoose.connect(uri, {
      autoIndex: true,
      autoCreate: true
    });
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
  dbConnection.once('open', () => console.log('Connected to DB!'));
};