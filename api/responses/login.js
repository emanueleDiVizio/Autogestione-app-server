/**
 * res.login([inputs])
 *
 * @param {String} inputs.username
 * @param {String} inputs.password
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(inputs) {
    inputs = inputs || {};

    // Get access to `req` and `res`
    var req = this.req;
    var res = this.res;

    // Look up the user
    User.attemptLogin({
        email: inputs.email,
        password: inputs.password
    }, function (err, user) {
        if (err) return res.negotiate(err);
        if (!user) {
            return res.badRequest({success: false, message: 'Invalid username/password'});
        }

        // "Remember" the user in the session
        // Subsequent requests from this user agent will have `req.session.me` set.
        req.session.me = user.id;

        return res.json({success: true, message: 'Login succesful.', user: user});
    });

};