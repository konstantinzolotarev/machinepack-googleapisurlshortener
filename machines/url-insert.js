'use strict';

var _ = require('lodash');
var googleapis = require('googleapis');
var urlshortener = googleapis.urlshortener('v1');

module.exports = {
  friendlyName: 'URL insert',

  description: 'Create a short URL from given long version',

  cacheable: true,

  sync: false,

  idempotent: false,

  inputs: {
    longUrl: {
      example: 'https://www.google.com',
      description: ''
    },

    analitics: {
      typeclass: 'dictionary',
      description: ''
    },

    id: {
      example: 'someUniqId',
      description: 'id is the short URL that expands to the long URL you provided. '
                      + 'If your request includes an auth token, then this URL will be unique. '
                      + 'If not, then it might be reused from a previous request to shorten the same URL.',
    },
    kind: {
      example: 'urlshortener#url',
      description: 'https://developers.google.com/url-shortener/v1/url/insert'
    },
    status: {
      example: 'SomeStatus',
      description: 'https://developers.google.com/url-shortener/v1/url/insert'
    },
    created: {
      example: '1605-11-05T00:00:00.000Z',
      description: 'https://developers.google.com/url-shortener/v1/url/insert'
    },

    fields: {
      example: 'analytics,created,id,kind,longUrl,status',
      description: 'Selector specifying which fields to include in a partial response'
    },

    key: {
      example: 'AIzaSyAYVDlaoVs_GZw9JNvSclRWH_PEMKII6tc',
      description: 'Your api key',
      whereToGet: {
        url: 'https://developers.google.com/url-shortener/v1/getting_started#APIKey'
      }
    }
  },

  exits: {
    invalidParameter: {
      description: 'Invalid field parameter passed'
    },

    dailyLimitExceededUnreg: {
      description: 'Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup.'
    },

    success: {
      variableName: 'result',
      description: 'Defaults success hadler'
    }
  },

  fn: function(inputs, exits) {
    var params = {
      resource: {}
    };
    var inputParams = _.clone(inputs);
    if (inputParams.fields && inputParams.fields.length > 0) {
      params.fields = inputParams.fields;
      delete inputParams.fields; // Have to remove this
    }
    // Check and add key
    if (inputParams.key && inputParams.key.length > 0) {
      params.key = inputParams.key;
      delete inputParams.key;
    }
    _.merge(params.resource, inputParams);
    urlshortener.url.insert(params, function(err, response) {
      if (err) {
        console.log(err);
        if (!err.code) {
          return exits.errro(err);
        }
        switch(err.code) {
          case 400:
            return exits.invalidParameter(err);
            break;
          case 403:
            return exits.dailyLimitExceededUnreg(err);
            break;
          default:
              return exits.error(err);
            break;
        }
      }
      return exits.success(response);
    });

  }
};
