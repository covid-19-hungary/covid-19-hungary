const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    let {messagingItem, pageAccessToken} = context.df.getInput();
    let senderId = messagingItem.sender.id
    let entityId = new df.EntityId("PlayerEntity", senderId);
    let {responses, quickReplies} =
        yield context.df.callEntity(entityId, "handleMessage", messagingItem);
    yield* sendResponses(senderId, responses, quickReplies, pageAccessToken, context);
});

function* sendResponses(recipientId, responseTexts, quickReplyTexts, pageAccessToken, context) {
    let quickReplies = quickReplyTexts.map(title => ({
        content_type: "text",
        title,
        payload: 0
    }));
    let url = `https://graph.facebook.com/v6.0/me/messages?access_token=${pageAccessToken}`;
    for (let i = 0; i < responseTexts.length; i++) {
        let isLast = i === responseTexts.length - 1;
        let text = responseTexts[i];
        let message = isLast ? {
            text,
            quick_replies: quickReplies
        } : {
            text
        };
        let requestContent = {
            messaging_type: "RESPONSE",
            recipient: {
                id: recipientId
            },
            message
        };
        let fbApiResponse = yield context.df.callHttp("POST", url, requestContent, {
            "Content-Type": "application/json"
        });
        context.log(`FB API response: ${JSON.stringify(fbApiResponse)}`);
    }
};
