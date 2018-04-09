const axios = require('axios');
let request = require('request-promise').defaults({jar: true});
const cheerio = require('cheerio');

/**
 * A new moodle user object which is used to fetch info for a specific person.  Can be linked to different moodle websites.
 */
class MoodleUser {

    /**
     * Create a new moodle user object
     * @param {String} username - The users moodle username
     * @param {String} password - The users moodle password
     * @param {String} moodleURL - The moodle websites address
     */
    constructor(username = '', password = '', moodleURL = '') {

        this.username = username;
        this.password = password;
        this.moodleURL = (moodleURL.endsWith('/') ? moodleURL.slice(0, -1) : `${moodleURL}`);
        this.loggedIn = false;
    }

    /**
     * Returns the last login time
     * @return {*}
     */
    get lastLogin() {
        return this.login ? Date.now() - this.login : null;
    }

    /**
     * Returns the cached user grades
     * @return {jQuery|*}
     */
    get grades() {
        return this.moduleGrades;
    }

    /**
     * Returns the cached user modules
     * @return {jQuery|Array|*}
     */
    get modules() {
        return this.userModules;
    }

    /**
     * Returns the user info
     * @return {{name: jQuery, avatar: *|jQuery}|*}
     */
    get info() {
        return this.userInfo
    }

    /**
     * Will attempt log the account in
     * @async
     * @return {Promise<Boolean>}
     */
    async login() {
        try {
            let res = await request.post({url: `${this.moodleURL}/login/index.php`, followAllRedirects: true, form: {username: this.username, password: this.password}, resolveWithFullResponse: true});
            this.cookie = res.request.headers.cookie;
            this.loggedIn = true;

            this.login = Date.now();

            return this.loggedIn;

        }catch (err) {
            console.error(`Error logging in, Error: ${err.stack}`)
        }
    }

    /**
     * Fetches the users information and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchUserInfo() {
        try {
            if (!this.loggedIn) return console.error(`Not logged in yet!`);
            let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
            this._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.userInfo = {
                'name': $('.usertext').text(),
                'avatar': $('.userpicture').first().attr('src')
            };

            return this.userInfo;
        } catch (err) {
            console.error(`Error fetching user info, Error: ${err.stack}`);
        }
    }

    /**
     * Fetches the users course modules and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchModules() {
        try {
            if (!this.loggedIn) return console.error(`Not logged in yet!`);

            let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
            this._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.userModules = $('.contentnode').children().first().children().last().children().first().children().map((i, elem) => $(elem).text()).get() || [];
            return this.userModules;
        } catch (err) {
            console.error(`Error fetching user modules, Error: ${err.stack}`);
        }
    }

    /**
     * Fetches the users module grades and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchGrades() {
        try {
            if (!this.loggedIn) return console.error(`Not logged in yet!`);

            let res = await axios.get(`${this.moodleURL}/grade/report/overview/index.php`, {headers: {Cookie: this.cookie}});
            this._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.moduleGrades = $('#overview-grade').children().last().children().not('.emptyrow').map((i, elem) => {
                return {name: $(elem).children().first().text(), value: $(elem).children().last().text()}
            }).get();

            return this.moduleGrades;
        } catch (err) {
            console.error(`Error fetching user grades, Error: ${err.stack}`);
        }
    }

    /**
     * Fetches the users blog posts and stores them in the cache
     * @async
     * @return {Promise<void>}
     */
    async fetchBlogPosts() {
        try {
            if (!this.loggedIn) return console.error(`Not logged in yet!`);

            let res = await axios.get(`${this.moodleURL}/blog/index.php`, {headers: {Cookie: this.cookie}});
            this._statusCheck(res);

            const $ = cheerio.load(res.data);


        } catch (err) {
            console.error(`Error fetching blog posts, Error: ${err.stack}`);
        }
    }

    _statusCheck(res) {
        if (!(res.status >= 200 && res.status < 300)) return console.error(`Unable to fetch user data, Error: ${res.statusText}`);
    }
}

module.exports = {
    MoodleUser: MoodleUser
};