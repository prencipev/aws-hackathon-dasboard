var PubNub = require('pubnub');

publish();

function publish() {

    pubnub = new PubNub({
        publishKey: 'pub-c-70966b5d-fa5f-41fe-990a-aa9bae9611f6',
        subscribeKey: 'sub-c-3084f536-1873-11e7-a5a9-0619f8945a4f'
    })

    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        var publishConfig = {
            channel: "Channel-3oh63vif9",
            message: "Hello from PubNub Docs!"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        })
    }

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function(message) {
            console.log("New Message!!", message);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['hello_world']
    });
};