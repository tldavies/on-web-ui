// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class NodeStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'nodes';

  list() {
    return MonoRailRestAPIv1_1.nodes.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return MonoRailRestAPIv1_1.nodes.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(data) {
    return MonoRailRestAPIv1_1.nodes.post(data)
      .then(() => this.insert(data))
      .catch(err => this.error(null, err));
  }

  update(id, data) {
    return MonoRailRestAPIv1_1.nodes.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return MonoRailRestAPIv1_1.nodes.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
