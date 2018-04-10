<h1 align="center"><b>Elite Moodle Scraper</b></h1>
<h5 align="center">A modern and simple to use object orientated moodle scraper</h5>
<div align="center">
    <p>
        <a href="https://travis-ci.com/XeliteXirish/EliteMoodleScraper">
            <img src="https://travis-ci.com/XeliteXirish/EliteMoodleScraper.svg?token=5pJCf8csqaNRFsJJAzsK&branch=master" alt="Build Status"/>
        </a>
        <a href="">
            <img src="https://discordapp.com/api/guilds/433054430045143050/embed.png" alt="Discord Invite"/>
        </a>
        <a href="https://discord.gg/Qq59KEV">
            <img src="https://img.shields.io/npm/v/elite-moodle-scraper.svg?maxAge=3600" alt="Version"/>
        </a>
        <a href="https://www.npmjs.com/package/elite-moodle-scraper">
            <img src="https://img.shields.io/npm/dt/elite-moodle-scraper.svg" alt="NPM Downloads"/>
        </a>
    </p>
    <p>
        <a href="https://nodei.co/npm/elite-moodle-scraper/"><img src="https://nodei.co/npm/elite-moodle-scraper.png?downloads=true&stars=true" alt="NPM Info"/></a>
    </p>
</div>
<br/>

## Features

 - Easily scrape data from multiple moodle accounts.

   - Fetch user info
   - Fetch modules
   - Fetch grades
   - Fetch upcoming calender
   - Fetch blog posts
   - Fetch previous sessions

 - Stores data in object cache.
 - After logging in, the login token is stored for future requests.
 - A fake user agent is used in order to help stay undetected.
 - Works with user accounts on different moodle websites at the same time!
<br/>

## Installation
```javascript
npm install --save elite-moodle-scraper
```

<br/>

### Example
```javascript
const MoodleUser = require('elite-moodle-scraper').MoodleUser;

const user = new MoodleUser('USERNAME', 'SUPER_SECRET_PASSWORD', 'BASE_MOODLE_URL');
user.login(async loggedIn => {
    await user.fetchUserInfo();
});
```

<br/>

## Contributing
Before creating an issue, please ensure that the problem hasn't already been reported/suggested, and double-check the
[documentation](https://xelitexirish.github.io/EliteMoodleScraper/) to make sure it is actually an issue!
If you wish to contribute to the codebase or docs, feel free to fork the repository, make what ever changes
you want and then submit a pull request.  Make sure to include a description of whatever you change!
