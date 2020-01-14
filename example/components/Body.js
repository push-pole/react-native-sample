import React, {useState, useContext} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import PushPole from "pushpole-react-native";
import {AppContext} from "./AppProvider";
import CustomModal from "./CustomModal";
import Button from "./Button";
import {COLORS} from "../constants";

const Body = (props) => {
    const [modal, updateModal] = useState({
        visible: false,
        placeholder: "",
        callback: () => {},
    });

    const [appState, updateAppState] = useContext(AppContext);

    /*
     * Start PushPole callbacks
     */

    function updateState(label, value) {
        updateAppState([
            {label, value},
            ...appState,
        ]);
    }

    const isPushPoleInitialized = () => {
        PushPole.isPushPoleInitialized()
            .then(resp => {
                updateState("isPushPoleInitialized", resp.toString());
            });
    }

    const getId = () => {
        PushPole.getId()
            .then(resp => {
                updateState("PushPoleId", resp)
            });
    }

    const subscribeTopic = (topicName) => {
        PushPole.isPushPoleInitialized().then(resp => {
            if (resp) {
                PushPole.subscribeTopic(topicName);

                return updateState("Try subscribing to ", topicName);
            }

            updateState(`Cannot subscribe to "${topicName}", PushPole is not initialized yet.`, "");
        });  
    };

    const unsubscribeTopic = (topicName) => {
        PushPole.isPushPoleInitialized().then(resp => {
            if (resp) {
                PushPole.unsubscribeTopic(topicName);

                return updateState("Try unsubscribing from ", topicName);
            }

            updateState(`Cannot unsubscribe from "${topicName}", PushPole is not initialized yet.`, "");
        });  
    };

    const setNotificationOff = () => {
        PushPole.setNotificationOff();

        updateState("Turn off notification", "");
    };

    const setNotificationOn = () => {
        PushPole.setNotificationOn();

        updateState("Turn on notification", "");
    };

    const sendSimpleNotifToUser = (pushpoleId) => {
        PushPole.isPushPoleInitialized().then(resp => {
            if (resp) {
                PushPole.sendSimpleNotifToUser(pushpoleId, "Test Notification", "Hi there, this is just a test notification");

                return updateState(`Send a test notification to ${pushpoleId}`, "");
            }

            updateState("Cannot send notification, PushPole is not initialized yet", "");
        });
    };

    const sendAdvancedNotifToUser = (pushpoleId) => {
        PushPole.isPushPoleInitialized().then(resp => {
            if (resp) {
                PushPole.sendAdvancedNotifToUser(pushpoleId, JSON.stringify({ title: "Test Notification", content: "Hi there, this is an advanced test notification"}))
                    .then(() => {
                        updateState(`Send an advanced test notification to ${pushpoleId}`, "");
                    })
                    .catch((err) => {
                        updateState(`Cannot send advanced notifciation to ${pushpoleId}, ${err}`);
                    });
                    
                return;
            }

            updateState("Cannot send advanced notification, PushPole is not initialized yet", "");
        });
    };

    return (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.container}
          contentContainerStyle={{
            justifyContent: 'center',
          }}  
        >
            <View style={{paddingBottom: 20}}>

                <Button 
                    buttonLabel={`Is initialized?`}
                    onPress={isPushPoleInitialized}
                />

                <Button 
                    buttonLabel={`Get PushPole Id`}
                    onPress={getId}
                />

                <Button 
                    buttonLabel={`Subscribe to topic`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a topic name`,
                        callback: subscribeTopic,
                    })}
                />

                <Button 
                    buttonLabel={`Unsubscribe from a topic`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a topic name`,
                        callback: unsubscribeTopic,
                    })}
                />

                <Button 
                    buttonLabel={`Set notification off`}
                    onPress={setNotificationOff}
                />

                <Button 
                    buttonLabel={`Set notification on`}
                    onPress={setNotificationOn}
                />

                <Button 
                    buttonLabel={`Send a simple notification`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a pushpole id`,
                        callback: sendSimpleNotifToUser,
                    })}
                />

                <Button 
                    buttonLabel={`Send an advanced notification`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a pushpole id`,
                        callback: sendAdvancedNotifToUser,
                    })}
                />

                <CustomModal 
                    visible={modal.visible}
                    placeholder={modal.placeholder}
                    onModalClose={() => updateModal({
                        visible: false,
                        placeholder: "",
                        callback: () => {},
                    })}
                    onSubmit={(value) => {
                        modal.callback(value);
                        updateModal({
                            visible: false,
                            placeholder: "",
                            callback: () => {},
                        });
                    }}
                />
            </View>
        </ScrollView>
    );
}

export default Body;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '50%',
        display: 'flex',
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingTop: 10,
        paddingBottom: 40,
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: "#384e77",
    },
});