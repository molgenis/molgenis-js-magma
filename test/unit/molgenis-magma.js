import $ from '../../src/molgenis-magma';

describe('$', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy($, 'greet');
      $.greet();
    });

    it('should have been run once', () => {
      expect($.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect($.greet).to.have.always.returned('hello');
    });
  });
});
