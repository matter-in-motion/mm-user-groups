'use strict';
const api = require('./api');
const Groups = require('./groups');

module.exports = () => ({ api, groups: new Groups() });
