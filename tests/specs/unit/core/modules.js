define([], function () {

  describe('modules', function () {

    var utils = hello.utils;

    var request = utils.request;

    var requestProxy = function (req, callback) {

      var r = {
        network: req.network,
        method: req.method,
        url: req.url,
        data: req.data,
        xhr: true
      };

      r.url = './stubs/' + req.network + '/' + req.method + '/' + req.path + '.json';
      request.call(utils, r, callback);
    };

    before(function () {
      utils.request = requestProxy;
    });

    after(function () {
      utils.request = request;
    });

    describe.only('/me', function () {

      var tests = [];

      var makeTest = function (network, override) {
        override = override || {};
        return {
          network: network,
          expect: utils.extend(
            {
              id: "1234567890",
              name: "Full Name",
              thumbnail: "http://example.com/1234567890/picture"
            },
            override
          )
        };
      };

      tests.push(makeTest("instagram"));

      tests.push(
        makeTest("facebook", {
          thumbnail: "http://graph.facebook.com/1234567890/picture"
        })
      );

      utils.forEach(tests, function (test) {

        it('should format ' + test.network + ' correctly', function (done) {
          hello(test.network).api('/me', function (me) {
            expect(me.id).to.be(test.expect.id);
            expect(me.name).to.be(test.expect.name);
            expect(me.thumbnail).to.be(test.expect.thumbnail);
            done();
          });
        });

      });

    });

  });

});