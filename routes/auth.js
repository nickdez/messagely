const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const { route } = require("express/lib/application");



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

route.post("/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token })
        } else {
            throw new ExpressError("Invalid username or password, try again.", 404)
        }
    } catch (err) {
        return next(err)
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
    try {
        let { username } = req.body;
        if (username === undefined) {
            throw new ExpressError("Please enter a username", 404)
        } else {
            await User.register(username)
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username)
            return res.json({ token })
        }
    } catch (err) {
        return next(err)
    }
});
