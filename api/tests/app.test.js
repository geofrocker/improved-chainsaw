/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../api/app');
const config = require('../config');
const {
  users,
  populateUsers,
  populateLocations,
  locations,
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateLocations);

afterAll(() => {
  mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
});
describe('User actions', () => {
  test('it should login user', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: users[0].username, password: users[0].password })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.token).not.toBe('undefined');
        done();
      });
  });

  test('it should not login unregistered user', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: 'unknown', password: 'unknown' })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(typeof res.body.token).toBe('undefined');
        done();
      });
  });

  test('it should not login user with incorrect password', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: users[0].username, password: 'unknown' })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(typeof res.body.token).toBe('undefined');
        done();
      });
  });

  test('it should register user', (done) => {
    request(app)
      .post('/public/auth/register')
      .send({ username: 'test', email: 'test@gmail.com', password: 'test' })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(typeof res.body).not.toBe('undefined');
        done();
      });
  });

  test('it should add a location', (done) => {
    request(app)
      .post('/private/locations')
      .send({ name: 'kampala', totalMale: 20, totalFemale: 30 })
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });

  test('it should get a location', (done) => {
    request(app)
      .get('/private/locations/' + locations[0]._id)
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text).location.name).toEqual('Mbarara');
        done();
      });
  });

  test('it should update a location', (done) => {
    request(app)
      .put('/private/locations/' + locations[0]._id)
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .send({ name: 'Mbarara-updated', totalMale: 20, totalFemale: 30 })
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('Location updated successfully');
        done();
      });
  });

  test('it should get all locations', (done) => {
    request(app)
      .get('/public/locations/')
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text).locations.length).toBeGreaterThan(0);
        done();
      });
  });
});
