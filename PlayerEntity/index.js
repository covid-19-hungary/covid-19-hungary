const df = require("durable-functions");
const runner = require("../logic/runner.js");

module.exports = df.entity(async context => {
    let messagingItem = context.df.getInput();
    context.log(`input: ${JSON.stringify(messagingItem)}`);
    let { state, responses, quickReplies } = run(messagingItem, context)
    context.df.setState(state);
    context.df.return({
        responses,
        quickReplies
    });
});

const run = (messagingItem, context) => {
    let { postback } = messagingItem;
    if (postback && postback.payload === "get_started") {
        return runner.getStarted();
    } else {
        let prevState = context.df.getState();
        return runner.handleMessage(prevState);
    }
}
