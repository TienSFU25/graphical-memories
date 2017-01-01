/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as expect from 'expect';

describe('Smoke tests', function() {
  it('Should show up on the console', function() {
    expect(1).toEqual(1);
  });
});
