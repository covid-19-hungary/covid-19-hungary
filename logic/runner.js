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

function handleMessage(prevState) {
    let day = prevState.day + 1;
    return {
        state: {
            day
        },
        responses: [formatDate(day)],
        quickReplies: ["Next day"]
    };
}

const formatDate = day => {
    let date = new Date(2020, 2, 4 + day); // starts from 2020-03-04
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = {
    getStarted,
    handleMessage
}
