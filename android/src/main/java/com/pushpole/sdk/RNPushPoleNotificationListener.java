package com.pushpole.sdk;

import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;

public class RNPushPoleNotificationListener {

    public static void enableNotificationListener(Context context) {
        new RNPushPole(new ReactApplicationContext(context)).initializeNotificationListeners();
    }
}
