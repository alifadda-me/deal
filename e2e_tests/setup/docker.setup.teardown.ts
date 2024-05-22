import * as dockerMongo from './docker.mongo';

export default async function testTeardown() {
  try {
    const container = await dockerMongo.startContainer();
    await container.stop();
  } catch (error) {
    if (error.reason === 'no such container') {
      console.log(error);
    }
  }
}
