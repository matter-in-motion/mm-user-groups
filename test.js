'use strict';
const test = require('ava');
const extension = require('./index');
const createApp = require('mm-test').createApp;

process.env.NODE_ENV = 'production';
const app = createApp({
  extensions: [
    'http',
    'rethinkdb',
    'rethinkdb-schema',
    'db-schema',
    'user',
    extension
  ],

  rethinkdb: {
    db: 'test',
    silent: true
  },

  http: {
    port: 3000,
    host: '0.0.0.0'
  },

  user: {
    new: {
      status: 'created'
    }
  }
});

const user = app.units.require('resources.user.controller');
const groups = app.units.require('resources.user.groups');
test.before(() => app.run('db', 'updateSchema'));
test.after.always(() => app.run('db', 'dropSchema'));

const rxUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let uid;

test.serial('creates a user', t => user
  .create({
    email: 'test@test.com',
    name: 'test name'
  })
  .then(id => {
    uid = id;
    t.regex(id, rxUUID)
  })
);

test.serial('checks if user in sudo group ', t => groups
  .has(uid, { group: 'sudo' })
  .then(() => t.fail())
  .catch(err => t.truthy(err))
);

test.serial('fails to add group (no permissions)', t => groups
  .add(uid, { group: 'group' })
  .then(() => t.fail())
  .catch(err => t.truthy(err))
);

test.serial('fails to add group to non existed user', t => groups
  ._add({ id: 'not exist' }, 'group')
  .then(() => t.fail())
  .catch(err => t.is(err.code, 4540))
);

test.serial('activates user', t => user
  .update({ id: uid }, { status: 'active' })
  .then(id => t.regex(id, rxUUID))
)

test.serial('adds sudo group to user', t => groups
  ._add({ id: uid }, 'sudo')
  .then(id => t.regex(id, rxUUID))
);

test.serial('adds another group to user', t => groups
  .add(uid, {
    user: uid,
    group: 'group'
  })
  .then(res => t.true(res))
);

test.serial('fails to add user to group that he is already a member', t => groups
  .add(uid, { group: 'group' })
  .then(() => t.fail())
  .catch(e => t.is(e.code, 4521))
);

test.serial('checks user groups', t => user
  .get({ id: uid })
  .then(user => {
    t.is(user.id, uid);
    t.is(user.groups.length, 2);
    t.is(user.groups[0], 'sudo');
    t.is(user.groups[1], 'group');
  })
);

test.serial('deletes user from group', t => groups
  .delete(uid, {
    user: uid,
    group: 'group'
  })
  .then(res => t.true(res))
);

test.serial('fails to delete user from group that he is not a member', t => groups
  .delete(uid, { group: 'group' })
  .then(() => t.fail())
  .catch(e => t.is(e.code, 4522))
);

test.serial('deletes user from sudo group', t => groups
  .delete(uid, { group: 'sudo' })
  .then(res => t.true(res))
);

//commands
test.serial('add user to group with command', t => app
  .run('user', 'addGroup', 'test@test.com', 'cmd')
  .then(msg => t.regex(msg, /^Added group/))
);

test.serial('delete user from group with command', t => app
  .run('user', 'deleteGroup', 'test@test.com', 'cmd')
  .then(msg => t.regex(msg, /^Deleted group/))
);

test.serial('fails to add user to group with command (no email and group)', t => app
  .run('user', 'addGroup')
  .then(() => t.fail())
  .catch(e => t.is(e.message, 'User email not found'))
);

test.serial('fails to add user to group with command (no group)', t => app
  .run('user', 'addGroup', 'test@test.com')
  .then(() => t.fail())
  .catch(e => t.is(e.message, 'Group not found'))
);

test.serial('fails to delete user from group with command (no email and group)', t => app
  .run('user', 'deleteGroup')
  .then(() => t.fail())
  .catch(e => t.is(e.message, 'User email not found'))
);

test.serial('fails to delete user from group with command (no group)', t => app
  .run('user', 'deleteGroup', 'test@test.com')
  .then(() => t.fail())
  .catch(e => t.is(e.message, 'Group not found'))
);
