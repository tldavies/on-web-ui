// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import EditWorkflow from 'monorail-web-ui/views/workflows/EditWorkflow';

export default class RunWorkflow extends Component {

  render() {
    return <EditWorkflow
      title="Run Workflow"
      workflow={{name: this.props.name, node: '', options: this.props.options}}
      onDone={this.props.onDone} />;
  }

}
