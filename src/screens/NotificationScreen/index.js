import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import SubHeader from '../../components/SubHeader';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {fetchNotificationCount} from '../../redux/reducer';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetNotificationListApi,
  onPostNotificationListApi,
} from '../../services/Api';
import * as RNLocalize from 'react-native-localize';

const NotificationScreen = ({navigation, route}) => {
  const notificationList = useSelector(state => state.getNotificationList);
  const dispatch = useDispatch();
  const [notificationDate, setNotificationData] = useState([]);
  const [filterNotification, setFilterNotification] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notify = async () => {
      try {
        setLoading(true);
        const notification = await onGetNotificationListApi();
        if (notification.data) {
          console.log('get NotificationData::::', notification.data.results);
          setRefresh(!refresh);
          let value = notification.data.results;
          value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setNotificationData(value);
          setFilterNotification(value);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.log('err:', err);
      }
    };
    const subscribe = navigation.addListener('focus', () => {
      setNotificationCount(route.params.count);
      notify();
    });

    return subscribe;
  }, []);

  const onReadAllPress = async () => {
    try {
      let fastNoti = notificationDate;
      let notification = notificationDate;
      fastNoti.map((item, index) => {
        if (item.recive == false) {
          fastNoti[index].recive = true;
        }
      });
      setRefresh(!refresh);
      setFilterNotification(fastNoti);
      setNotificationData(fastNoti);
      setNotificationCount(0);
      dispatch(fetchNotificationCount(0));
      AsyncStorage.setItem('notificationCount', JSON.stringify(0));
      notification.map(async (item, index) => {
        let raw = JSON.stringify({
          recive: true,
        });
        const notificationData = await onPostNotificationListApi(item.id, raw);
      });
      //   if (item.readMessage == false) {
      //     notification[index].readMessage = true;
      //   }
      // });
      // setNotificationCount(0);
      // dispatch(fetchNotificationCount(0));
      // AsyncStorage.setItem('Notify', JSON.stringify(notification));
      // setRefresh(!refresh);
      // setFilterNotification(notification);
      // setNotificationData(notification);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handleSearch = async text => {
    setSearch(text);
    if (text !== '') {
      let allData = filterNotification;
      const filtered = allData.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setNotificationData(filtered);
      setRefresh(!refresh);
    } else {
      setNotificationData(filterNotification);
      setRefresh(!refresh);
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
          <SubHeader
            title={'Notification'}
            onPress={() => navigation.goBack()}
            rightValue={true}
            notificationCount={notificationCount}
            readPress={() => onReadAllPress()}
          />
        </View>
        <View style={styles.mainView}>
          <TextInput
            value={search}
            onChangeText={text => handleSearch(text)}
            placeholder="Search Coin..."
            placeholderTextColor={COLORS.greyColor}
            style={styles.searchText}
          />
          <FlatList
            data={notificationDate}
            extraData={notificationDate}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5000000}
            nestedScrollEnabled
            contentContainerStyle={{paddingBottom: hp(2)}}
            keyExtractor={item => item.date}
            ListEmptyComponent={() => (
              <>
                {loading ? null : (
                  <View style={{marginVertical: hp(10)}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          paddingTop: 15,
                          color: COLORS.black,
                          fontSize: 16,
                        }}>
                        No Records Available
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
            renderItem={({item, index}) => {
              return (
                <View
                  style={[
                    styles.dataActiveView,
                    {
                      backgroundColor: item.recive ? COLORS.white : COLORS.lightPrimary,
                    },
                  ]}
                  key={item?.date}>
                  <View style={styles.horizontalView}>
                    <Text style={styles.dataText}>{item.message.ticker}</Text>
                    <Text
                      style={[
                        styles.desText,
                        {
                          color:
                          item.message.trends === 'resistance-broken'
                              ? '#00008b'
                              : item.message.trends === 'bullish'
                              ? '#236a4f'
                              : item.message.trends === 'very-bullish'
                              ? '#349b73'
                              : item.message.trends === 'extremely-bullish'
                              ? '#39ff14'
                              : item.message.trends === 'support-broken'
                              ? '#4444b2'
                              : item.message.trends === 'bearish'
                              ? '#a81e08eb'
                              : item.message.trends === 'very-bearish'
                              ? '#d83218eb'
                              : item.message.trends === 'extremely-bearish'
                              ? '#ff3314'
                              : '#ffa500',
                        },
                      ]}>
                      {item.message.trends === 'resistance-broken'
                        ? 'Resistance Broken'
                        : item.message.trends === 'bullish'
                        ? 'Bullish'
                        : item.message.trends === 'very-bullish'
                        ? 'Very Bullish'
                        : item.message.trends === 'extremely-bullish'
                        ? 'Extremely Bullish'
                        : item.message.trends === 'support-broken'
                        ? 'Support Broken'
                        : item.message.trends === 'bearish'
                        ? 'Bearish'
                        : item.message.trends === 'very-bearish'
                        ? 'Very Bearish'
                        : item.message.trends === 'extremely-bearish'
                        ? 'Extremely Bearish'
                        : 'Neutral'}
                    </Text>
                  </View>
                  <View style={styles.verticalView}>
                    {/* <Text style={styles.dateText}>
                      {moment(item?.date).format('hh:mm:ss')}
                    </Text> */}
                    <Text style={styles.dateText}>
                      {moment(item?.created_at).tz(RNLocalize.getTimeZone()).format('DD MMM,YYYY , HH:mm')}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationScreen;
