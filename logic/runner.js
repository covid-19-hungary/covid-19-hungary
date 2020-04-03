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
        quickReplies: quickReplies(1)
    };
}

function handleMessage(prevState, message) {
    if (message == "Next day") {
        let day = prevState.day + 1;
        return {
            state: {
                day
            },
            responses: [formatDate(day),
                        "contagious rate is = ..%" ],
            quickReplies: quickReplies(1)
        };
    } else if(message == "Introduce Measures") {
        return {
            responses: ["Which measures do you want to apply?"],
            quickReplies: quickReplies(2)
        };

    } else if(message == "Washing hands, Avoid to touch your face") {
        return {
            responses: ["Good one!! the contagious rate decrease",
                        "Check Next day to see the result of your measure"],
            quickReplies: quickReplies(2)
        };
    } else if(message == "Buy tons of toilet paper"){
        return {
            responses: ["Boo!! you are not helping at all"],
            quickReplies: quickReplies(2)
        };

    } else if(message == "Identify positive cases and isolate"){
        return {
            responses: ["Good one!! the contagious rate decrease",
                        "Check  Next day to see the result of your measure"],
            quickReplies: quickReplies(2)
        };

    } else if(message == "Drinking alcohol"){
        return {
            responses: ["It is not solving anything"],
            quickReplies: quickReplies(2)
        };


    }else{
        return {
            state: prevState,
            responses: [
                "I don't understand",
                "Please choose from the provided replies",
                "If you want to survive :o",
            ],
            quickReplies: quickReplies(1)
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

function quickReplies(typeMenu) {
    let initial = ["Next day", "Introduce Measures"];
    let actions = ["Washing hands, Avoid to touch your face",
                    "Buy tons of toilet paper",
                    "Identify positive cases and isolate",
                    "Drinking alcohol",
                    "Next day"];
    if(typeMenu == 1){
        return initial;
    }else{
        return actions;
    }
}
