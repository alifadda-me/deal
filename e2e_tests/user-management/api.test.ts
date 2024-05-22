import { OK } from 'http-status';

import * as dockerMongo from '../setup/docker.mongo';
import * as expressServer from '../expressServer/expressServer';
import request from 'supertest';
import { connectDefaultConnectionToMongoDB, disconnectDefaultFromMongoDB } from '../../config/mongooseConfig';
import UserSchema from '../../src/user-management/common/infrastructure/db/models/schemas/UserSchema';
import AdSchema from '../../src/property-management/common/infrastructure/db/models/schemas/AdSchema';
import PropertyRequestSchema from '../../src/property-management/common/infrastructure/db/models/schemas/PropertyRequestSchema';
import { Types } from 'mongoose';

describe('/api', () => {
  let app: any = null;
  let accessToken: string;

  beforeAll(async () => {
    await dockerMongo.startContainer();
    const mongoUri = dockerMongo.getMongoUriWithRandomizedDatabaseName();
    await connectDefaultConnectionToMongoDB(mongoUri);
    app = expressServer.setupServer();
    await seedDatabase();
    const response = await expressServer.loginEndPoint(app, { phone: '1122334455', password: '123456789' });
    accessToken = response.body.data.accessToken;
  });

  beforeEach(async () => {});

  describe('/users/login', () => {
    it('200', async () => {
      // Arrange
      const userLoginCredentials = { phone: '1234567890', password: '123456789' };

      // Act
      const response = await expressServer.loginEndPoint(app, userLoginCredentials);

      // Assert
      expect(response.statusCode).toEqual(OK);
      expect(response.body.data.user.phone).toEqual(userLoginCredentials.phone);
    });
  });

  describe('/stats', () => {
    it('200', async () => {
      // Arrange
      const expectedStats = {
        'Bob Smith': { adsCount: 4, totalAdsAmount: 845000, requestsCount: 0, totalRequestsAmount: 0 },
        'Evan Wright': { adsCount: 4, totalAdsAmount: 1810000, requestsCount: 0, totalRequestsAmount: 0 },
        'Diana Ross': { adsCount: 0, totalAdsAmount: 0, requestsCount: 4, totalRequestsAmount: 1530000 },
        'Alice Johnson': { adsCount: 0, totalAdsAmount: 0, requestsCount: 4, totalRequestsAmount: 720000 },
      };

      // Act
      const response = await request(app)
        .get('/api/property-requests/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(OK);
      response.body.data.forEach((user) => {
        const { name, adsCount, totalAdsAmount, requestsCount, totalRequestsAmount } = user;
        if (expectedStats[name]) {
          expect(adsCount).toEqual(expectedStats[name].adsCount);
          expect(totalAdsAmount).toEqual(expectedStats[name].totalAdsAmount);
          expect(requestsCount).toEqual(expectedStats[name].requestsCount);
          expect(totalRequestsAmount).toEqual(expectedStats[name].totalRequestsAmount);
        }
      });
    });
  });

  afterEach(async () => {});

  afterAll(async () => {
    await AdSchema.deleteMany({});
    await PropertyRequestSchema.deleteMany({});
    await UserSchema.deleteMany({});
    await disconnectDefaultFromMongoDB();
    await app.close();
  });
});

const seedDatabase = async () => {
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc421'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    name: 'Alice Johnson',
    phone: '1234567890',
    role: 'CLIENT',
    status: 'ACTIVE',
  });
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc422'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    name: 'Bob Smith',
    phone: '0987654321',
    role: 'AGENT',
    status: 'ACTIVE',
  });
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc423'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    name: 'Chris Doe',
    phone: '1122334455',
    role: 'ADMIN',
    status: 'ACTIVE',
  });
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc424'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    phone: '1223334444',
    name: 'Diana Ross',
    role: 'CLIENT',
    status: 'ACTIVE',
  });
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc425'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    name: 'Evan Wright',
    phone: '1333444555',
    role: 'AGENT',
    status: 'ACTIVE',
  });
  await UserSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc426'),
    password: '$2a$10$AYLyQtPeb5srg2sqosiQROuOdTgFgyNdjSTSDIAgNDexOfqREbnru',
    name: 'Fiona Green',
    phone: '1444555666',
    role: 'ADMIN',
    status: 'ACTIVE',
  });

  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc441'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc422'),
    propertyType: 'APARTMENT',
    area: 115,
    price: 145000,
    city: 'Cairo',
    district: 'Maadi',
    description: 'Modern apartment for sale, ideal for small families.',
    refreshedAt: '2024-05-21T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc442'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc425'),
    propertyType: 'VILLA',
    area: 310,
    price: 510000,
    city: 'Cairo',
    district: 'New Cairo',
    description: 'Luxurious villa with garden and pool.',
    refreshedAt: '2024-05-20T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc443'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc422'),
    propertyType: 'LAND',
    area: 650,
    price: 250000,
    city: 'Alexandria',
    district: 'Sidi Gaber',
    description: 'Premium land available for immediate development.',
    refreshedAt: '2024-05-19T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc444'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc425'),
    propertyType: 'HOUSE',
    area: 250,
    price: 400000,
    city: 'Giza',
    district: '6th of October',
    description: 'Spacious house perfect for large families, with ample parking.',
    refreshedAt: '2024-05-18T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc445'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc422'),
    propertyType: 'APARTMENT',
    area: 90,
    price: 100000,
    city: 'Cairo',
    district: 'Zamalek',
    description: 'Affordable apartment in prestigious area, great for singles or young couples.',
    refreshedAt: '2024-05-17T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc446'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc425'),
    propertyType: 'VILLA',
    area: 380,
    price: 600000,
    city: 'Cairo',
    district: 'Nasr City',
    description: 'Exclusive villa with state-of-the-art features and private security.',
    refreshedAt: '2024-05-16T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc447'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc422'),
    propertyType: 'HOUSE',
    area: 210,
    price: 350000,
    city: 'Alexandria',
    district: 'Mandara',
    description: 'Charming beachfront house with stunning views of the Mediterranean.',
    refreshedAt: '2024-05-15T12:00:00Z',
  });
  await AdSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc448'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc425'),
    propertyType: 'LAND',
    area: 800,
    price: 300000,
    city: 'Giza',
    district: 'Dokki',
    description: 'Large plot of land in a commercial area, suitable for multiple uses.',
    refreshedAt: '2024-05-14T12:00:00Z',
  });

  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc431'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc421'),
    propertyType: 'APARTMENT',
    area: 120,
    price: 150000,
    city: 'Cairo',
    district: 'Maadi',
    description: 'Looking for a well-ventilated apartment with natural light.',
    refreshedAt: '2024-05-20T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc432'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc424'),
    propertyType: 'VILLA',
    area: 300,
    price: 500000,
    city: 'Cairo',
    district: 'New Cairo',
    description: 'Desire a spacious villa in a secure area.',
    refreshedAt: '2024-05-19T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc433'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc421'),
    propertyType: 'LAND',
    area: 600,
    price: 200000,
    city: 'Alexandria',
    district: 'Sidi Gaber',
    description: 'Looking for a large plot of land for investment purposes.',
    refreshedAt: '2024-05-18T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc434'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc424'),
    propertyType: 'HOUSE',
    area: 200,
    price: 300000,
    city: 'Giza',
    district: '6th of October',
    description: 'Interested in a family house with a backyard.',
    refreshedAt: '2024-05-17T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc435'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc421'),
    propertyType: 'APARTMENT',
    area: 100,
    price: 120000,
    city: 'Cairo',
    district: 'Zamalek',
    description: 'Seeking a cozy apartment in a quiet neighborhood.',
    refreshedAt: '2024-05-16T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc436'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc424'),
    propertyType: 'VILLA',
    area: 350,
    price: 550000,
    city: 'Cairo',
    district: 'Nasr City',
    description: 'Looking for a modern villa with a swimming pool.',
    refreshedAt: '2024-05-15T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc437'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc421'),
    propertyType: 'HOUSE',
    area: 180,
    price: 250000,
    city: 'Alexandria',
    district: 'Mandara',
    description: 'Need a house near the sea for weekend getaways.',
    refreshedAt: '2024-05-14T12:00:00Z',
  });
  await PropertyRequestSchema.create({
    _id: new Types.ObjectId('6287558411b84b2ea03bc438'),
    userId: new Types.ObjectId('6287558411b84b2ea03bc424'),
    propertyType: 'LAND',
    area: 500,
    price: 180000,
    city: 'Giza',
    district: 'Dokki',
    description: 'Searching for land to develop a commercial property.',
    refreshedAt: '2024-05-13T12:00:00Z',
  });
};
