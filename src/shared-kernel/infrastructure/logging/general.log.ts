import { createLogger, format, transports } from "winston";

export const UserManagementLogger = createLogger({
  defaultMeta: { service: "deal-service", domain: "user-management" },
  format: format.combine(format.json()),
  transports: [new transports.Console()],
});

const Logger = createLogger({
  defaultMeta: { service: "deal-service" },
  format: format.combine(format.json()),
  transports: [new transports.Console()],
});

export default Logger;
