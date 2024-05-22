export default class Env {
  static PORT: string = process.env.PORT ? process.env.PORT : '';
  static SECRET: string = process.env.SECRET ? process.env.SECRET : '';
  static MONGO_URI: string = process.env.MONGO_URI ? process.env.MONGO_URI : '';
  static ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY ? process.env.ACCESS_TOKEN_EXPIRY : '';
}
