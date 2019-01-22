const fs = require('fs');

module.exports = async (db) => {
  const sqlFile = fs.readFileSync(`${__dirname}/users.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('sys_user').insert({
    id: 'a5d60790-17c4-4a86-a023-d1558b06f118',
    email: 'hooman@test.com',
    nick: 'hooman@test.com',
    name: 'Cat Believes',
    firstName: 'Cat',
    lastName: 'Believes',
  });
  await db('cd_profiles').insert({
    id: '51851427-bfd4-4c7d-9387-9d0e669439f0',
    userId: 'a5d60790-17c4-4a86-a023-d1558b06f118',
    email: 'hooman@test.com',
    name: 'Cat Believes',
    firstName: 'Cat',
    lastName: 'Believes',
    children: '{c310dc42-b313-4a89-9682-851a012875c1}',
    private: true,
  });

  await db('sys_user').insert({
    id: 'c310dc42-b313-4a89-9682-851a012875c1',
    email: 'child@test.com',
    nick: 'child@test.com',
    name: 'Child Believes',
    firstName: 'Child',
    lastName: 'Believes',
  });
  await db('cd_profiles').insert({
    id: 'cdf09ba0-96f7-4903-8767-715ca1504956',
    userId: 'c310dc42-b313-4a89-9682-851a012875c1',
    email: 'child@test.com',
    name: 'Child Believes',
    firstName: 'Child',
    lastName: 'Believes',
    parents: '{a5d60790-17c4-4a86-a023-d1558b06f118}',
    private: true,
  });

  await db('sys_user').insert({
    id: 'e6bc11aa-b3e4-486e-9746-6472fd829904',
    email: 'deleteme@test.com',
    nick: 'deleteme@test.com',
    name: 'Delete me',
    firstName: 'Delete',
    lastName: 'Me',
  });
  await db('cd_profiles').insert({
    id: 'b3835ae3-e9b0-461d-a384-c0e3e6e6dbbb',
    userId: 'e6bc11aa-b3e4-486e-9746-6472fd829904',
    email: 'deleteme@test.com',
    name: 'Delete me',
    firstName: 'Delete',
    lastName: 'Me',
    private: true,
  });

};
