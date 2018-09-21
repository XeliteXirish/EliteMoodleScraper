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

    const logsIn = await getUserLoggedIn();
    expect(logsIn).toBeTruthy();
});

test('Test to make sure all modules are listed', async () => {

    const user = await getUserLoggedIn();
    const modules = await user.fetchModules();

    expect(modules).toBeTruthy();
});