'use strict';

module.exports = {
  __extend: true,

  addGroup: function(app) {
    const ctrl = app.units.require('resources.user.groups');

    return {
      auth: {
        provider: 'user',
        required: true
      },
      title: 'User',
      description: 'Adds the user to the group',
      request: {
        type: 'object',
        properties: {
          user: {
            type: 'string',
            format: 'uuid'
          },
          group: {
            type: 'string',
            maxLength: 60
          }
        },
        required: [ 'group' ],
        additionalProperties: false
      },

      response: {
        type: 'boolean'
      },

      call: (auth, data) => ctrl.add(auth.id, data)
    };
  },

  deleteGroup: function(app) {
    const ctrl = app.units.require('resources.user.groups');

    return {
      auth: {
        provider: 'user',
        required: true
      },
      title: 'User',
      description: 'Deletes the user from the group',
      request: {
        type: 'object',
        properties: {
          user: {
            type: 'string',
            format: 'uuid'
          },
          group: {
            type: 'string',
            maxLength: 60
          }
        },
        required: [ 'group' ],
        additionalProperties: false
      },

      response: {
        type: 'boolean'
      },

      call: (auth, data) => ctrl.delete(auth.id, data)
    };
  },

  hasGroup: function(app) {
    const ctrl = app.units.require('resources.user.groups');

    return {
      auth: {
        provider: 'user',
        required: true
      },
      title: 'User',
      description: 'Returns is the user has the group',
      request: {
        type: 'object',
        properties: {
          user: {
            type: 'string',
            format: 'uuid'
          },
          group: {
            type: 'string',
            maxLength: 60
          }
        },
        required: [ 'group' ],
        additionalProperties: false
      },

      response: {
        type: 'boolean'
      },

      call: (auth, data) => ctrl.has(auth.id, data)
    };
  }
};
