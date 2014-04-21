define(function () {
    beforeEach(function () {
        jasmine.Expectation.addMatchers({
            toBeVector: function () {
                return {
                    compare: function (actual, expected) {
                        var pass = (actual.x === expected.x && actual.y === expected.y);
                        return {
                            pass: pass,
                            message: 'Expected Vector2(' + expected.x + ', ' + expected.y + ') to equal Vector2(' + actual.x + ', ' + actual.y + ')'
                        };
                    }
                };
            }
        });
    });
});