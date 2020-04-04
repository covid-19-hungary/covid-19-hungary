const runner = require('./runner');

test('getStarted should return an array of responses', () => {
    let { responses } = runner.getStarted();
    expect(responses.length).toBeGreaterThan(2);
})

test('"Next day" advances the day', () => {
    checkNextDay({ day: 0, activeInfections: 0, deaths: 0, recoveries: 0, transmissionRatePerDay: 0.33 }, "2020-03-05");
    checkNextDay({ day: 26, activeInfections: 500, deaths: 15, recoveries: 50, transmissionRatePerDay: 0.33 }, "2020-03-31");
    checkNextDay({ day: 27, activeInfections: 9000000, deaths: 100000, recoveries: 200000, transmissionRatePerDay: 0.33 }, "2020-04-01");
});

test('"Apply measures" reduce the transmission rate', () => {
    let prevState = { day: 0, activeInfections: 0, deaths: 0, recoveries: 0,  transmissionRatePerDay: 0.33};
    checkTransmissionRateDecrease(prevState,"🧼👏, 🚫🤦");
    checkTransmissionRateDecrease(prevState,"Isolate all cases");
});

const checkTransmissionRateDecrease = (prevState, Measure) => {
    let { state, responses } = runner.handleMessage(prevState, Measure);
    expect(state.transmissionRatePerDay).toBeLessThan(prevState.transmissionRatePerDay);
}

const checkNextDay = (prevState, formattedDate) => {
    let { state, responses } = runner.handleMessage(prevState, "Next day");
    expect(state.day).toBe(prevState.day + 1);
    expect(state.activeInfections).toBeGreaterThanOrEqual(0);
    expect(state.activeInfections).toBeLessThanOrEqual(runner.POPULATION - prevState.deaths - prevState.recoveries);
    expect(state.deaths).toBeGreaterThanOrEqual(prevState.deaths);
    expect(state.deaths).toBeLessThanOrEqual(prevState.deaths + prevState.activeInfections);
    expect(state.recoveries).toBeGreaterThanOrEqual(prevState.recoveries);
    expect(state.recoveries).toBeLessThanOrEqual(prevState.recoveries + prevState.activeInfections);
    expect(state.transmissionRatePerDay).toBe(prevState.transmissionRatePerDay);
    expect(responses).toContain(formattedDate);
}
