const axios = require('axios');
let request = require('request-promise').defaults({jar: true});
const cheerio = require('cheerio');
const chalk = require('chalk');

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
        this.loginReTrys = 0;
    }

    /**
     * Returns the current users login status
     * @return {Boolean} - If the user object is currently logged in.
     */
    get status() {
        return this.loggedIn;
    }

    /**
     * Returns the last login time
     * @return {Date} The time since the last login
     */
    get lastLogin() {
        return this.login ? Date.now() - this.login : null;
    }

    /**
     * Returns the cached user grades
     * @return {Array<Object>} - The users cached grades.
     */
    get grades() {
        return this.moduleGrades;
    }

    /**
     * Returns the cached user modules
     * @return {Array<Object>} - The users cached modules.
     */
    get modules() {
        return this.userModules;
    }

    /**
     * Returns the user info
     * @return {Array<Object>} - The users cached personal information.
     */
    get info() {
        return this.userInfo
    }

    static _statusCheck(res) {
        if (!(res.status >= 200 && res.status < 300)) return console.error(`Unable to fetch user data, ${chalk.red(`Status Code: ${res.statusText}`)}`);
    }

    /**
     * Will attempt log the account in.  Recalling this method will refresh the auth token.
     * @async
     * @return {Promise<Boolean>} - Weather or not the login was successful
     */
    async login() {
        try {
            let res = await request.post({url: `${this.moodleURL}/login/index.php`, followAllRedirects: true, form: {username: this.username, password: this.password}, resolveWithFullResponse: true});
            this.cookie = res.request.headers.cookie; // Stupid website only returns a 200 status code for everything #SmartPeople

            this.loggedIn = !!(this.cookie); // If we can't get a login token we haven't logged in

            if (!this.loggedIn) {
                this.loginReTrys++;
                return this.loggedIn;
            }

            this.login = Date.now();
            return this.loggedIn;

        }catch (err) {
            // If the actual post fails
            this.loggedIn = false;
            this.loginReTrys++;
            return this.loggedIn;
        }
    }

    /**
     * Logs the current user out.  Can be logged back in refreshing the auth token.
     * @async
     * @return {Promise<Boolean>} - The current logged in status of the account.
     */
    async logout() {
        try {
            await this._checkLogin();

            let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
            MoodleUser._statusCheck(res);

            this.loggedIn = false;
            this.cookie = '';
            return this.loggedIn;

        } catch (err) {
            console.error(`Unable to log user ${chalk.green(this.username)} out! Error: ${chalk.red(err.name)}`);
        }
    }

    /**
     * Fetches the users information and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchUserInfo() {
        try {
            await this._checkLogin();

            let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
            MoodleUser._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.userInfo = {
                'name': $('.usertext').text(),
                'avatar': $('.userpicture').first().attr('src')
            };

            return this.userInfo;
        } catch (err) {
            return [];
        }
    }

    /**
     * Fetches the users course modules and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchModules() {
        try {
            await this._checkLogin();

            let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
            MoodleUser._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.userModules = $('.contentnode').children().first().children().last().children().first().children().map((i, elem) => $(elem).text()).get() || [];
            return this.userModules;
        } catch (err) {
            return [];
        }
    }

    /**
     * Fetches the users module grades and stores it in the cache
     * @async
     * @return {Promise<Object>}
     */
    async fetchGrades() {
        try {
            await this._checkLogin();

            let res = await axios.get(`${this.moodleURL}/grade/report/overview/index.php`, {headers: {Cookie: this.cookie}});
            MoodleUser._statusCheck(res);

            const $ = cheerio.load(res.data);
            this.moduleGrades = $('#overview-grade').children().last().children().not('.emptyrow').map((i, elem) => {
                return {name: $(elem).children().first().text(), value: $(elem).children().last().text()}
            }).get();

            return this.moduleGrades;
        } catch (err) {
            return [];
        }
    }

    /**
     * Fetches the users blog posts and stores them in the cache
     * @async
     * @return {Promise<Array>}
     */
    async fetchBlogPosts() {
        try {
            await this._checkLogin();

            let res = await axios.get(`${this.moodleURL}/blog/index.php`, {headers: {Cookie: this.cookie}});
            MoodleUser._statusCheck(res);

            const $ = cheerio.load(res.data);
            const blogPosts = $('.blog_entry').map((i, elem) => {
                return {
                    author: ''//TODO
                }
            }).get();


        } catch (err) {
            return [];
        }
    }

    async _checkLogin() {
        try {
            if (!this.loggedIn) {
                return console.log(`Unable to login user ${chalk.red(this.username)} for website ${chalk.red(this.moodleURL)}\n${chalk.green(`Make sure you've called {MoodleUser}.login() first!`)}`);

            }

        } catch (err) {
            console.error(`Error handling re-login attempts, Error: ${err.stack}`);
        }
    }
}

module.exports = {
    MoodleUser: MoodleUser
};