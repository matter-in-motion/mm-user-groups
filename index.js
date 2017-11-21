'use strict';
const user = require('./resources/user');
const commands = require('./commands');

module.exports = {
  resources: { user },
  commands: { user: commands }
};
