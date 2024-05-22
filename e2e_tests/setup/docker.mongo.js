"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoUriWithRandomizedDatabaseName = exports.startContainer = exports.MONGO_PORT = void 0;
const testcontainers_1 = require("testcontainers");
exports.MONGO_PORT = 27017;
let mongoContainer;
async function startContainer() {
    if (mongoContainer == null) {
        mongoContainer = await new testcontainers_1.GenericContainer("mongo")
            .withExposedPorts(exports.MONGO_PORT)
            .withLabels({ containerName: "deal-service-container" })
            .withReuse()
            .start();
    }
    return mongoContainer;
}
exports.startContainer = startContainer;
function getMongoUriWithRandomizedDatabaseName() {
    if (mongoContainer !== null) {
        const randomNumber = Math.floor(Math.random() * 100000);
        return `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(exports.MONGO_PORT)}/bla-${randomNumber}`;
    }
    throw new Error("Generating setup url before docker container was instantiated");
}
exports.getMongoUriWithRandomizedDatabaseName = getMongoUriWithRandomizedDatabaseName;
//# sourceMappingURL=docker.mongo.js.map