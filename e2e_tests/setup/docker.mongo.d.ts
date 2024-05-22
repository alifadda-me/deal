import { StartedTestContainer } from "testcontainers";
export declare const MONGO_PORT = 27017;
export declare function startContainer(): Promise<StartedTestContainer>;
export declare function getMongoUriWithRandomizedDatabaseName(): string;
