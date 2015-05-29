'use strict';

var _ = require('lodash');
var googleapis = require('googleapis');
var urlshortener = googleapis.urlshortener('v1');

module.exports = {


  friendlyName: 'URL list',


  description: 'REQUIRED AUTH ! The url.list method retrieves a list of URLs shortened by the authenticated user.',


  cacheable: true,


  sync: false,


  idempotent: false,


  inputs: {
    key: {
      example: 'AIzaSyAYVDlaoVs_GZw9JNvSclRWH_PEMKII6tc',
      description: 'Your API key',
      required: true
    },
    projection: {
      example: 'ANALYTICS_CLICKS', // ANALYTICS_CLICKS | FULL
      description: 'Additional information to return. Supporting only (ANALYTICS_CLICKS | FULL)'
    },
    'start-token': {
      example: 'nextPageToken',
      description: 'The index into the paginated list (using the start-token query parameter). To request successive pages of results, set the start-token parameter to the current result\'s nextPageToken value.'
    }
  },


  exits: {
    unauthorized: {
      description: 'Authorization error. Login required.'
    },

    invalidParameter: {
      description: 'Invalid field parameter passed'
    },

    success: {
      variableName: 'result',
      description: 'List of urls that user sent.'
    },

  },


  fn: function(inputs, exits) {
    var params = {};
    // Mergind given objects
    _.merge(params, inputs);
    // Make API call
    urlshortener.url.list(params, function(err, response) {
      if (err) {
        console.log(err);
        if (!err.code) {
          return exits.error(err);
        }
        switch (err.code) {
          case 401:
            return exits.unauthorized(err);
            break;
          case 400:
            return exits.invalidParameter(err);
            break;
          default:
            return exits.error(err);
            break;
        }
      }
      return exits.success(response);
    });
  },



};
