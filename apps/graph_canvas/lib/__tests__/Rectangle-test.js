// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect, beforeEach */

import Rectangle from '../Rectangle';

describe('GC: Rectangle', function() {
  beforeEach(function() {
    this.subject = new Rectangle(0, 0, 100, 100);
  });

  it('has a width and height', function() {
    expect(this.subject.width).to.equal(100);
    expect(this.subject.height).to.equal(100);
  });
});
