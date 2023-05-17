'use strict';
const elasticClient = require('../elastic/elasticClient');
module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    elasticClient.initializeESClient();
  },
};
