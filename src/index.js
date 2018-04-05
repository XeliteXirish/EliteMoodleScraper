const axios = require('axios');
let request = require('request-promise').defaults({jar: true});
const cheerio = require('cheerio');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

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
        try {
            let res = await request.post({url: `${this.moodleURL}/login/index.php`, followAllRedirects: true, form: {username: this.username, password: this.password}, resolveWithFullResponse: true});
            this.cookie = res.request.headers.cookie;
            this.loggedIn = true;
            return this.loggedIn;

        }catch (err) {
            console.error(`Error logging in, Error: ${err}`)
        }
    }

    async getModules() {
        if (!this.loggedIn) return console.error(`Not logged in yet!`);

        let res = await axios.get(`${this.moodleURL}/user/profile.php`, {headers: {Cookie: this.cookie}});
        if (!(res.status >= 200 && res.status < 300)) return console.error(`Unable to fetch user modules, Error: ${res.statusText}`);

        const $ = cheerio.load(res.data);
        //console.log(res.text)
        console.log($('.node_category').children().length)
    }
}

module.exports = {
    MoodleUser: MoodleUser
};