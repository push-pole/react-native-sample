import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNPushPole } = NativeModules;

const pushpoleEventEmitter = new NativeEventEmitter();

const EVENTS_TYPES = ["received", "clicked", "dismissed", "button_clicked", "custom_content_received"]

// key = events that user can attach handlers on them
// value = broadcast events that are emitted from the native 
// and are corrospond to the ones in (com.pushpole.sdk.utils)
const _pushpoleEvents = new Map([
    [EVENTS_TYPES[0], "PushPole-NotificationReceived"],
    [EVENTS_TYPES[1], "PushPole-Clicked"],
    [EVENTS_TYPES[2], "PushPole-Dismissed"],
    [EVENTS_TYPES[3], "PushPole-ButtonClicked"],
    [EVENTS_TYPES[4], "PushPole-CustomContentReceived"],
]);

// store all broadcastListeners (actually their returned subscriptions) and their handlers in this object
const _broadcastListeners = {}; 

const _cachedNotification = new Map();
const _userEventHandlers = new Map();

function _attachEventBroadcasts(event, nativeBroadcastEvent) {
    return pushpoleEventEmitter.addListener(nativeBroadcastEvent, (notification) => {
        let userEventHandler = _userEventHandlers.get(event);

        // Check if user already set a handler 
        // for this event type then call it 
        // if not cache notification for later
        if (userEventHandler) {
            userEventHandler(notification);
        } else {
            _cachedNotification.set(event, notification);
        }
    });
}

// Start point for attaching nativeBrodcast events
if (RNPushPole !== null) {
    _pushpoleEvents.forEach(function(nativeBroadcastEvent, event) {
        _broadcastListeners[event] = _attachEventBroadcasts(event, nativeBroadcastEvent);
    });
}

export default class PushPole {

    /**
     * Available events type to add listener on them
     */
    static EVENTS = {
        RECEIVED: EVENTS_TYPES[0],
        CLICKED: EVENTS_TYPES[1],
        DISMISSED: EVENTS_TYPES[2],
        BUTTON_CLICKED: EVENTS_TYPES[3],
        CUSTOM_CONTENT_RECEIVED: EVENTS_TYPES[4],
    }

    static addEventListener(eventType, eventHandler) {
        if (!eventHandler) return;

        // save user eventHandler 
        _userEventHandlers.set(eventType, eventHandler);

        // If already we have a cached notification for this eventType
        // call userEventHandler with this cached notification
        const cachedNotification = _cachedNotification.get(eventType);
        if (cachedNotification) {
            eventHandler(cachedNotification);
            _cachedNotification.delete(eventType);
        }
    }

    static removeEventListener(eventType) {
        _userEventHandlers.delete(eventType);
    }

    static clearListeners() {
        _pushpoleEvents.forEach((_value, key) => {
            pushpoleEventEmitter.removeAllListeners(_broadcastListeners[key]);
            _broadcastListeners.delete(key);
        });
    }

    /**
     * Initialize PushPole
     * 
     * @param {boolean} showGooglePlayDialog 
     */
    static initialize(showGooglePlayDialog = false) {
        RNPushPole.initialize(showGooglePlayDialog);
    }

    /**
     * Check if PushPole is initialized or not
     * 
     * if call this method with no parameter
     * it would return promise of type boolean
     * 
     * @param {function?} callbackFunc - A callback function
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isPushPoleInitialized(callbackFunc) {
        if (callbackFunc) {
            return RNPushPole.unsafe_isPushPoleInitialized(callbackFunc);
        }

        return RNPushPole.isPushPoleInitialized();
    }

    /**
     * get user's pushpole_id
     * 
     * if call this method with no parameter
     * it would return a promise.
     * 
     * @param {function?} callbackFunc - A callback function
     * @return {Promise<string>} Promise - if no callback passed
     */
    static getId(callbackFunc) {
        if (callbackFunc) {
            return RNPushPole.unsafe_getPushPoleId(callbackFunc);
        }

        return RNPushPole.getId();
    }

    /**
     * Subscribe a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static subscribeTopic(topicName) {
        RNPushPole.subscribeTopic(topicName);
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeTopic(topicName) {
        RNPushPole.unsubscribeTopic(topicName);
    }

    /**
     * Disable notification
     * 
     * @return void
     */
    static setNotificationOff() {
        RNPushPole.setNotificationOff();
    }

    /**
     * Enable notification
     * 
     * @return void
     */
    static setNotificationOn() {
        RNPushPole.setNotificationOn();
    }

    /**
     * Send a simple notification with only title and content
     * to another device with pushpoleId
     * 
     * @param {string} pushpoleId 
     * @param {string} title 
     * @param {string} content 
     * @return void
     */
    static sendSimpleNotifToUser(pushpoleId, title, content) {
        RNPushPole.sendSimpleNotifToUser(pushpoleId, title, content);
    }

    /**
     * Send an advanced notification with a json object
     * to another device with pushpoleId
     * 
     * @param {string} pushpoleId 
     * @param {string} notificationJson - A json object
     * @return {Promise<boolean|Error>} Promise - A proimse that resolve to `true` or reject with `Exception`
     */
    static sendAdvancedNotifToUser(pushpoleId, notificationJson) {
        return RNPushPole.sendAdvancedNotifToUser(pushpoleId, notificationJson);
    }

    /**
     * Send an custom notification with a json object
     * to another device with pushpoleId
     * 
     * @param {string} pushpoleId 
     * @param {string} notificationJson - A json object
     * @return {Promise<boolean|Error>} Promise - A proimse that resolve to `true` or reject with `Exception`
     */
    static sendCustomJsonToUser(pushpoleId, notificationJson) {
        return RNPushPole.sendCustomJsonToUser(pushpoleId, notificationJson);
    }

    /**
     * Create a notification channel (only Android 8.0+)
     * 
     * @param {string} channelId 
     * @param {string} channelName 
     * @param {string} description 
     * @param {number<int>} importance 
     * @param {boolean} enableLight 
     * @param {boolean} enableVibration 
     * @param {bollean} showBadge 
     * @param {number<int>} ledColor 
     * @param {array} vibrationPattern 
     * @return void
     */
    static createNotificationChannel(...params) {
        RNPushPole.createNotificationChannel(...params);
    }

    /**
     * Remove notification channel with channelId
     * 
     * @param {string} channelId 
     */
    static removeNotificationChannel(channelId) {
        RNPushPole.removeNotificationChannel(channelId);
    }

};
