# PushPole React Native Module

PushPole react native module based on **PushPole Native Module v1.x** and 
Already just works for **android**.

## Example App

To check the example app and to see how implement pushpole in your react native app you can see the **demo app** in the **example** folder.

1. Clone the project into your local machine
	
	```bash
    git clone git@github.com:push-pole/pushpole-react-native.git
	```
2. go to the cloned repository then **cd** into the **example** directory.
3. then run the **npm install** command to install all required dependencies.
4. install **pushpole-react-native** modue with **npm i pushpole-react-native --save**
5. run bellow commands in seprate **bash** or **cmd**

	```bash
	npx react-native start
	```

	```bash
	npx react-native run-android
	```

## Install Module

> If you are using **PushPole React Native** prior to this version or
> (with **react-native-pushpole** package name),   
> to update to this version you can't just use **npm update** and
> to achieve that you should first **npm uninstall react-native-pushpole** and then
> install the new one with **npm i pushpole-react-native**.

To install this module in your project just run the bellow command in your 
react native application:

```bash
npm i pushpole-react-native --save
```

> If you are using react-native version less than 0.60.0 then you
> should run the command ```react-native link pushpole-react-native```

## Usage

To use the module import it from node_modules like bellow:

```javascript
import PushPole from "pushpole-react-native"
```

Initialize the project with bellow command:

```javascript
PushPole.initialize(false);
```


For more information read the [documentation](https://push-pole.com/docs/react-native).