// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class OBMServicesRestAPI extends RestAPI {

  entity = 'obms/library';

  unsupportedMethods = ['post', 'put', 'patch', 'delete'];

  get(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
