const axios = require('axios');
let request = require('request-promise').defaults({jar: true});
const cheerio = require('cheerio');

/**
 * Moodle user
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
     * Will attempt log the account in
     * @return {Promise<Boolean>}
     */
    async login() {
        try {
            let res = await request.post({url: `${this.moodleURL}/login/index.php`, followAllRedirects: true, form: {username: this.username, password: this.password}, resolveWithFullResponse: true});
            this.cookie = res.request.headers.cookie;
            this.loggedIn = true;
            return this.loggedIn;

        }catch (err) {
            console.error(`Error logging in, Error: ${err}`)
        }
    }

    /**
     * Fetches the users information and stores it in the cache
     * @return {Promise<Object>}
     */
    async fetchUserInfo() {
        if (!this.loggedIn) return console.error(`Not logged in yet!`);
        let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
        this._statusCheck(res);

        const $ = cheerio.load(res.data);
        this.userInfo = {
            'name': $('.usertext').text(),
            'avatar': $('.userpicture').first().attr('src')
        };

        return this.userInfo;
    }

    /**
     * Fetches the users course modules and stores it in the cache
     * @return {Promise<Object>}
     */
    async fetchModules() {
        if (!this.loggedIn) return console.error(`Not logged in yet!`);

        let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
        this._statusCheck(res);

        const $ = cheerio.load(res.data);
        this.modules = $('.contentnode').children().first().children().last().children().first().children().map((i, elem) => $(elem).text()).get() || [];
        return this.modules;
    }

    /**
     * Fetches the users module grades and stores it in the cache
     * @return {Promise<Object>}
     */
    async fetchGrades() {
        if (!this.loggedIn) return console.error(`Not logged in yet!`);

        let res = await axios.get(`${this.moodleURL}/grade/report/overview/index.php`, {headers: {Cookie: this.cookie}});
        this._statusCheck(res);

        const $ = cheerio.load(res.data);
        this.grades = $('#overview-grade').children().last().children().not('.emptyrow').map((i, elem) => {
            return {name: $(elem).children().first().text(), value: $(elem).children().last().text()}
        }).get();

        return this.grades;
    }

    _statusCheck(res) {
        if (!(res.status >= 200 && res.status < 300)) return console.error(`Unable to fetch user data, Error: ${res.statusText}`);
    }
}

module.exports = {
    MoodleUser: MoodleUser
};