// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import mixin from 'common-web-ui/lib/mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import Trie from '../lib/Trie';
import Workflow from '../lib/Workflow';

import TaskDefinitionStore from '../stores/TaskDefinitionStore';
import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';

import WorkflowOverlay from './WorkflowOverlay';

@radium
@mixin(RouteHelpers)
export default class WorkflowOperator extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    overlay: PropTypes.any,
    style: PropTypes.object,
    workflowName: PropTypes.string
  };

  static defaultProps = {
    className: '',
    css: {},
    overlay: null,
    style: {},
    workflowName: ''
  };

  static contextTypes = {
    workflowEditor: PropTypes.any
  };

  static childContextTypes = {
    workflowOperator: PropTypes.any
  };

  taskDefinitionStore = new TaskDefinitionStore();

  workflowTemplateStore = new WorkflowTemplateStore(Workflow);

  workflowTrie = new Trie();

  taskTrie = new Trie();

  getTaskDefinition(name) {
    return this.taskDefinitionStore.collection[name];
  }

  getWorkflowTemplate(name) {
    return this.workflowTemplateStore.collection[name];
  }

  getTaskDefinitionFromTask(task) {
    return task.taskDefinition || this.getTaskDefinition(task.taskName) || {};
  }

  events = new EventEmitter();

  state = {
    overlay: null,
    task: null,
    workflow: new Workflow({
      friendlyName: '',
      injectableName: '',
      tasks: []
    }),
    workflowName: this.props.workflowName
  };

  get activeWorkflow() {
    return this.state.workflow;
  }

  getChildContext() {
    return { workflowOperator: this };
  }

  componentDidMount() {
    this.load(this.props.workflowName);
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props,
        shouldReloadWorkflow = nextProps.workflow &&
          props.workflow !== nextProps.workflow;

    if (shouldReloadWorkflow) {
      this.load(nextProps.workflow);
    }
  }

  emitWorkflowChange() {
    this.events.emit('changeWorkflow', this);
  }

  onChangeWorkflow(handler) {
    this.events.on('changeWorkflow', handler);
  }

  offChangeWorkflow(handler) {
    this.events.off('changeWorkflow', handler);
  }

  css = {
    root: {},

    overlay: {
      textAlign: 'center',
      position: 'absolute',
      height: 0,
      width: '100%',
      top: 0,
      zIndex: 9
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, this.props.style],
      overlay: [this.css.overlay, props.css.overlay]
    };

    return (
      <div ref="root"
          className={'WorkflowOperator ' + props.className}
          style={css.root}>

        {props.children}

        <WorkflowOverlay ref="overlay" style={css.overlay}>{props.overlay}</WorkflowOverlay>
      </div>
    );
  }

  add(e) {
    let graphContext = this.context.workflowEditor.refs.graph.context;
    this.activeWorkflow.addTask(graphContext, this.state.task, 'new-task-' + Date.now());
  }

  save(e) {
    this.refs.overlay.setState({loading: true}, () => {
      let workflowJson = this.activeWorkflow.json;
      this.workflowTemplateStore.create(workflowJson.injectableName, workflowJson)
        .then(
          () => this.reload(),
          err => console.error(err));
    });
  }

  reload(e) {
    this.load(this.state.workflowName);
  }

  rename(newName) {
    this.activeWorkflow.renameWorkflow(newName);
  }

  load(workflowName) {
    this.refs.overlay.setState({loading: true});

    Promise
      .all([
        this.taskDefinitionStore.list(),
        this.workflowTemplateStore.list()
      ])
      .then(() => {
        let workflows = this.workflowTemplateStore.all();
        this.workflowTrie.clear();
        workflows.forEach(workflow => {
          this.workflowTrie.insert(workflow.injectableName, workflow);
          this.workflowTrie.insert(workflow.friendlyName, workflow);
        });

        let tasks = this.taskDefinitionStore.all();
        this.taskTrie.clear();
        tasks.forEach(task => {
          this.taskTrie.insert(task.injectableName, task);
          this.taskTrie.insert(task.friendlyName, task);
        });

        let currentWorkflow = this.state.workflow;

        let finish = (matchingWorkflow) => {
          this.refs.overlay.setState({
            workflowTerm: matchingWorkflow.friendlyName || '',
            loading: false
          }, () => {
            if (this.state.workflow !== currentWorkflow) {
              this.emitWorkflowChange();
            }
          });
        };

        if (workflowName) {
          let matchingWorkflow = null;

          workflows.some(workflow => {
            if (workflow.injectableName === workflowName || workflow.friendlyName === workflowName) {
              matchingWorkflow = workflow;
              return true;
            }
          });

          if (matchingWorkflow) {
            if (this.state.workflow === matchingWorkflow) {
              return finish(matchingWorkflow);
            }

            return this.setState({
              workflow: matchingWorkflow,
              workflowName: matchingWorkflow.injectableName
            }, () => finish(matchingWorkflow));
          }
        }

        finish({});
      });
  }

}
