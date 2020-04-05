const df = require("durable-functions");
const runner = require("../logic/runner.js");

module.exports = df.entity(async context => {
    let messagingItem = context.df.getInput();
    context.log(`input: ${JSON.stringify(messagingItem)}`);
    let { state, responses, quickReplies } = run(messagingItem, context)
    if (state) {
        context.df.setState(state);
    }
    context.df.return({
        responses,
        quickReplies
    });
});

const run = (messagingItem, context) => {
    let { postback, message } = messagingItem;
    let isGetStarted = postback && postback.payload === "get_started";
    let prevState = context.df.getState();
    if (isGetStarted || !prevState) {
        return runner.getStarted();
    } else {
        return runner.handleMessage(prevState, message.text);
    }
}
