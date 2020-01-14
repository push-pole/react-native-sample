package com.pushpole.sdk;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import com.pushpole.sdk.*;

import com.pushpole.sdk.service.RNPushPoleNotificationService;
import com.pushpole.sdk.utils.RNPushPoleIntent;
import com.pushpole.sdk.utils.RNPushPoleTypes;
import com.pushpole.sdk.utils.RNPushPoleWritable;


public class RNPushPole extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;

    /**
     * Check if App is on foreground or not base on
     * {@link com.facebook.react.bridge.LifecycleEventListener}
     * LifecycleEventListener should be added to the context
     */
    private boolean isAppOnForeground = false;

    public RNPushPole(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        this.reactContext.addLifecycleEventListener(this);

        this.initializeNotificationListeners();
    }

    @Override
    public String getName() {
        return "RNPushPole";
    }

    @ReactMethod
    public void initialize(Boolean showGooglePlayDialog) {
        PushPole.initialize(reactContext, showGooglePlayDialog);
    }

    @ReactMethod
    public void unsafe_isPushPoleInitialized(Callback callback) {
        callback.invoke(PushPole.isPushPoleInitialized(reactContext));
    }

    @ReactMethod
    public void isPushPoleInitialized(Promise promise) {
        promise.resolve(PushPole.isPushPoleInitialized(reactContext));
    }

    @ReactMethod
    public void unsafe_getPushPoleId(Callback callback) {
        callback.invoke(PushPole.getId(reactContext));
    }

    @ReactMethod
    public void getId(Promise promise) {
        promise.resolve(PushPole.getId(reactContext));
    }

    @ReactMethod
    public void subscribeTopic(String topicName) {
        PushPole.subscribe(reactContext, topicName);
    }

    @ReactMethod
    public void unsubscribeTopic(String topicName) {
        PushPole.unsubscribe(reactContext, topicName);
    }

    @ReactMethod
    public void setNotificationOff() {
        PushPole.setNotificationOff(reactContext);
    }

    @ReactMethod
    public void setNotificationOn() {
        PushPole.setNotificationOn(reactContext);
    }

    @ReactMethod
    public void sendSimpleNotifToUser(String pushpoleId, String title, String content) {
        PushPole.sendSimpleNotifToUser(reactContext, pushpoleId, title, content);
    }

    @ReactMethod
    public void sendAdvancedNotifToUser(String pushpoleId, String notificationJson, Promise promise) {
        try {
            PushPole.sendAdvancedNotifToUser(reactContext, pushpoleId, notificationJson);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendCustomJsonToUser(String pushpoleId, String json, Promise promise) {
        try {
            PushPole.sendCustomJsonToUser(reactContext, pushpoleId, json);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createNotificationChannel(
            String channelId,
            String channelName,
            String description,
            int importance,
            boolean enableLight,
            boolean enableVibration,
            boolean showBadge,
            int ledColor,
            ReadableArray vibrationPattern
    ) {
        long[] vibrationPatternArray = new long[vibrationPattern.size()];
        for (int i = 0; i < vibrationPattern.size(); i++) {
            vibrationPatternArray[i] = vibrationPattern.getInt(i);
        }

        PushPole.createNotificationChannel(reactContext, channelId, channelName,
                description, importance, enableLight, enableVibration, showBadge, ledColor,
                vibrationPatternArray);
    }

    @ReactMethod
    public void removeNotificationChannel(String channelId) {
        PushPole.removeNotificationChannel(reactContext, channelId);
    }

    // --------- Notification listeners -----------

    public void initializeNotificationListeners() {
        PushPole.setNotificationListener(new PushPole.NotificationListener() {
            @Override
            public void onNotificationReceived(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPushPoleTypes.EVENTS_TYPES.RECEIVED.getBroadcast(), new RNPushPoleWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPushPoleIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPushPoleTypes.EVENTS_TYPES.RECEIVED.getEvent());
                }
            }

            @Override
            public void onNotificationClicked(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPushPoleTypes.EVENTS_TYPES.CLICKED.getBroadcast(), new RNPushPoleWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPushPoleIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPushPoleTypes.EVENTS_TYPES.CLICKED.getEvent());
                }
            }

            @Override
            public void onNotificationButtonClicked(NotificationData notificationData, NotificationButtonData notificationButtonData) {
                if (isAppOnForeground) {
                    sendEvent(RNPushPoleTypes.EVENTS_TYPES.BUTTON_CLICKED.getBroadcast(), new RNPushPoleWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPushPoleIntent().getNotificationIntent(reactContext, notificationData);

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", notificationButtonData.getId());
                    map.put("text", notificationButtonData.getText());
                    Bundle bundle = new RNPushPoleIntent().mapToBundle(map);
                    intent.putExtra("notificationButtonData", bundle);

                    startHeadlessJsTask(intent, RNPushPoleTypes.EVENTS_TYPES.BUTTON_CLICKED.getEvent());
                }
            }

            @Override
            public void onCustomContentReceived(JSONObject customContent) {
                if (isAppOnForeground) {
                    sendEvent(RNPushPoleTypes.EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getBroadcast(), customContent.toString());
                } else {
                    Intent intent = new Intent(reactContext, RNPushPoleNotificationService.class);
                    intent.putExtra("customContent", customContent.toString());
                    startHeadlessJsTask(intent, RNPushPoleTypes.EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getEvent());
                }
            }

            @Override
            public void onNotificationDismissed(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPushPoleTypes.EVENTS_TYPES.DISMISSED.getBroadcast(), new RNPushPoleWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPushPoleIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPushPoleTypes.EVENTS_TYPES.DISMISSED.getEvent());
                }
            }
        });
    }

    private void sendEvent(String eventName, Object params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private void startHeadlessJsTask(Intent intent, String eventType) {
        intent.putExtra("EVENT_TYPE", eventType);

        reactContext.startService(intent);
        HeadlessJsTaskService.acquireWakeLockNow(reactContext);
    }

    // --------- LifeCycle methods ---------

    @Override
    public void onHostResume() {
        isAppOnForeground = true;
    }

    @Override
    public void onHostPause() {
        isAppOnForeground = false;
    }

    @Override
    public void onHostDestroy() {
        isAppOnForeground = false;
    }
}
