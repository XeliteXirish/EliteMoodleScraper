const MoodleUser = require('../src/index').MoodleUser;

let user;
if (process.env.TRAVIS) user = new MoodleUser(process.env.USERNAME, process.env.PASSWORD, process.env.MOODLE_URL);
else user = new MoodleUser('student', 'moodle', 'https://school.demo.moodle.net');

async function getUserLoggedIn() {
    if (!user.loggedIn) await user.login();
    return user;
}

test('Created the new moodle user object', () => {

    expect(user).toBeDefined();
});

test('Logs the user in correctly', async () => {

    expect(await getUserLoggedIn()).toBeTruthy();
});

test(`Fetch the user info`, async () => {
    const user = await getUserLoggedIn();

    expect(await user.fetchUserInfo()).toBeTruthy();

});

test('Fetch all the users modules', async () => {

    const user = await getUserLoggedIn();

    expect(await user.fetchModules()).toBeTruthy();
});

test('Fetch all the users grades', async () => {

    const user = await getUserLoggedIn();

    expect(await user.fetchGrades()).toBeTruthy();
});

test('Fetch all the moodle blog posts', async () => {

    const user = await getUserLoggedIn();

    expect(await user.fetchBlogPosts()).toBeTruthy();
});

test('Fetch the users calender', async () => {

    const user = await getUserLoggedIn();

    expect(await user.fetchCalender()).toBeTruthy();
});

test('Fetch the users sessions', async () => {

    const user = await getUserLoggedIn();

    expect(await user.fetchSessions()).toBeTruthy();
});
