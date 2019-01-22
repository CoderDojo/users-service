const Knex = require('knex');
const proxy = require('proxyquire');
const setupUsers = require('./setupUsers');

const { knexSnakeCaseMappers, Model } = require('objection');

const createdDbs = [];
const knex = Knex({
  client: 'postgres',
  connection: {
    host: 'db',
    user: 'platform',
    password: 'QdYx3D5y',
    database: 'postgres',
  },
});

before(async () => {
  const name = `users_test_${Date.now()}`;
  await knex.raw(`CREATE DATABASE ${name}`);
  const db = Knex({
    client: 'postgres',
    connection: {
      host: 'db',
      user: 'platform',
      password: 'QdYx3D5y',
      database: name,
    },
    ...knexSnakeCaseMappers(),
  });
//  db.on('query', console.log);
  createdDbs.push({
    db,
    name,
  });
  await setupUsers(db);

  global.app = proxy('../../../index', {
    './setup-db': () => {
      Model.knex(db);
    },
  });
});

after(() => {
  const deletePromises = [];
  createdDbs.forEach((db) => {
    deletePromises.push(async () => {
      await db.db.destroy();
      await knex.raw(`DROP DATABASE ${db.name}`);
    });
  });
  return Promise.all(deletePromises);
});
