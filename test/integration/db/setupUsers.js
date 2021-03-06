const fs = require('fs');

module.exports = async (db) => {
  let sqlFile = fs.readFileSync(`${__dirname}/users.sql`, 'utf8');
  await db.raw(sqlFile);
  sqlFile = fs.readFileSync(`${__dirname}/joinRequests.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('sys_user').insert({
    id: 'a5d60790-17c4-4a86-a023-d1558b06f118',
    email: 'hooman@test.com',
    nick: 'hooman@test.com',
    name: 'Cat Believes',
    firstName: 'Cat',
    lastName: 'Believes',
    // Get deleted
    joinRequests: [{
      id: 'k_ykWBUHv',
      dojoId: '338ad4a9-de9a-461c-8af1-359658cfab12',
      userType: 'champion',
      timestamp: '2019-03-12T13:15:18.123Z',
    }],
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
  // Hard delete single
  await db('sys_user').insert({
    id: 'a9c0f005-aeaa-4f9f-a495-0c2c52cffccf',
    email: 'deletemeSingle@test.com',
    nick: 'deletemeSingle@test.com',
    name: 'DeleteSingle me',
    firstName: 'DeleteSingle',
    lastName: 'Me',
  });
  await db('cd_profiles').insert({
    id: '0ac7c904-7f9c-4cc8-bc82-c747666efc10',
    userId: 'a9c0f005-aeaa-4f9f-a495-0c2c52cffccf',
    email: 'deletemeSingle@test.com',
    name: 'DeleteSingle me',
    firstName: 'Delete',
    lastName: 'Me',
    private: true,
  });
  // Soft delete + hard delete cascade
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
    children: '{5792635c-63e5-4a56-afdb-284c07cd75b8,5b10692b-42eb-440d-a82c-10128e245af3}',
    private: true,
  });

  await db('sys_user').insert({
    id: '5792635c-63e5-4a56-afdb-284c07cd75b8',
    nick: 'ChildDelete me',
    name: 'ChildDelete me',
    firstName: 'ChildDelete',
    lastName: 'Me',
  });
  await db('cd_profiles').insert({
    id: '53ddf2fe-8494-4c42-ae86-ce7e3355bd42',
    userId: '5792635c-63e5-4a56-afdb-284c07cd75b8',
    name: 'ChildDelete me',
    firstName: 'ChildDelete',
    lastName: 'Me',
    private: true,
    parents: '{e6bc11aa-b3e4-486e-9746-6472fd829904}',
  });
  // Hard delete of child
  await db('sys_user').insert({
    id: '5b10692b-42eb-440d-a82c-10128e245af3',
    nick: 'ChildDelete2 me',
    name: 'ChildDelete2 me',
    firstName: 'ChildDelete',
    lastName: 'Me',
  });
  await db('cd_profiles').insert({
    id: 'a7c83682-6990-4acf-ac3e-f7fa3cda5d9e',
    userId: '5b10692b-42eb-440d-a82c-10128e245af3',
    name: 'ChildDelete2 me',
    firstName: 'ChildDelete2',
    lastName: 'Me',
    private: true,
    parents: '{e6bc11aa-b3e4-486e-9746-6472fd829904}',
  });

  // User with avatar
  await db.raw('SELECT lo_from_bytea(20723, \'garbage\');');
  await db('sys_user').insert({
    id: '57793065-2d8e-42f5-ab8e-be6b0bb5b4f0',
    nick: 'deleteavatar@example.com',
    email: 'deleteavatar@example.com',
    name: 'DeleteAvatar me',
    firstName: 'DeleteAvatar',
    lastName: 'Me',
    // Get Selected
    joinRequests: [{
      id: 'SEEK32r4B',
      dojoId: '338ad4a9-de9a-461c-8af1-359658cfab12',
      userType: 'champion',
      timestamp: '2019-03-12T13:15:18.123Z',
    }],
  });
  await db('cd_profiles').insert({
    id: 'e8e28935-4bbe-4eab-8054-7149b26031d1',
    userId: '57793065-2d8e-42f5-ab8e-be6b0bb5b4f0',
    email: 'deleteavatar@example.com',
    name: 'DeleteAvatar me',
    firstName: 'DeleteAvatar',
    lastName: 'Me',
    private: true,
    avatar: {
      oid: '20723',
      sizeBytes: 0,
      name: 'avatar.png',
      type: 'image/png',
    },
  });
};
