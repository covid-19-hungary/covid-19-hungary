const runner = require('./runner');

test('getStarted should return an array of responses', () => {
    let { responses } = runner.getStarted();
    expect(responses.length).toBeGreaterThan(2);
})

test('"Next day" advances the day', () => {
    checkNextDay(0, "2020-03-05");
    checkNextDay(26, "2020-03-31");
    checkNextDay(27, "2020-04-01");
});

const checkNextDay = (day, formattedDate) => {
    let { state, responses } = runner.handleMessage({ day }, "Next day");
    expect(state.day).toBe(day + 1);
    expect(responses).toContain(formattedDate);
}
