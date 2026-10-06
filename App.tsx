import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import HomeScreen from './src/screens/HomeScreen';
import MyBotScreen from './src/screens/MyBotScreen';
import BotStatusScreen from './src/screens/BotStatusScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import PricePrediction from './src/screens/PricePrediction';
import PMSScreen from './src/screens/PMSScreen';
import ArbitrageScreen from './src/screens/ArbitrageScreen';
import ArbitrageBot from './src/screens/ArbitrageBot';
import PlanScreen from './src/screens/PlanScreen';
import chart from './src/images/chart.png';
import bar from './src/images/bar.png';
import bot from './src/images/bot.png';
import bot1 from './src/images/bot1.png';
import robot from './src/images/robot.png';
import stack from './src/images/stack.png';
import sync from './src/images/sync.png';
import table from './src/images/table.png';
import user from './src/images/user.png';
import setting from './src/images/setting.png';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './src/components/Pixel';
import CustomSidebarMenu from './src/components/CustomSidebarMenu';
import {COLORS, Fonts} from './src/utils';
import NotificationScreen from './src/screens/NotificationScreen';
import messaging from '@react-native-firebase/messaging';
import SettingScreen from './src/screens/SettingScreen';
import TabBarComponent from './src/components/TabBarComponent';
import RemotePushController from './src/components/RemotePushController';
import PushNotification from 'react-native-push-notification';
import FlashMessage from 'react-native-flash-message';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { hasNotch } from 'react-native-device-info';
import LoadingScreen from './src/screens/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetNotificationListApi } from './src/services/Api';
import WalletScreen from './src/screens/WalletScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabBar = ({state, navigation, descriptors}) => {
  return (
    <TabBarComponent
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
};

const TabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      // tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS == 'ios' ? hp(7.5) : hp(7.5),
          backgroundColor: COLORS.white,
          borderColor: COLORS.lightWhite,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Platform.OS == 'ios' ? hasNotch() ? hp(3.3) : 0 : 0,
          position: 'absolute',
          bottom: hp(3),
          left: wp(6),
          right: wp(6),
          borderRadius: hp(3),
          shadowColor: COLORS.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 3,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {backgroundColor: focused ? COLORS.lightPrimary3 : COLORS.white},
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : COLORS.greyColor},
                  ]}
                  source={chart}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="BotStatusScreen"
        component={BotStatusScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : COLORS.white,
                    marginLeft: -wp(3),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView1,
                    {tintColor: focused ? COLORS.primary : COLORS.greyColor},
                  ]}
                  source={bot}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="PricePrediction"
        component={PricePrediction}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.AIRoundView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : COLORS.lightPrimary1,
                    borderWidth: 2,
                    borderColor: focused
                      ? COLORS.lightPrimary2
                      : COLORS.lightWhite,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: hp(3.5),
                    color: focused ? COLORS.primary : COLORS.white,
                    fontFamily: Fonts.FONTS.PoppinsBold,
                  }}>
                  AI
                </Text>
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : COLORS.white,
                    marginLeft: wp(3),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : COLORS.greyColor},
                  ]}
                  source={sync}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {backgroundColor: focused ? COLORS.lightPrimary3 : COLORS.white},
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : COLORS.greyColor},
                  ]}
                  source={setting}
                />
              </View>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function SettingStack() {
  return (
    <Stack.Navigator initialRouteName="SettingScreen">
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlanScreen"
        component={PlanScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArbitrageBot"
        component={ArbitrageBot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArbitrageScreen"
        component={ArbitrageScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PMSScreen"
        component={PMSScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyBotScreen"
        component={MyBotScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          minWidth: Platform.OS == 'ios' ? '65%' : '64%',
          marginRight: Platform.OS == 'ios' ? 0 : -wp(10),
        },
        drawerActiveTintColor: COLORS.primary,
        drawerLabelStyle: {
          fontSize: hp(2.2),
          fontFamily: Fonts.FONTS.PoppinsMedium,
          marginLeft: -wp(4),
        },
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Crypto',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={chart}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MyBotScreen"
        component={MyBotScreen}
        options={{
          headerShown: false,
          drawerLabel: 'My Bot',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot1}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="BotStatusScreen"
        component={BotStatusScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Bot Status',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Analytics',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={sync}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="PricePrediction"
        component={PricePrediction}
        options={{
          headerShown: false,
          drawerLabel: 'Price Prediction',
          drawerIcon: ({focused}) => (
            <Text
              style={{
                fontSize: hp(2.2),
                color: focused ? COLORS.primary : COLORS.iconColor,
              }}>
              AI
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="PMSScreen"
        component={PMSScreen}
        options={{
          headerShown: false,
          drawerLabel: 'PMS',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bar}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ArbitrageScreen"
        component={ArbitrageScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Arbitrage',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={table}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ArbitrageBot"
        component={ArbitrageBot}
        options={{
          headerShown: false,
          drawerLabel: 'Arbitrage Bot',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={robot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="PlanScreen"
        component={PlanScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Plans',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={stack}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Profile',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={user}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('Get Message:::>>', remoteMessage);
      const notification = await onGetNotificationListApi();
      if (notification.data) {
        let strNotify = notification.data.results;
        let count = 0;
        strNotify.map((item, index) => {
          if (item.recive == false) {
            count = count + 1;
          }
        });
        AsyncStorage.setItem('notificationCount', JSON.stringify(count));
      }
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TabStack"
            component={TabStack}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="MyDrawer"
            component={MyDrawer}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PlanScreen"
            component={PlanScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ArbitrageBot"
            component={ArbitrageBot}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ArbitrageScreen"
            component={ArbitrageScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PMSScreen"
            component={PMSScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyBotScreen"
            component={MyBotScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="WalletScreen"
            component={WalletScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
        {/* <RemotePushController /> */}
        <FlashMessage position={'top'} />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  bottomView: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView1: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: wp(12.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  AIRoundView: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    width: wp(6),
    height: hp(3),
    resizeMode: 'contain',
  },
  imageView1: {
    width: wp(6.5),
    height: hp(3),
    resizeMode: 'contain',
  },
});
