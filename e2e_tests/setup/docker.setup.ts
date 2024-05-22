import dotenv from 'dotenv';
dotenv.config({
  path: '.env_test',
});

import * as dockerMongo from './docker.mongo';

export default async function testSetup() {
  await dockerMongo.startContainer();
}
