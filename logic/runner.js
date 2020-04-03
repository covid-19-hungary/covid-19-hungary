function getStarted() {
    let day = 0;
    return {
        state: {
            day
        },
        responses: [
            formatDate(day),
            "Covid-19 has reached Hungary",
            "You've been selected to lead the crisis management",
            "I'd congratulate you, but you won't like this",
            "The shitstorm is coming",
            "Whatever you do, many will hate you",
            "But you need to do this",
            "For the people"
        ],
        quickReplies: ["Next day"]
    };
}

function handleMessage(prevState, message) {
    if (message == "Next day") {
        let day = prevState.day + 1;
        return {
            state: {
                day
            },
            responses: [formatDate(day)],
            quickReplies: ["Next day"]
        };
    } else {
        return {
            state: prevState,
            responses: [
                "I don't understand",
                "Please choose from the provided replies"
            ],
            quickReplies: ["Next day"]
        }
    }
}

const formatDate = day => {
    let date = new Date(2020, 2, 4 + day); // starts from 2020-03-04
    let year = date.getFullYear();
    let mm = (date.getMonth() + 1).toString().padStart(2, '0');
    let dd = date.getDate().toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

module.exports = {
    getStarted,
    handleMessage
}
