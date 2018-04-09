const MoodleUser = require('../src/index').MoodleUser;

test('Created the new moodle user object', () => {
    const moodleUser = new MoodleUser(process.env.USERNAME, process.env.PASSWORD, process.env.MOODLE_URL);
    expect(moodleUser).toBeTruthy();
})

test('Logs the user in correctly', async () => {
    expect.assertions(1);

    const logsIn = await new MoodleUser(process.env.USERNAME, process.env.PASSWORD, process.env.MOODLE_URL).login();
    expect(logsIn).toBe(true);
})