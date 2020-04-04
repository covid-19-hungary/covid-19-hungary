const POPULATION = 9773000;

const DEFAULT_TRANSMISSION_RATE_PER_DAY = 0.33;
const DEFAULT_RECOVERY_RATE_PER_DAY = 0.05;
const DEATH_RATE_PER_DAY = 0.0003; // TODO: with and without treatment

function getStarted() {
    let state = {
        day: 0,
        activeInfections: 20,
        deaths: 0,
        recoveries: 0
    };
    return {
        state,
        responses: [
            ...dailyReport(state),
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
        let { day, activeInfections, deaths, recoveries } = prevState;
        let nextDay = day + 1;
        let susceptible = POPULATION - activeInfections - deaths - recoveries;
        let newInfections = Math.round(DEFAULT_TRANSMISSION_RATE_PER_DAY * susceptible * activeInfections / POPULATION);
        let newRecoveries = Math.round(DEFAULT_RECOVERY_RATE_PER_DAY * activeInfections);
        let newDeaths = Math.round(DEATH_RATE_PER_DAY * activeInfections);
        let newState = {
            day: nextDay,
            activeInfections: activeInfections + newInfections - newRecoveries - newDeaths,
            deaths: deaths + newDeaths,
            recoveries: recoveries + newRecoveries
        };
        return {
            state: newState,
            responses: dailyReport(newState),
            quickReplies: quickReplies(1)
        };
    } else if(message == "Introduce Measures") {
        return {
            responses: ["Which measures do you want to apply?"],
            quickReplies: quickReplies(2)
        };

    } else if(message == "🧼👏, 🚫🤦") {
        return {
            responses: ["Good one!! the contagious rate decrease",
                        "Check the 'next day' to inspect the result of your measure."],
            quickReplies: quickReplies(2)
        };
    } else if(message == "Buy tons of 🧻"){
        return {
            responses: ["Boo!! you are not helping at all"],
            quickReplies: quickReplies(2)
        };

    } else if(message == "Isolate all cases"){
        return {
            responses: ["Good one!! the contagious rate decrease",
                        "Check the 'next day' to inspect the result of your measure."],
            quickReplies: quickReplies(2)
        };

    } else if(message == "Drinking alcohol"){
        return {
            responses: ["It is not solving anything"],
            quickReplies: quickReplies(2)
        };


    }else{
        return {
            responses: [
                "I don't understand",
                "Please choose from the provided replies",
                "If you want to survive :o",
            ],
            quickReplies: quickReplies(1)
        }
    }
}

const dailyReport = state => {
    let { day, activeInfections, deaths, recoveries } = state;
    return [
        formatDate(day),
        `Coronavirus cases: ${activeInfections + deaths + recoveries}\n` + // TODO: only show known ones
        `Deaths: ${deaths}\n` +
        `Recovered: ${recoveries}` // TODO: only show known ones
    ];
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
    let actions = ["🧼👏, 🚫🤦",
                    "Buy tons of 🧻",
                    "Isolate all cases",
                    "Drinking alcohol",
                    "Next day"];
    if(typeMenu == 1){
        return initial;
    }else{
        return actions;
    }
}
