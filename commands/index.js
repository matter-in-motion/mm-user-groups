'use strict';

const addGroup = function(email, group) {
  if (email === undefined) {
    throw new Error('User email not found');
  }

  if (group === undefined) {
    throw new Error('Group not found');
  }

  return this.units
    .require('resources.user.groups')
    ._add({ email }, group)
    .then(() => `Added group ${group}`)
};

const deleteGroup = function(email, group) {
  if (email === undefined) {
    throw new Error('User email not found');
  }

  if (group === undefined) {
    throw new Error('Group not found');
  }

  return this.units
    .require('resources.user.groups')
    ._delete({ email }, group)
    .then(() => `Deleted group ${group}`)
};

module.exports = {
  __extend: true,
  addGroup: {
    description: '<email> <group>. Adds the user to the group',
    call: addGroup
  },

  deleteGroup: {
    description: '<email> <group>. Deletes the user from the group',
    call: deleteGroup
  }
};
