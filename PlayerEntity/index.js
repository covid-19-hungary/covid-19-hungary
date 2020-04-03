const df = require("durable-functions");

module.exports = df.entity(async context => {
    let {postback} = context.df.getInput();
    context.log(`input: ${JSON.stringify(context.df.getInput())}`);
    if (postback && postback.payload === "get_started") {
        context.df.setState({
            day: 0
        });
        context.df.return({
            responses: [
                formatDate(0),
                "Covid-19 has reached Hungary",
                "You've been selected to lead the crisis management",
                "I'd congratulate you, but you won't like this",
                "The shitstorm is coming",
                "Whatever you do, many will hate you",
                "But you need to do this",
                "For the people"
            ],
            quickReplies: ["Next day"]
        });
    } else {
        let prevState = context.df.getState();
        let day = prevState.day + 1;
        context.df.setState({
            day
        });
        context.df.return({
            responses: [formatDate(day)],
            quickReplies: ["Next day"]
        });
    }
});

const formatDate = day => {
    let date = new Date(2020, 2, 4 + day); // starts from 2020-03-04
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}
