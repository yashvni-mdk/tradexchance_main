import PushNotification from 'react-native-push-notification';
PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },

  popInitialNotification: true,
  requestPermissions: true,
});

export const LocalNotification = ({
  heading = 'IndicatorLeads',
  title = 'Local Notification Title',
  message = 'This is local notification demo in React Native app. Only shown, when expanded.',
  id = 'channel-id',
}) => {
  PushNotification.localNotification({
    channelId: id,
    autoCancel: true,
    bigText: message,
    subText: heading,
    title,
    message: message,
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    // actions: '["Yes", "No"]',
  });
};
