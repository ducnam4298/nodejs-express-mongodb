import dotenv from './config/dotenv';
import connection from './config/connection';
import auth from './auth';
import server from './server';
import file from './file';

dotenv();
connection();

auth;
server;
file;