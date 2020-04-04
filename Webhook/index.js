const df = require("durable-functions");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

module.exports = async function (context, req) {
    context.log(`req.rawBody: ${req.rawBody}`);
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
        let instanceIds = await Promise.all(req.body.entry.flatMap(entry => {
            return entry.messaging.map(async messagingItem => {
                let instanceId = `${entry.time}-${messagingItem.sender.id}`;
                // The player should be able to send only a single message/postback at a time.
                // If an instance with this instanceId already exists, this is probably a retried
                // webhook call, which we shouldn't handle.
                let existingInstance = await client.getStatus(instanceId);
                if (existingInstance) {
                    return instanceId;
                } else {
                    // There is race condition here.
                    // If the original webhook call's and a retried webhook call's processing reach
                    // this point at the same time, then both will start the orchestration.
                    // However, the chances of that are low enough, since FB only retries the call
                    // every few seconds.
                    return client.startNew("MessageHandler", instanceId, {
                        messagingItem,
                        pageAccessToken: PAGE_ACCESS_TOKEN
                    });
                }
            })
        }));
        context.log("MessageHandler instances started: " + instanceIds.join(", "));
        return {
            status: 200,
            body: "EVENT_RECEIVED"
        };
    }
};
