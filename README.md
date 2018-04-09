<h1 align="center">Elite Moodle Scraper</h1>
<h5 align="center">A modern and simple to use object orientated moodle scraper</h5>
<div align="center">
    <a href="https://travis-ci.com/XeliteXirish/EliteMoodleScraper">
        <img src="https://travis-ci.com/XeliteXirish/EliteMoodleScraper.svg?token=5pJCf8csqaNRFsJJAzsK&branch=master" alt="Build Status"/>
    </a>
</div>
<br/>

## Installation
```javascript
npm install --save elite-moodle-scraper
```

### Usage
```javascript
const MoodleUser = require('elite-moodle-scraper').MoodleUser;

const user = new MoodleUser('USERNAME', 'SUPER_SECRET_PASSWORD', 'BASE_MOODLE_URL');
user.login(async loggedIn => {
    await user.fetchUserInfo();
});
```

## Contributing
Before creating an issue, please ensure that the problem hasn't already been reported/suggested, and double-check the
[documentation](https://xelitexirish.github.io/EliteMoodleScraper/) to make sure it is actually an issue!
If you wish to contribute to the codebase or docs, feel free to fork the repository, make what ever changes
you want and then submit a pull request.  Make sure to include a description of whatever you change!
