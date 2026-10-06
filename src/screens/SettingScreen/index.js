import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import pic1 from '../../images/pic1.jpg';
import next from '../../images/next.png';
import chart from '../../images/chart.png';
import bar from '../../images/bar.png';
import bot from '../../images/bot.png';
import bot1 from '../../images/bot1.png';
import robot from '../../images/robot.png';
import stack from '../../images/stack.png';
import wallet from '../../images/wallet.png';
import sync from '../../images/sync.png';
import table from '../../images/table.png';
import user from '../../images/user.png';
import {LogoutPopup} from '../../components/LogoutPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logout from '../../images/logout.png';
import {useSelector} from 'react-redux';

const SettingScreen = ({navigation}) => {
  // const notificationCount = useSelector(state => state.notificationCount);
  const getMenuList = useSelector(state => state.getMenuList);
  const [profileData, setProfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('ProfileScreen');
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      getProfileData();
    });
    return subscribe;
  }, [navigation]);

  const getProfileData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const selectedScreen = await AsyncStorage.getItem('selectedScreen');
      if (selectedScreen) {
        setSelectedValue(selectedScreen);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const onPressButton = item => {
    if (item == 'PROFILE') {
      navigation.navigate('ProfileScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'MY_BOT') {
      navigation.navigate('MyBotScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'PMS') {
      navigation.navigate('PMSScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'PLANS') {
      navigation.navigate('PlanScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'ARBITRAGE') {
      navigation.navigate('ArbitrageScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'ARBITRAGE_BOT') {
      navigation.navigate('ArbitrageBot');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'WALLET') {
      navigation.navigate('WalletScreen');
      AsyncStorage.setItem('selectedScreen', item);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: COLORS.white,
        }}
      />
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Header
            title={'Setting'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            onPress={() => navigation.openDrawer()}
            notificationCount={notificationCount}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(3)}}>
            {getMenuList.map((item, index) => {
              if (
                item != 'CRYPTO' &&
                item != 'BOT_STATUS' &&
                item != 'ANALYTICS' &&
                item != 'AI_PRICE_PREDICTION'
              ) {
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionView,
                      {
                        backgroundColor:
                          selectedValue == item ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => onPressButton(item)}>
                    <View style={styles.profileData}>
                      <Image
                        style={[
                          styles.nextImage2,
                          {
                            tintColor:
                              selectedValue == item ? COLORS.white : COLORS.black,
                          },
                        ]}
                        source={
                          item == 'PROFILE'
                            ? user
                            : item == 'MY_BOT'
                            ? bot1
                            : item == 'PMS'
                            ? bar
                            : item == 'ARBITRAGE'
                            ? table
                            : item == 'ARBITRAGE_BOT'
                            ? robot
                            : item == 'WALLET'
                            ? wallet
                            : stack
                        }
                      />
                      <Text
                        style={[
                          styles.activeText1,
                          {
                            color:
                              selectedValue == item ? COLORS.white : COLORS.black,
                          },
                        ]}>
                        {item == 'PROFILE'
                          ? 'Profile'
                          : item == 'MY_BOT'
                          ? 'My Bot'
                          : item == 'PMS'
                          ? 'PMS'
                          : item == 'PLANS'
                          ? 'Plans'
                          : item == 'ARBITRAGE'
                          ? 'Arbitrage'
                          : item == 'WALLET'
                          ? 'Wallet'
                          : 'Arbitrage Bot'}
                      </Text>
                    </View>
                    <View style={styles.logoutButton}>
                      <Image
                        source={next}
                        style={[
                          styles.nextImage1,
                          {
                            tintColor:
                              selectedValue == item ? COLORS.white : COLORS.black,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }
            })}

            {/* <TouchableOpacity
              style={[
                styles.optionView,
                {
                  backgroundColor:
                    selectedValue == 'MyBotScreen'
                      ? COLORS.primary
                      : COLORS.white,
                },
              ]}
              onPress={() => {
                navigation.navigate('MyBotScreen');
                AsyncStorage.setItem('selectedScreen', 'MyBotScreen');
              }}>
              <View style={styles.profileData}>
                <Image
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'MyBotScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                  source={bot1}
                />
                <Text
                  style={[
                    styles.activeText1,
                    {
                      color:
                        selectedValue == 'MyBotScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}>
                  My Bot
                </Text>
              </View>
              <View style={styles.logoutButton}>
                <Image
                  source={next}
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'MyBotScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionView,
                {
                  backgroundColor:
                    selectedValue == 'PMSScreen'
                      ? COLORS.primary
                      : COLORS.white,
                },
              ]}
              onPress={() => {
                navigation.navigate('PMSScreen');
                AsyncStorage.setItem('selectedScreen', 'PMSScreen');
              }}>
              <View style={styles.profileData}>
                <Image
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'PMSScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                  source={bar}
                />
                <Text
                  style={[
                    styles.activeText1,
                    {
                      color:
                        selectedValue == 'PMSScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}>
                  PMS
                </Text>
              </View>
              <View style={styles.logoutButton}>
                <Image
                  source={next}
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'PMSScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={styles.optionView}
              onPress={() => navigation.navigate('ArbitrageScreen'),AsyncStorage.setItem('selectedScreen', 'MyBotScreen')}>
              <View style={styles.profileData}>
                <Image style={styles.nextImage1} source={table} />
                <Text style={styles.activeText1}>Arbitrage</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate('ArbitrageScreen')}>
                <Image source={next} style={styles.nextImage1} />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionView}
              onPress={() => navigation.navigate('ArbitrageBot'),AsyncStorage.setItem('selectedScreen', 'MyBotScreen');}>
              <View style={styles.profileData}>
                <Image style={styles.nextImage1} source={robot} />
                <Text style={styles.activeText1}>Arbitrage Bot</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate('ArbitrageBot')}>
                <Image source={next} style={styles.nextImage1} />
              </TouchableOpacity>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={[
                styles.optionView,
                {
                  backgroundColor:
                    selectedValue == 'PlanScreen'
                      ? COLORS.primary
                      : COLORS.white,
                },
              ]}
              onPress={() => {
                navigation.navigate('PlanScreen');
                AsyncStorage.setItem('selectedScreen', 'PlanScreen');
              }}>
              <View style={styles.profileData}>
                <Image
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'PlanScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                  source={stack}
                />
                <Text
                  style={[
                    styles.activeText1,
                    {
                      color:
                        selectedValue == 'PlanScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}>
                  Plans
                </Text>
              </View>
              <View style={styles.logoutButton}>
                <Image
                  source={next}
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'PlanScreen'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.optionView}
              onPress={() => setModalVisible(true)}>
              <View style={styles.profileData}>
                <Image style={[styles.nextImage1, {tintColor: COLORS.errorColor}]} source={logout} />
                <Text style={[styles.activeText1, {color: COLORS.errorColor}]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => {
          AsyncStorage.setItem('accessToken', '');
          AsyncStorage.setItem('refreshToken', '');
          AsyncStorage.setItem('selectedScreen', '');
          AsyncStorage.setItem('Notify', '');
          navigation.replace('LoginScreen');
        }}
      />
    </View>
  );
};

export default SettingScreen;
