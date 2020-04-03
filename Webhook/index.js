const df = require("durable-functions");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

module.exports = async function (context, req) {
    if (req.method === "GET") {
        let isSubscribe = req.query["hub.mode"] === "subscribe";
        let isTokenCorrect = req.query["hub.verify_token"] === WEBHOOK_VERIFY_TOKEN;
        if (isSubscribe && isTokenCorrect) {
            return {
                status: 200,
                body: req.query["hub.challenge"]
            };
        } else {
            return {
                status: 403,
                body: ""
            };
        }
    } else if (req.method === "POST") {
        let client = df.getClient(context);
        let messagingItems = req.body.entry.flatMap(e => e.messaging);
        await Promise.all(messagingItems.map(messagingItem => {
            return client.startNew("MessageHandler", undefined, {
                messagingItem,
                pageAccessToken: PAGE_ACCESS_TOKEN
            });
        }));
        return {
            status: 200,
            body: "EVENT_RECEIVED"
        };
    }
};
