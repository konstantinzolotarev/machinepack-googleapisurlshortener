'use strict';

var _ = require('lodash');
var googleapis = require('googleapis');
var urlshortener = googleapis.urlshortener('v1');

module.exports = {


  friendlyName: 'URL get',


  description: 'Expand a short URL',


  extendedDescription: 'You can call this method to expand any goo.gl short URL. For example, to expand http://goo.gl/fbsS to narmal URL',


  cacheable: true,


  sync: false,


  idempotent: false,


  inputs: {
    shortUrl: {
      example: 'http://goo.gl/xKbRu3',
      description: 'Short URL',
      required: true
    },

    projection: {
      example: 'ANALYTICS_TOP_STRINGS', // ANALYTICS_CLICKS | ANALYTICS_TOP_STRINGS | FULL
      description: 'Additional information to return.'
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
      variableName: 'err',
      description: 'Invalid field parameter passed'
    },
    dailyLimitExceededUnreg: {
      variableName: 'err',
      description: 'Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup.'
    },
    success: {
      variableName: 'result',
      description: 'Done.',
      example: ''
    }
  },


  fn: function(inputs, exits) {
    var params = {};
    // Mergind given objects
    _.merge(params, inputs);
    // Make API call
    urlshortener.url.get(params, function(err, response) {
      if (err) {
        console.log(err);
        if (!err.code) {
          return exits.error(err);
        }
        switch (err.code) {
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
