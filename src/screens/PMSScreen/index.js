import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Switch,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import {
  onGetAIDataApi,
  onGetActivePMSApi,
  onGetBalanceApi,
  onGetExtraHistoryApi,
  onGetHistoryDetailApi,
  onGetPMSHistoryDetailApi,
  onPostAIDataApi,
} from '../../services/Api';
import moment from 'moment';
import SubHeader from '../../components/SubHeader';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {fetchSttingData} from '../../redux/reducer';
import {debounce} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const activeDataArray = [
  {
    id: 1,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 2,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 3,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 4,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 5,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 6,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 7,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 8,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 9,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 10,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 11,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
];

const PMSScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const balanceData = useSelector(state => state.balanceData);
  const settingData = useSelector(state => state.settingData);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';

  const isFocused = useIsFocused();
  // const [balanceData, setBalanceData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [isPressArray, setIsPressArray] = useState([]);
  const [activeVisible, setActiveVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      // onGetBalance();
      onGetHistoryData();
      onGetActiveBotData();
      // onGetSettingData();
    });
  }, [navigation, settingData]);

  useEffect(() => {
    if (settingData) {
      setActiveVisible(settingData?.active_pms_trading);
    }
  }, [settingData]);

  // const onGetSettingData = async () => {
  //   try {
  //     const response = await onGetAIDataApi();
  //     console.log('Response Balance>>', response.data);
  //     if (response.data) {
  //       setActiveVisible(response.data?.active_pms_trading);
  //     }
  //   } catch (err) {
  //     console.log('Error:', err.response.data);
  //     // alert(err.response.data.detail);
  //   }
  // };

  // const onGetBalance = async () => {
  //   try {
  //     const response = await onGetBalanceApi();
  //     console.log('Response>>', response.data);
  //     if (response.data) {
  //       setBalanceData(response.data);
  //     }
  //   } catch (err) {
  //     console.log('Error:', err.response.data);
  //     // alert(err.response.data.detail);
  //   }
  // };

  const onGetActiveBotData = async () => {
    try {
      const response = await onGetActivePMSApi();
      if (response.data.active_trade_list) {
        setDataActive(response.data.active_trade_list);
        setIsPressArray1(Array(response.data.active_trade_list.length).fill(false));
      } else {
        console.log('Active Error:', response.data);
      }
    } catch (err) {
      console.log('Active Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  const countDecimalDigits = async number => {
    const numberString = number.toString();

    if (numberString.includes('.')) {
      // Split the string at the decimal point
      const decimalPart = numberString.split('.')[1];
      // Return the length of the decimal part
      return decimalPart.length;
    } else {
      // If there is no decimal point, return 0
      return 0;
    }
  };

  useEffect(() => {
    const fetchData = debounce(() => {
      var socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
      // const socket = new WebSocket(socketUrl + socketPath);
      if (dataActive.length > 0) {
        socket.onmessage = event => {
          const binanceWebSocketData = JSON.parse(event.data);

          // Update the tableData state based on WebSocket data
          setDataActive(prevData => {
            return prevData.map(item => {
              const binanceSymbolData = binanceWebSocketData.find(
                data => data.s === `${item.symbol}`,
              );
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              const decimalDigitsInPrice = countDecimalDigits(item.price);
              const latestLastprice = binanceSymbolData
                ? parseFloat(binanceSymbolData.c).toFixed(
                    decimalDigitsInPrice._j,
                  )
                : null;
              if (binanceSymbolData) {
                return {
                  ...item,
                  markPrice: latestLastprice,
                };
              }

              return item;
            });
          });
          socket.close();
        };
      }
    }, 1500);
    if (isFocused) {
      const interval = setInterval(fetchData, 1500);

      return () => clearInterval(interval);
    }
  }, [dataActive, isFocused, socketUrl]);

  const onGetHistoryData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response = await onGetPMSHistoryDetailApi();
      if (response.data.history_trade_list) {
        setDataHistory(response.data.history_trade_list.results);
        setIsPressArray(Array(response.data.history_trade_list.results.length).fill(false));
        setNextUrl(response.data.history_trade_list.next);
        setFilterHistory(response.data.history_trade_list.results);
      } else {
        console.log('History Error:', response.data);
      }
    } catch (err) {
      console.log('History Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  const onGetExtraHistoryData = async () => {
    try {
      if (nextUrl) {
        setIsFooterLoader(true);
        const response = await onGetExtraHistoryApi(nextUrl);
        if (response.data.history_trade_list) {
          // setDataHistory(response.data.history_trade_list.results);
          setIsFooterLoader(false);
          dataHistory.push(response.data.history_trade_list.results);
          filterHistory.push(response.data.history_trade_list.results);
          setNextUrl(response.data.history_trade_list.next);
          if (response.data.history_trade_list.previous != null) {
            setPrevUrl(response.data.history_trade_list.previous);
          }
        } else {
          setIsFooterLoader(false);
          console.log('History Error:', response.data);
        }
      }
    } catch (err) {
      setIsFooterLoader(false);
      console.log('History Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          height: hp(5),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const handleHideUnderlay = index => {
    setIsPressArray(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleShowUnderlay = index => {
    setIsPressArray(prevState => {
      const newState = [...prevState];
      newState.map((item, index1) => {
        if (index1 == index) {
          newState[index1] = true;
        } else {
          newState[index1] = false;
        }
      });
      return newState;
    });
  };

  const handleHideUnderlay1 = index => {
    setIsPressArray1(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleShowUnderlay1 = index => {
    setIsPressArray1(prevState => {
      const newState = [...prevState];
      newState.map((item, index1) => {
        if (index1 == index) {
          newState[index1] = true;
        } else {
          newState[index1] = false;
        }
      });
      return newState;
    });
  };

  const onPostSettingData = async value => {
    try {
      setActiveVisible(value);
      let raw = JSON.stringify({
        active_pms_trading: value,
      });
      const response = await onPostAIDataApi(raw);
      console.log('Response Balance>>', response.data);
      if (response.data) {
        dispatch(fetchSttingData(response.data));
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = filterHistory.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setDataHistory(filtered);
      setRefresh(!refresh);
    } else {
      setDataHistory(filterHistory);
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
          {/* <SubHeader title={'PMS'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={'PMS'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            notificationCount={notificationCount}
            backVisible={true}
            onPress={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.firstView}>
              <Text style={styles.updateProfileText}>
                {balanceData !== null &&
                balanceData?.crossWalletBalance !== null
                  ? `$ ${parseFloat(balanceData?.crossWalletBalance).toFixed(2)}`
                  : '$0'}
              </Text>
              <Text style={styles.updateProfileText1}>Balance</Text>
              <View style={{marginVertical: hp(3.5)}}>
                <Text style={styles.updateProfileText}>
                  {balanceData !== null &&
                  balanceData?.availableBalance !== null
                    ? `$ ${parseFloat(balanceData?.availableBalance).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.updateProfileText1}>Available Balance</Text>
              </View>
              <Text style={styles.updateProfileText}>
                {balanceData !== null && balanceData?.crossUnPnl !== null
                  ? `$ ${parseFloat(balanceData?.crossUnPnl).toFixed(2)}`
                  : '$0'}
              </Text>
              <Text style={styles.updateProfileText1}>P/L</Text>
            </View>
            <View style={styles.activeTitleView}>
              <Text style={styles.activeText}>Active</Text>
              <Switch
                trackColor={{
                  false: COLORS.errorColor,
                  true: COLORS.greenColor,
                }}
                thumbColor={activeVisible ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={COLORS.errorColor}
                onValueChange={() => onPostSettingData(!activeVisible)}
                value={activeVisible}
              />
            </View>
            <View style={styles.activeView}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView}>
                    <Text style={[styles.titleText, {width: wp(24)}]}>
                      DATE
                    </Text>
                    <Text style={[styles.titleText, {width: wp(24)}]}>
                      COIN
                    </Text>
                    <Text style={[styles.titleText, {width: wp(33)}]}>
                      ENTRY PRICE [$]
                    </Text>
                    <Text style={[styles.titleText, {width: wp(33)}]}>
                      LAST PRICE [$]
                    </Text>
                    <Text style={[styles.titleText, {width: wp(16)}]}>
                      TYPE
                    </Text>
                  </View>
                  <FlatList
                    data={dataActive}
                    extraData={dataActive}
                    initialNumToRender={5000000}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={{paddingBottom: hp(2)}}
                    keyExtractor={item => item.created_at}
                    ListEmptyComponent={() => (
                      <View style={{marginVertical: hp(10)}}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              paddingTop: 15,
                              color: COLORS.darkGreen,
                              fontSize: 16,
                            }}>
                            No Records Available
                          </Text>
                        </View>
                      </View>
                    )}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableHighlight
                          // onHideUnderlay={() => handleHideUnderlay1(index)}
                          onShowUnderlay={() => handleShowUnderlay1(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightGreen1}>
                          <View
                            key={item.created_at}
                            style={[
                              styles.dataActiveView,
                              {
                                backgroundColor: isPressArray1[index]
                                  ? COLORS.lightGreen1
                                  : COLORS.white,
                              },
                            ]}>
                            <Text style={[styles.dataText, {width: wp(24)}]}>
                              {moment(item?.time).format('YYYY-MM-DD')}
                            </Text>
                            <Text style={[styles.dataText, {width: wp(24)}]}>
                              {item.symbol}
                            </Text>
                            <Text style={[styles.dataText, {width: wp(33)}]}>
                              {item.price}
                            </Text>
                            <Text style={[styles.dataText, {width: wp(33)}]}>
                              {item.markPrice}
                            </Text>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  width: wp(16),
                                  color:
                                    item?.side === 'BUY'
                                      ? COLORS.greenColor
                                      : COLORS.errorColor,
                                },
                              ]}>
                              {item.side}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>

            <View style={styles.historyTitleView}>
              <Text style={styles.activeText}>History</Text>
              <TextInput
                value={search}
                onChangeText={text => handleSearch(text)}
                placeholder="Search Coin..."
                placeholderTextColor={COLORS.greyColor}
                style={styles.searchText}
              />
            </View>
            <View style={styles.historyView}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleHistoryView}>
                    <Text style={[styles.titleText, {width: wp(24)}]}>
                      DATE
                    </Text>
                    <Text style={[styles.titleText, {width: wp(24)}]}>
                      COIN
                    </Text>
                    <Text style={[styles.titleText, {width: wp(33)}]}>
                      ENTRY PRICE [$]
                    </Text>
                    <Text style={[styles.titleText, {width: wp(33)}]}>
                      LAST PRICE [$]
                    </Text>
                    <Text style={[styles.titleText, {width: wp(16)}]}>
                      TP/SL
                    </Text>
                    <Text style={[styles.titleText, {width: wp(16)}]}>
                      TYPE
                    </Text>
                  </View>
                  <FlatList
                    data={dataHistory}
                    extraData={dataHistory}
                    initialNumToRender={5000000}
                    nestedScrollEnabled
                    contentContainerStyle={{paddingBottom: hp(2)}}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.created_at}
                    ListEmptyComponent={() => (
                      <View style={{marginVertical: hp(10)}}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              paddingTop: 15,
                              color: COLORS.primary,
                              fontSize: 16,
                            }}>
                            No Records Available
                          </Text>
                        </View>
                      </View>
                    )}
                    ListFooterComponent={isFooterLoader ? renderFooter : null}
                    onEndReachedThreshold={0.001}
                    onEndReached={() => onGetExtraHistoryData()}
                    renderItem={({item, index}) => {
                      const decimalDigitsInPrice = countDecimalDigits(
                        item?.avgPrice,
                      );
                      return (
                        <TouchableHighlight
                          // onHideUnderlay={() => handleHideUnderlay(index)}
                          onShowUnderlay={() => handleShowUnderlay(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightPrimary2}>
                          <View
                            key={item.created_at}
                            style={[
                              styles.dataHistoryView,
                              {
                                backgroundColor: isPressArray[index]
                                  ? COLORS.lightPrimary2
                                  : COLORS.white,
                              },
                            ]}>
                            <Text
                              style={[styles.dataHistoryText, {width: wp(24)}]}>
                              {moment(item?.created_at).format('YYYY-MM-DD')}
                            </Text>
                            <Text
                              style={[styles.dataHistoryText, {width: wp(24)}]}>
                              {item?.symbol}
                            </Text>
                            <Text
                              style={[styles.dataHistoryText, {width: wp(33)}]}>
                              {parseFloat(item?.entry_price).toFixed(
                                decimalDigitsInPrice._j,
                              )}
                            </Text>
                            <Text
                              style={[styles.dataHistoryText, {width: wp(33)}]}>
                              {item?.avgPrice}
                            </Text>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  width: wp(16),
                                  color:
                                    item?.origFIlterType === 'TAKE_PROFIT_MARKET'
                                      ? COLORS.greenColor
                                      : item?.origFIlterType === 'MARKET'
                                      ? COLORS.black
                                      : COLORS.errorColor,
                                },
                              ]}>
                              {item?.origFIlterType === 'TAKE_PROFIT_MARKET'
                                ? 'TP'
                                : item?.origFIlterType === 'MARKET'
                                ? 'M'
                                : 'SL'}
                            </Text>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  width: wp(16),
                                  color:
                                    item?.side === 'BUY'
                                      ? COLORS.greenColor
                                      : COLORS.errorColor,
                                },
                              ]}>
                              {item.side}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default PMSScreen;
