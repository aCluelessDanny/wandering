
import mongoose from 'mongoose';
import Users from '../_models/users';
import Tracks from '../_models/tracks';
import UserTracks from '../_models/userTracks';
import { DB_URL } from './config';

let cachedDb = null;

const connectToDatabase = (resolve, reject) => {
  if (cachedDb) {
    console.log('> Using cached database instance');
    return resolve(cachedDb);
  }

  console.log('> Connecting...')

  return mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(db => {
      console.log(`Connected!`);
      cachedDb = db;
      resolve(db);
    })
    .catch(err => {
      console.error("Connection error!", err.message);
      cachedDb = null;
      reject(err);
    });
}

export default () => new Promise((resolve, reject) => connectToDatabase(resolve, reject))
