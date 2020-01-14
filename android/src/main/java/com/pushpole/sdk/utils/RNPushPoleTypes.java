package com.pushpole.sdk.utils;

public class RNPushPoleTypes {

    /**
     * These event types are equivalent to the types that are defined
     * in react native `index.js` file of pushpole-react-native
     */
    public enum EVENTS_TYPES {
        RECEIVED("PushPole-NotificationReceived", "received"),
        CUSTOM_CONTENT_RECEIVED("PushPole-CustomContentReceived", "custom_content_received"),
        CLICKED("PushPole-Clicked", "clicked"),
        DISMISSED("PushPole-Dismissed", "dismissed"),
        BUTTON_CLICKED("PushPole-ButtonClicked", "button_clicked");


        String broadcastEvent;
        String event;

        EVENTS_TYPES(String broadcastEvent, String event) {
            this.broadcastEvent = broadcastEvent;
            this.event = event;
        }

        public String getBroadcast() {
            return this.broadcastEvent;
        }

        public String getEvent() {
            return this.event;
        }
    }

}
