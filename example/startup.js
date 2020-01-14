import PushPole from "pushpole-react-native";

export function initializePushPole() {
    PushPole.initialize(false);
}

export function setupPushPoleEventListeners(updateState) {
    // Attach PushPole event listeners
    // These methods only works when app is on foreground
    // Check documentation for events in background mode

    PushPole.addEventListener(PushPole.EVENTS.RECEIVED, (notificationData) => {
        const data = notificationData ? JSON.stringify(notificationData) : "";

        updateState("Event", `Notification Received \n ${data}`);
    });

    PushPole.addEventListener(PushPole.EVENTS.CLICKED, () => {
        updateState("Event", "Notification Clicked");
    });

    PushPole.addEventListener(PushPole.EVENTS.DISMISSED, () => {
        updateState("Event", "Notification Dismissed");
    });

    PushPole.addEventListener(PushPole.EVENTS.BUTTON_CLICKED, (notificationData) => {
        const data = notificationData ? JSON.stringify(notificationData) : "";

        updateState("Event", `Notification Button Clicked \n ${data}`);
    });

    PushPole.addEventListener(PushPole.EVENTS.CUSTOM_CONTENT_RECEIVED, (customContent) => {
        updateState("Event", `Notification Custom Content Received \n ${customContent}`);
    });
}

export function clearPushPoleEvents() {
    PushPole.clearListeners();
}