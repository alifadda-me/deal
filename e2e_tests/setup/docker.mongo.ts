import { GenericContainer, StartedTestContainer } from "testcontainers";

export const MONGO_PORT = 27017;
let mongoContainer: StartedTestContainer;

export async function startContainer(): Promise<StartedTestContainer> {
  if (mongoContainer == null) {
    mongoContainer = await new GenericContainer("mongo")
      .withExposedPorts(MONGO_PORT)
      .withLabels({ containerName: "deal-service-container" })
      .withReuse()
      .start();
  }
  return mongoContainer;
}

export function getMongoUriWithRandomizedDatabaseName(): string {
  if (mongoContainer !== null) {
    const randomNumber = Math.floor(Math.random() * 100_000);
    return `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(MONGO_PORT)}/bla-${randomNumber}`;
  }
  throw new Error(
    "Generating setup url before docker container was instantiated",
  );
}
