// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class PollersRestAPI extends RestAPI {

  entity = 'pollers';

  unsupportedMethods = ['put'];

  currentData(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/data/current')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  library(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library' + id ? '/' + id : '')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  pause(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id + '/pause')
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  resume(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id + '/resume')
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
