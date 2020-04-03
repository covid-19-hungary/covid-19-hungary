const runner = require('./runner');

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

test("Unexpected messages don't change the state", () => {
    let { state } = runner.handleMessage("existing state", "Unexpected message");
    expect(state).toBe("existing state");
})
