'use strict';
const errors = require('mm-errors');
const AlreadyAMemberError = errors.Error(4521, 'The user is already a member of the group');
const NotAMemberError = errors.Error(4522, 'The user is not a member of the group');

module.exports = {
  AlreadyAMemberError,
  NotAMemberError
};
