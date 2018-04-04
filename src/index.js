const snekfetch = require('snekfetch');
const cheerio = require('cheerio');

class MoodleUser {

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
        let res = await snekfetch.post(`${this.moodleURL}/login/index.php`, {query: {username: this.username, password: this.password}})
        this.loggedIn = res.ok;

        // We're gona grab the cookie for future requests
        this.cookie = res.headers['set-cookie'][0].split(';')[0];
        console.log(res.text);
    }

    async getModules() {
        if (!this.loggedIn) return console.error(`Not logged in yet!`);

        let res = await snekfetch.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
        if (!res.ok) return console.error(`Unable to fetch user modules, Error: ${res.statusText}`);

        const $ = cheerio.load(res.text);
        //console.log(res.text)
        console.log($('.node_category').children().length)
    }
}

module.exports = {
    MoodleUser: MoodleUser
};