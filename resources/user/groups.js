'use strict';
const errors = require('../../errors');

const Groups = function() {}

Groups.prototype.__init = function(units) {
  this.user = units.require('controller');
  const settings = this.user.settings.groups || {};
  this.sudo = settings.sudo || 'sudo';
};

Groups.prototype.add = function(uid, opts) {
  return this
    .has(uid, { group: this.sudo })
    .catch(errors.ifCodeThen(4522, 'Unauthorized'))
    .then(() => this._add({ id: opts.user || uid }, opts.group))
    .then(() => true);
};

Groups.prototype._add = function(opts, group) {
  const r = this.user.r;
  return this.user.update(opts, user => ({
    groups: r.branch(
      user.hasFields('groups'),
      user('groups').setInsert(group),
      [ group ]
    )
  })).catch(errors.ifInstanceThen(TypeError, errors.AlreadyAMemberError))
};

Groups.prototype.delete = function(uid, opts) {
  return this
    .has(uid, { group: this.sudo })
    .catch(errors.ifCodeThen(4522, 'Unauthorized'))
    .then(() => this._delete({ id: opts.user || uid }, opts.group))
    .then(() => true);
};

Groups.prototype._delete = function(opts, group) {
  const r = this.user.r;
  return this.user.update(opts, user => ({
    groups: r.branch(
      user.hasFields('groups'),
      user('groups').setDifference([ group ]),
      []
    )
  })).catch(errors.ifInstanceThen(TypeError, errors.NotAMemberError))
};

Groups.prototype.has = function(uid, opts) {
  return this._has({ id: opts.user || uid }, opts.group)
};

Groups.prototype._has = function(opts, group) {
  const r = this.user.r;
  return this.user.__get(opts)
    .do(user => r.branch(
      r.and(
        user('status').eq('active'),
        user.hasFields('groups'),
        user('groups').contains(group)
      ),
      true,
      r.error(`User doesn't have ${group}`)
    ))
    .run()
    .catch(this.user.notFound)
    .catch(this.reqlRuntimeError(errors.NotAMemberError));
};

Groups.prototype.isSudo = function(opts) {
  return this._has(opts, this.sudo);
};

Groups.prototype.reqlRuntimeError = function(error) {
  return errors.ifInstanceThen(this.user.r.Error.ReqlRuntimeError, error);
}

module.exports = Groups;
