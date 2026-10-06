import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TouchableHighlight,
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
import PieChart from 'react-native-pie-chart';
import LinearGradient from 'react-native-linear-gradient';
import chart from '../../images/chart.png';
import logo from '../../images/logo.png';
import {
  onGetAnalyticsDataApi,
  onGetBinanceDataApi,
  onGetMarketSentiDataApi,
  onGetTickerDataApi,
} from '../../services/Api';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AnalyticsSkeleton from '../../components/AnalyticsSkeleton';
import LossSkeleton from '../../components/LossSkeleton';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {debounce} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorList = [
  ['#ffb561', '#ffc482', '#e2ba8c'],
  ['rgb(233,255,171)', 'rgb(238,255,189)', 'rgb(243,255,207)'],
  ['rgb(163,199,237)', 'rgb(182,210,241)', 'rgb(201,222,244)'],
  ['rgb(171,255,171)', 'rgb(190,255,190)', 'rgb(208,255,208)'],
  ['rgb(255,197,197)', 'rgb(255,211,211)', 'rgb(250,218,218)'],
  ['rgb(171,171,255)', 'rgb(189,189,255)', 'rgb(208,208,255)'],
];

const AnalyticsScreen = ({navigation}) => {
  const tickerData = useSelector(state => state.tickerData);
  const binanceData = useSelector(state => state.binanceData);
  const analyticsCoinData = useSelector(state => state.analyticsCoinData);
  // const notificationCount = useSelector(state => state.notificationCount);
  const socketUrl = Config.OLD_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/!ticker@arr';

  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [grawData, setGrawData] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [coinDataList, setCoinDataList] = useState([]);
  const [coinFilter, setCoinFilter] = useState([]);
  const [allCoinData, setAllCoinData] = useState([]);
  const [services, setServices] = useState([90, 90]);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [isPressArray, setIsPressArray] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const widthAndHeight = 250;
  const sliceColor = [COLORS.errorColor, COLORS.greenColor];

  useEffect(() => {
    // onTickerListGet();
    marketSentiApp();
  }, []);

  useEffect(() => {
    if (analyticsCoinData) {
      setCoinDataList(analyticsCoinData);
      setCoinFilter(analyticsCoinData);
    }
  }, []);

  useEffect(() => {
    const getValueOfTickerData = async () => {
      try {
        let count = await AsyncStorage.getItem('notificationCount');
        setNotificationCount(count);
        setIsSkeletonVisible(true);
        if (binanceData) {
          let allTicker = [];
          tickerData.map(item => {
            allTicker.push({symbol: item});
          });
          allTicker.map((item, index) => {
            binanceData.map(item1 => {
              if (item.symbol === item1.symbol) {
                allTicker[index] = item1;
              }
            });
          });
          setAllCoinData(allTicker);
          // const sortedData = allTicker.sort((a, b) => {
          //   // Handling undefined values
          //   if (a.priceChangePercent === undefined && b.priceChangePercent === undefined) {
          //     return 0; // Leave them in the order they are in, since both are undefined
          //   } else if (a.priceChangePercent === undefined) {
          //     return 1; // Move items with undefined priceChangePercent to the end
          //   } else if (b.priceChangePercent === undefined) {
          //     return -1; // Move items with undefined priceChangePercent to the end
          //   }

          //   // Sorting by positive values first, then by magnitude
          //   if (a.priceChangePercent >= 0 && b.priceChangePercent >= 0) {
          //     return b.priceChangePercent - a.priceChangePercent; // Sort by positive values in descending order
          //   } else if (a.priceChangePercent >= 0 && b.priceChangePercent < 0) {
          //     return -1; // a comes before b
          //   } else if (a.priceChangePercent < 0 && b.priceChangePercent >= 0) {
          //     return 1; // b comes before a
          //   } else {
          //     // Sort by negative values in ascending order
          //     return a.priceChangePercent - b.priceChangePercent;
          //   }
          // });
          const positiveData = [];
          const undefinedData = [];
          let allTicker1 = allTicker;
          allTicker.forEach(item => {
            if (item.priceChangePercent !== undefined) {
              if (item.priceChangePercent >= 0) {
                positiveData.push(item);
              }
            } else {
              undefinedData.push(item);
            }
          });
          const sortedPositiveData = positiveData.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
          const sortedData = sortedPositiveData.concat(undefinedData);
          setGrawData(sortedData);
          setIsPressArray1(Array(sortedData.length).fill(false));

          const sortedData1 = allTicker1.sort((a, b) => {
            // Handling undefined values
            if (a.priceChangePercent === undefined && b.priceChangePercent === undefined) {
              return 0; // Leave them in the order they are in, since both are undefined
            } else if (a.priceChangePercent === undefined) {
              return 1; // Move items with undefined priceChangePercent to the end
            } else if (b.priceChangePercent === undefined) {
              return -1; // Move items with undefined priceChangePercent to the end
            }

            // Sorting by negative values first
            if (a.priceChangePercent < 0 && b.priceChangePercent >= 0) {
              return -1; // a comes before b
            } else if (a.priceChangePercent >= 0 && b.priceChangePercent < 0) {
              return 1; // b comes before a
            } else {
              return a.priceChangePercent - b.priceChangePercent; // Sort normally
            }
          });
          setDataHistory(sortedData1);
          setIsPressArray(Array(sortedData1.length).fill(false));
          setIsSkeletonVisible(false);
        }
      } catch (err) {
        console.log('Error::', err);
        setIsSkeletonVisible(false);
      }
    };
    getValueOfTickerData();
  }, []);

  // const onTickerListGet = async () => {
  //   try {
  //     const response = await onGetTickerDataApi();
  //     if (response.data?.data) {
  //       getValueOfTickerData(response.data?.data);
  //     } else {
  //       console.log('Error::', response.data);
  //     }
  //   } catch (err) {
  //     setIsSkeletonVisible(false);
  //     console.log('Error::', err);
  //   }
  // };

  // const getValueOfTickerData = async ticker => {
  //   try {
  //     setIsSkeletonVisible(true);
  //     const response = await onGetBinanceDataApi();
  //     if (response.data) {
  //       let allTicker = [];
  //       ticker.map(item => {
  //         response.data.map(item1 => {
  //           if (item1.symbol === item) {
  //             allTicker.push(item1);
  //           }
  //         });
  //       });
  //       setAllCoinData(allTicker);
  //       const sortedData = allTicker.sort(
  //         (a, b) => b.priceChangePercent - a.priceChangePercent,
  //       );
  //       setGrawData(sortedData.slice(0, 7));
  //       setIsPressArray1(Array(sortedData.length).fill(false));
  //       const sortedData1 = allTicker.sort(
  //         (a, b) => a.priceChangePercent - b.priceChangePercent,
  //       );
  //       setDataHistory(sortedData1.slice(0, 7));
  //       setIsPressArray(Array(sortedData1.length).fill(false));
  //       setIsSkeletonVisible(false);
  //     } else {
  //       setIsSkeletonVisible(false);
  //       console.log('Error::', response.data);
  //     }
  //   } catch (err) {
  //     setIsSkeletonVisible(false);
  //     console.log('Error get::', err);
  //   }
  // };

  useEffect(() => {
    const fetchData = () => {
      let socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
      // const socket = new WebSocket(socketUrl + socketPath);
      if (allCoinData.length > 0) {
        socket.onmessage = event => {
          const binanceWebSocketData = JSON.parse(event.data);
          // setAllCoinData(prevData => {
          //   return prevData.map(item => {
          //     // const binanceSymbolData = binanceWebSocketData.find(
          //     //   data => data.s === `${item.symbol}`,
          //     // );
          //     const binanceSymbolData = binanceWebSocketData[item.symbol];
          //     if (binanceSymbolData) {
          //       return {
          //         ...item,
          //         priceChangePercent: binanceSymbolData.P,
          //         lastPrice: binanceSymbolData.c,
          //       };
          //     }
          //     return item;
          //   });
          // });
          setGrawData(prevData => {
            let value = prevData.map(item => {
              const binanceSymbolData = binanceWebSocketData.find(
                data => data.s === `${item.symbol}`,
              );
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              if (binanceSymbolData) {
                return {
                  ...item,
                  priceChangePercent: binanceSymbolData.P,
                  lastPrice: binanceSymbolData.c,
                };
              }
              return item;
            });
            value.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
            return value;
          });
          setDataHistory(prevData => {
            let value = prevData.map(item => {
              const binanceSymbolData = binanceWebSocketData.find(
                data => data.s === `${item.symbol}`,
              );
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              if (binanceSymbolData) {
                return {
                  ...item,
                  priceChangePercent: binanceSymbolData.P,
                  lastPrice: binanceSymbolData.c,
                };
              }
              return item;
            });
            value.sort((a, b) => a.priceChangePercent - b.priceChangePercent);
            return value;
          });
          socket.close();
        };
      }
    };
    if (isFocused) {
      const interval = setInterval(fetchData, 1500);
      console.log('get Analytics Screen>>>>>>>');
      return () => clearInterval(interval);
    }
  }, [isFocused, socketUrl, allCoinData, refresh]);

  const marketSentiApp = async () => {
    try {
      const response = await onGetMarketSentiDataApi();
      // console.log('Response>>', response.data);
      if (response.data) {
        let buy = Object.values(response.data?.buy_count).length;
        let sell = Object.values(response.data?.sell_count).length;
        setServices([sell, buy]);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  // const onGetAnalyticsData = async () => {
  //   try {
  //     const response = await onGetAnalyticsDataApi();
  //     console.log('Response>>', response.data);
  //     if (response.data) {
  //       setCoinDataList(response.data);
  //       setCoinFilter(response.data);
  //     }
  //   } catch (err) {
  //     console.log('Error:', err.response.data);
  //   }
  // };

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = coinDataList.filter(follower =>
        follower.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setRefresh(!refresh);
      setCoinFilter(filtered);
    } else {
      setRefresh(!refresh);
      setCoinFilter(coinDataList);
    }
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
            title={'Analytics'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            onPress={() => navigation.openDrawer()}
            notificationCount={notificationCount}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(10)}}>
            <View style={styles.activeTitleView}>
              <Text style={styles.activeText}>Growing</Text>
            </View>
            <View style={styles.activeView}>
              <View style={styles.titleActiveView}>
                <Text
                  style={[
                    styles.titleText,
                    {width: wp(30), textAlign: 'left'},
                  ]}>
                  COIN
                </Text>
                <Text style={[styles.titleText, {width: wp(20)}]}>%</Text>
                <Text
                  style={[
                    styles.titleText,
                    {width: wp(30), textAlign: 'right'},
                  ]}>
                  PRICE
                </Text>
              </View>
              {isSkeletonVisible ? (
                <AnalyticsSkeleton />
              ) : (
                <FlatList
                  data={grawData}
                  bounces={false}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  // contentContainerStyle={{paddingBottom: hp(2)}}
                  keyExtractor={item => item.symbol}
                  ListEmptyComponent={() => (
                    <View style={{marginVertical: hp(15)}}>
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
                    if (index <= 6) {
                      return (
                        <TouchableHighlight
                          // onHideUnderlay={() => handleHideUnderlay1(index)}
                          onShowUnderlay={() => handleShowUnderlay1(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightGreen1}>
                          <View
                            key={item.symbol}
                            style={[
                              styles.dataActiveView,
                              {
                                backgroundColor: isPressArray1[index]
                                  ? COLORS.lightGreen1
                                  : COLORS.white,
                              },
                            ]}>
                            <Text style={[styles.dataText1, {width: wp(30)}]}>
                              {item.symbol}
                            </Text>
                            <Text style={[styles.dataText, {width: wp(20)}]}>
                              {parseFloat(item.priceChangePercent).toFixed(2)}%
                            </Text>
                            <Text style={[styles.dataText2, {width: wp(30)}]}>
                              {item.lastPrice}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.historyTitleView}>
              <Text style={styles.activeText}>Losing</Text>
            </View>
            <View style={styles.historyView}>
              <View style={styles.titleHistoryView}>
                <Text
                  style={[
                    styles.titleText,
                    {width: wp(30), textAlign: 'left'},
                  ]}>
                  COIN
                </Text>
                <Text style={[styles.titleText, {width: wp(20)}]}>%</Text>
                <Text
                  style={[
                    styles.titleText,
                    {width: wp(30), textAlign: 'right'},
                  ]}>
                  PRICE
                </Text>
              </View>
              {isSkeletonVisible ? (
                <LossSkeleton />
              ) : (
                <FlatList
                  data={dataHistory}
                  nestedScrollEnabled
                  bounces={false}
                  // contentContainerStyle={{paddingBottom: hp(2)}}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.symbol}
                  ListEmptyComponent={() => (
                    <View style={{marginVertical: hp(15)}}>
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
                  renderItem={({item, index}) => {
                    if (index <= 6) {
                      return (
                        <TouchableHighlight
                          onShowUnderlay={() => handleShowUnderlay(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightPrimary2}>
                          <View
                            key={item.symbol}
                            style={[
                              styles.dataHistoryView,
                              {
                                backgroundColor: isPressArray[index]
                                  ? COLORS.lightPrimary2
                                  : COLORS.white,
                              },
                            ]}>
                            <Text style={[styles.dataText1, {width: wp(30)}]}>
                              {item.symbol}
                            </Text>
                            <Text
                              style={[styles.dataHistoryText, {width: wp(20)}]}>
                              {parseFloat(item.priceChangePercent).toFixed(2)}%
                            </Text>
                            <Text style={[styles.dataText2, {width: wp(30)}]}>
                              {item.lastPrice}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }
                  }}
                />
              )}
            </View>

            <View
              style={[
                styles.historyTitleView,
                {backgroundColor: COLORS.orange},
              ]}>
              <Text style={styles.activeText}>Market Sentimate</Text>
            </View>
            <View style={styles.chartView}>
              <PieChart
                widthAndHeight={widthAndHeight}
                series={services}
                sliceColor={sliceColor}
              />

              <View style={styles.chartData}>
                <View style={styles.redDot} />
                <Text style={styles.valueText}>{services[0]} Sell</Text>
                <View style={styles.greenDot} />
                <Text style={styles.valueText}>{services[1]} Buy</Text>
              </View>
            </View>

            {/* <View style={styles.searchView}> */}
            <TextInput
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder="Search by symbol"
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />
            {/* </View> */}
            <View style={styles.coinCardMainView}>
              <FlatList
                data={coinFilter}
                initialNumToRender={5000000}
                bounces={false}
                keyExtractor={item => item.symbol}
                nestedScrollEnabled
                renderItem={({item, index}) => {
                  return (
                    <View key={item.symbol} style={styles.cardView}>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={colorList[index % colorList.length]}
                        style={styles.linearGradient}>
                        <View style={styles.coinNameView}>
                          <View style={styles.coinView}>
                            <Image style={styles.chartImage} source={chart} />
                            <Text style={styles.nameText}>{item?.symbol}</Text>
                          </View>
                          <View style={styles.whiteRound}>
                            <Image style={styles.chartImage1} source={logo} />
                          </View>
                        </View>
                        <Text style={styles.coinText}>{item?.tagline}</Text>
                        <Text style={styles.timeText}>
                          {moment(item.created_at).format(
                            'hh:mm:ss YYYY-MM-DD',
                          )}
                        </Text>
                        <Text style={styles.linkText}>
                          {'indicatorlead.com'}
                        </Text>
                      </LinearGradient>
                    </View>
                  );
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default AnalyticsScreen;
