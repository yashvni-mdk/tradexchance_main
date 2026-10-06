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
  Modal,
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
import {COLORS, Fonts} from '../../utils';
import star from '../../images/star.png';
import star1 from '../../images/star1.png';
import bell1 from '../../images/bell1.png';
import bell2 from '../../images/bell2.png';
import downArrow from '../../images/downArrow.png';
import upArrow from '../../images/upArrow.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  onDeleteFavoriteDataApi,
  onDeleteNotificationDataApi,
  onGetBinanceDataApi,
  onGetFavoriteStatusApi,
  onGetFuturePriceApi,
  onGetNotificationStatusApi,
  onGetPercentStatusApi,
  onGetTickerDataApi,
  onPostFavoriteStatusApi,
  onPostNotificationStatusApi,
  sendPushNotification,
} from '../../services/Api';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import {BottomOptionMenu} from '../../components/BottomOptionMenu';
import PredictionSkeleton from '../../components/PredictionSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {FilterOptionPopup} from '../../components/FilterOptionPopup';
import {useSelector, useDispatch} from 'react-redux';
import {fetchNotificationCount} from '../../redux/reducer';

const titleArray = [
  {
    id: 1,
    name: 'Neutral',
    color: 'rgb(255 165 0)',
  },
  {
    id: 2,
    name: 'Bullish',
    color: 'rgb(35 106 79)',
  },
  {
    id: 3,
    name: 'Bearish',
    color: '#A81E08',
  },
  {
    id: 4,
    name: 'Very Bullish',
    color: 'rgb(52 155 115)',
  },
  {
    id: 5,
    name: 'Very Bearish',
    color: '#d83218',
  },
  {
    id: 6,
    name: 'Extremely Bullish',
    color: 'rgb(57,255,20)',
  },
  {
    id: 7,
    name: 'Extremely Bearish',
    color: 'rgb(255 51 20)',
  },
  {
    id: 8,
    name: 'Resistance Broken',
    color: 'rgb(0 0 139)',
  },
  {
    id: 9,
    name: 'Support Broken',
    color: 'rgb(68 68 178)',
  },
];

const skeletonArray = ['1', '2', '3'];

const optionArray = [
  {
    id: 1,
    name: 'Extremely Bullish',
    selected: false,
  },
  {
    id: 2,
    name: 'Very Bullish',
    selected: false,
  },
  {
    id: 3,
    name: 'Bullish',
    selected: false,
  },
  {
    id: 4,
    name: 'Neutral',
    selected: false,
  },
  {
    id: 5,
    name: 'Bearish',
    selected: false,
  },
  {
    id: 6,
    name: 'Very Bearish',
    selected: false,
  },
  {
    id: 7,
    name: 'Extremely Bearish',
    selected: false,
  },
];

let notifyCount = 0;
const PricePrediction = ({navigation}) => {
  const dispatch = useDispatch();
  const percentageStatusData = useSelector(state => state.percentageStatusData);
  const settingData = useSelector(state => state.settingData);
  const pricePredicationData = useSelector(state => state.pricePredicationData);
  const futurePriceData = useSelector(state => state.futurePriceData);
  const tickerData = useSelector(state => state.tickerData);
  const binanceData = useSelector(state => state.binanceData);
  const favoriteData = useSelector(state => state.favoriteData);
  const notificationData = useSelector(state => state.notificationData);
  // const notificationCount = useSelector(state => state.notificationCount);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [search, setSearch] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [notification, setNotification] = useState(false);
  const [allCoinData, setAllCoinData] = useState([]);
  const [coinSort, setCoinSort] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [currentP, setCurrentP] = useState(0);
  const [AITrend, setAITrend] = useState(false);
  const [FutureTarget, setFutureTarget] = useState(0);
  const [percentage, setPercentage] = useState([]);
  const [tickerSelected, setTickerSelected] = useState('');
  const [trendSelect, setTrendSelect] = useState('None');
  const [bottomModal, setBottomModal] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [trandsOptionArray, setTrandOptionArray] = useState(optionArray);
  const [notificationCount, setNotificationCount] = useState(0);

  notifyCount = notificationCount;
  // useEffect(() => {
  //   setDataActive(pricePredicationData);
  //   setAllCoinData(pricePredicationData);
  //   setPercentage(percentageStatusData);
  //   setIsSkeletonVisible(false);
  // }, [percentageStatusData, pricePredicationData]);

  function determineTrend(earlierTrend, currentTrend) {
    if (earlierTrend === null || currentTrend === null) {
      return 'none'; // Return nothing if either trend is null
    }
    const trendOrder = [
      'support-broken',
      'bearish',
      'very-bearish',
      'extremely-bearish',
      'resistance-broken',
      'bullish',
      'very-bullish',
      'extremely-bullish',
      'neutral',
    ];
    const earlierIndex = trendOrder.indexOf(earlierTrend);
    const currentIndex = trendOrder.indexOf(currentTrend);

    if (currentIndex > earlierIndex) {
      return 'high'; // Current trend is more bullish or bearish
    } else {
      return 'low'; // Current trend is less bullish or bearish
    }
  }

  // const commonTickers = dataDict.filter((value) => {
  //   return futurePriceData.some(
  //     (futurePriceEntry) =>
  //       futurePriceEntry.ticker === value &&
  //       futurePriceEntry.tomorrow_prediction !== 0
  //   );
  // });

  // useEffect(() => {
  //   onTickerListGet();
  //   onPercentageListGet();
  // }, []);

  useEffect(() => {
    const getValueOfTickerData = async () => {
      try {
        if (binanceData) {
          setPercentage(percentageStatusData);
          let allTicker = [];
          let allTicket1 = [];
          let prevTrend;
          tickerData.map(item => {
            allTicker.push({symbol: item});
          });
          allTicker.map((item, index) => {
            binanceData.map(item1 => {
              if (item1.symbol === item.symbol) {
                allTicker[index] = item1;
              }
            });
          });
          // const response2 = await onGetFavoriteStatusApi();
          allTicker.map((item, index) => {
            favoriteData.map(item1 => {
              if (item1 === item.symbol) {
                allTicker[index].favoriteStatus = true;
              }
            });
          });
          // const response3 = await onGetNotificationStatusApi();
          allTicker.map((item, index) => {
            notificationData.map(item1 => {
              if (item1.ticker === item.symbol) {
                allTicker[index].notificationStatus = true;
                allTicker[index].trends = item1.trends;
              }
            });
          });
          // const response1 = await onGetFuturePriceApi();
          allTicker.map((item, index) => {
            futurePriceData.map(item1 => {
              if (item1.ticker === item.symbol) {
                allTicket1.push({
                  ...item,
                  tomorrow_prediction: item1.tomorrow_prediction,
                  day_after_tomorrow_prediction:
                    item1.day_after_tomorrow_prediction,
                });
                // allTicket1[index].tomorrow_prediction = item1.tomorrow_prediction;
                // allTicket1[index].day_after_tomorrow_prediction =
                //   item1.day_after_tomorrow_prediction;
              }
            });
          });
          // const response5 = await onGetPercentStatusApi();
          allTicket1 = allTicket1.map(item => {
            const randomPercentageValue = percentageStatusData.find(
              data => data.ticker === `${item.symbol}`,
            )?.percentage;
            if (randomPercentageValue) {
              const lastPrice = item?.markPrice || '-';
              const predictionAnalysisEntry = futurePriceData.find(
                entry => entry.ticker === `${item.symbol}`,
              );
              const currentTrend =
                futurePriceData.find(entry => entry.ticker === `${item.symbol}`)
                  ?.ai_current_trends || null;

              const earlierTrend =
                futurePriceData.find(entry => entry.ticker === `${item.symbol}`)
                  ?.ai_previous_trends || null;
              const result = determineTrend(earlierTrend, currentTrend);
              const predictionAnalysis =
                predictionAnalysisEntry?.tomorrow_prediction_analysis;

              let formattedPredictionAnalysis;

              if (
                predictionAnalysis !== null &&
                !isNaN(parseFloat(predictionAnalysis))
              ) {
                formattedPredictionAnalysis =
                  parseFloat(predictionAnalysis).toFixed(2);
              } else if (typeof predictionAnalysis === 'string') {
                formattedPredictionAnalysis = predictionAnalysis;
              } else {
                formattedPredictionAnalysis = '-';
              }
              const futurePriceVisible =
                futurePriceData.find(entry => entry.ticker === `${item.symbol}`)
                  ?.ai_target || '-';
              const formattedFuturePriceVisible =
                typeof futurePriceVisible === 'number'
                  ? futurePriceVisible.toFixed(3)
                  : '-';
              // Check if the values are valid numbers
              const lastPriceNumber = parseFloat(lastPrice);
              const tomorrowPredictionNumber = parseFloat(
                item.tomorrow_prediction,
              );
              const supportPredictionNumber = parseFloat(
                item.day_after_tomorrow_prediction,
              );
              let percentageChange = '-';
              if (
                !isNaN(lastPriceNumber) &&
                !isNaN(tomorrowPredictionNumber) &&
                lastPriceNumber !== 0
              ) {
                // Calculate the percentage change
                percentageChange =
                  ((tomorrowPredictionNumber - lastPriceNumber) /
                    lastPriceNumber) *
                  100;
                percentageChange = percentageChange.toFixed(2);

                // Change the sign based on positive or negative value
                if (percentageChange > 0) {
                  // If it's positive, make it negative
                  percentageChange = '-' + percentageChange;
                } else if (percentageChange < 0) {
                  // If it's negative, remove the negative sign (make it positive)
                  percentageChange = percentageChange.substring(1);
                }
              }

              let sPercentageChange = '-';
              if (
                !isNaN(lastPriceNumber) &&
                !isNaN(supportPredictionNumber) &&
                lastPriceNumber !== 0
              ) {
                // Calculate the percentage change
                sPercentageChange =
                  ((supportPredictionNumber - lastPriceNumber) /
                    lastPriceNumber) *
                  100;
                sPercentageChange = sPercentageChange.toFixed(2);
              }
              let finalPercentage;
              let isR;
              let status;
              if (percentageChange !== '-' && sPercentageChange !== '-') {
                finalPercentage = Math.max(
                  parseFloat(percentageChange),
                  parseFloat(sPercentageChange),
                ).toFixed(2);
                isR =
                  parseFloat(percentageChange) > parseFloat(sPercentageChange);
              } else if (percentageChange !== '-') {
                finalPercentage = percentageChange;
                isR = true;
              } else {
                finalPercentage = sPercentageChange;
                isR = false;
              }
              // let futurePriceVisible = 0;
              let selectedValue = 0;
              if (isR) {
                const futurePrice =
                  (tomorrowPredictionNumber * randomPercentageValue) / 100;
                selectedValue = tomorrowPredictionNumber;
                // futurePriceVisible = tomorrowPredictionNumber + futurePrice;
                if (finalPercentage >= 0 && finalPercentage <= 1) {
                  status = 'Resistance Broken';
                } else if (finalPercentage > 1 && finalPercentage <= 5) {
                  status = 'Bullish';
                } else if (finalPercentage > 5 && finalPercentage <= 10) {
                  status = 'Very Bullish';
                } else if (finalPercentage > 10) {
                  status = 'Extremely Bullish';
                } else if (finalPercentage < 0) {
                  status = 'Neutral';
                }
              } else {
                selectedValue = supportPredictionNumber;
                const futurePrice =
                  (supportPredictionNumber * randomPercentageValue) / 100;
                // futurePriceVisible = supportPredictionNumber - futurePrice;
                if (finalPercentage >= 0 && finalPercentage <= 1) {
                  status = 'Support Broken';
                } else if (finalPercentage > 1 && finalPercentage <= 5) {
                  status = 'Bearish';
                } else if (finalPercentage > 5 && finalPercentage <= 10) {
                  status = 'Very Bearish';
                } else if (finalPercentage > 10) {
                  status = 'Extremely Bearish';
                } else if (finalPercentage < 0) {
                  status = 'Neutral';
                }
              }
              // const trendAlert =
              // trendAlertdata.find((entry) => entry.ticker === ticker)?.trends ||
              // "-";
              const originalNumber = parseFloat(item.lastPrice);
              const formattedNumber = originalNumber
                .toFixed(10)
                .replace(/\.?0*$/, '');
              return {
                ...item,
                selectedValue: selectedValue,
                result: result,
                currentTrend,
                earlierTrend,
                priceChangePercent: item.priceChangePercent,
                lastPrice: formattedNumber,
                futurePriceVisible: formattedFuturePriceVisible,
                status: status,
                day_after_tomorrow_prediction: supportPredictionNumber,
                tomorrow_prediction: tomorrowPredictionNumber,
              };
            }
            return item;
          });
          setDataActive(allTicket1);
          setAllCoinData(allTicket1);
          setIsSkeletonVisible(false);
        }
      } catch (err) {
        console.log('Error::', err);
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

  // const onPercentageListGet = async () => {
  //   try {
  //     const response = await onGetPercentStatusApi();
  //     if (response.data) {
  //       setPercentage(response.data);
  //     } else {
  //       console.log('Error::', response.data);
  //     }
  //   } catch (err) {
  //     console.log('Error::', err);
  //   }
  // };

  // const getValueOfTickerData = async ticker => {
  //   try {
  //     setIsSkeletonVisible(true);
  //     const response = await onGetBinanceDataApi();
  //     if (response.data) {
  //       let allTicker = [];
  //       let allTicket1 = [];
  //       ticker.map(item => {
  //         allTicker.push({symbol: item});
  //       });
  //       allTicker.map((item, index) => {
  //         response.data.map(item1 => {
  //           if (item1.symbol === item.symbol) {
  //             console.log('get congif data:::', item1.lastPrice);
  //             allTicker[index] = item1;
  //           }
  //         });
  //       });
  //       const response2 = await onGetFavoriteStatusApi();
  //       allTicker.map((item, index) => {
  //         response2.data.withlist.tickers_list.map(item1 => {
  //           if (item1 === item.symbol) {
  //             allTicker[index].favoriteStatus = true;
  //           }
  //         });
  //       });
  //       const response3 = await onGetNotificationStatusApi();
  //       allTicker.map((item, index) => {
  //         response3.data.map(item1 => {
  //           if (item1.ticker === item.symbol) {
  //             allTicker[index].notificationStatus = true;
  //             allTicker[index].trends = item1.trends;
  //           }
  //         });
  //       });
  //       const response1 = await onGetFuturePriceApi();
  //       allTicker.map((item, index) => {
  //         response1.data.map(item1 => {
  //           if (item1.ticker === item.symbol) {
  //             allTicket1.push({
  //               ...item,
  //               tomorrow_prediction: item1.tomorrow_prediction,
  //               day_after_tomorrow_prediction:
  //                 item1.day_after_tomorrow_prediction,
  //             });
  //             // allTicket1[index].tomorrow_prediction = item1.tomorrow_prediction;
  //             // allTicket1[index].day_after_tomorrow_prediction =
  //             //   item1.day_after_tomorrow_prediction;
  //           }
  //         });
  //       });
  //       const response5 = await onGetPercentStatusApi();
  //       allTicket1 = allTicket1.map(item => {
  //         const randomPercentageValue = response5.data.find(
  //           data => data.ticker === `${item.symbol}`,
  //         )?.percentage;
  //         if (randomPercentageValue) {
  //           // Check if the values are valid numbers
  //           const lastPriceNumber = parseFloat(item.lastPrice);
  //           const tomorrowPredictionNumber = parseFloat(
  //             item.tomorrow_prediction,
  //           );
  //           const supportPredictionNumber = parseFloat(
  //             item.day_after_tomorrow_prediction,
  //           );
  //           let percentageChange = '-';
  //           if (
  //             !isNaN(lastPriceNumber) &&
  //             !isNaN(tomorrowPredictionNumber) &&
  //             lastPriceNumber !== 0
  //           ) {
  //             // Calculate the percentage change
  //             percentageChange =
  //               ((tomorrowPredictionNumber - lastPriceNumber) /
  //                 lastPriceNumber) *
  //               100;
  //             percentageChange = percentageChange.toFixed(2);

  //             // Change the sign based on positive or negative value
  //             if (percentageChange > 0) {
  //               // If it's positive, make it negative
  //               percentageChange = '-' + percentageChange;
  //             } else if (percentageChange < 0) {
  //               // If it's negative, remove the negative sign (make it positive)
  //               percentageChange = percentageChange.substring(1);
  //             }
  //           }

  //           let sPercentageChange = '-';
  //           if (
  //             !isNaN(lastPriceNumber) &&
  //             !isNaN(supportPredictionNumber) &&
  //             lastPriceNumber !== 0
  //           ) {
  //             // Calculate the percentage change
  //             sPercentageChange =
  //               ((supportPredictionNumber - lastPriceNumber) /
  //                 lastPriceNumber) *
  //               100;
  //             sPercentageChange = sPercentageChange.toFixed(2);
  //           }
  //           let finalPercentage;
  //           let isR;
  //           let status;
  //           if (percentageChange !== '-' && sPercentageChange !== '-') {
  //             finalPercentage = Math.max(
  //               parseFloat(percentageChange),
  //               parseFloat(sPercentageChange),
  //             ).toFixed(2);
  //             isR =
  //               parseFloat(percentageChange) > parseFloat(sPercentageChange);
  //           } else if (percentageChange !== '-') {
  //             finalPercentage = percentageChange;
  //             isR = true;
  //           } else {
  //             finalPercentage = sPercentageChange;
  //             isR = false;
  //           }
  //           let futurePriceVisible = 0;
  //           let selectedValue = 0;
  //           if (isR) {
  //             const futurePrice =
  //               (tomorrowPredictionNumber * randomPercentageValue) / 100;
  //             selectedValue = tomorrowPredictionNumber;
  //             futurePriceVisible = tomorrowPredictionNumber + futurePrice;
  //             if (finalPercentage >= 0 && finalPercentage <= 1) {
  //               status = 'Resistance Broken';
  //             } else if (finalPercentage > 1 && finalPercentage <= 5) {
  //               status = 'Bullish';
  //             } else if (finalPercentage > 5 && finalPercentage <= 10) {
  //               status = 'Very Bullish';
  //             } else if (finalPercentage > 10) {
  //               status = 'Extremely Bullish';
  //             } else if (finalPercentage < 0) {
  //               status = 'Neutral';
  //             }
  //           } else {
  //             selectedValue = supportPredictionNumber;
  //             const futurePrice =
  //               (supportPredictionNumber * randomPercentageValue) / 100;
  //             futurePriceVisible = supportPredictionNumber - futurePrice;
  //             if (finalPercentage >= 0 && finalPercentage <= 1) {
  //               status = 'Support Broken';
  //             } else if (finalPercentage > 1 && finalPercentage <= 5) {
  //               status = 'Bearish';
  //             } else if (finalPercentage > 5 && finalPercentage <= 10) {
  //               status = 'Very Bearish';
  //             } else if (finalPercentage > 10) {
  //               status = 'Extremely Bearish';
  //             } else if (finalPercentage < 0) {
  //               status = 'Neutral';
  //             }
  //           }
  //           const originalNumber = parseFloat(item.lastPrice);
  //           const formattedNumber = originalNumber
  //             .toFixed(10)
  //             .replace(/\.?0*$/, '');
  //           return {
  //             ...item,
  //             selectedValue: selectedValue,
  //             priceChangePercent: item.priceChangePercent,
  //             lastPrice: formattedNumber,
  //             futurePriceVisible: futurePriceVisible,
  //             status: status,
  //             day_after_tomorrow_prediction: supportPredictionNumber,
  //             tomorrow_prediction: tomorrowPredictionNumber,
  //           };
  //         }
  //         return item;
  //       });
  //       setDataActive(allTicket1);
  //       setAllCoinData(allTicket1);
  //       setIsSkeletonVisible(false);
  //     } else {
  //       setIsSkeletonVisible(false);
  //       console.log('Error::', response.data);
  //     }
  //   } catch (err) {
  //     setIsSkeletonVisible(false);
  //     console.log('Error::', err);
  //   }
  // };

  let resistanceBrokenCount = 0;
  let bullishCount = 0;
  let veryBullishCount = 0;
  let extremelyBullishCount = 0;
  let neutralCount = 0;
  let supportBrokenCount = 0;
  let bearishCount = 0;
  let veryBearishCount = 0;
  let extremelyBearishCount = 0;

  dataActive.forEach(item => {
    if (item.currentTrend === 'resistance-broken') {
      resistanceBrokenCount++;
    }
    if (item.currentTrend === 'bullish') {
      bullishCount++;
    }
    if (item.currentTrend === 'very-bullish') {
      veryBullishCount++;
    }
    if (item.currentTrend === 'extremely-bullish') {
      extremelyBullishCount++;
    }
    if (item.currentTrend === 'neutral') {
      neutralCount++;
    }
    if (item.currentTrend === 'support-broken') {
      supportBrokenCount++;
    }
    if (item.currentTrend === 'bearish') {
      bearishCount++;
    }
    if (item.currentTrend === 'very-bearish') {
      veryBearishCount++;
    }
    if (item.currentTrend === 'extremely-bearish') {
      extremelyBearishCount++;
    }
  });

  useEffect(() => {
    let socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
    const fetchData = async () => {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      // const socket = new WebSocket(socketUrl + socketPath);
      if (allCoinData.length > 0) {
        // const fcmToken = await AsyncStorage.getItem('fcmToken');
        // let notifyData = await AsyncStorage.getItem('Notify');
        socket.onmessage = event => {
          const binanceWebSocketData = JSON.parse(event.data);
          setAllCoinData(prevData => {
            return prevData.map(item => {
              const binanceSymbolData = binanceWebSocketData.find(
                data => data.s == item.symbol,
              );
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              const randomPercentageValue = percentage.find(
                data => data.ticker === `${item.symbol}`,
              )?.percentage;
              if (binanceSymbolData) {
                const lastPriceNumber = parseFloat(binanceSymbolData.c);
                const tomorrowPredictionNumber = parseFloat(
                  item.tomorrow_prediction,
                );
                const supportPredictionNumber = parseFloat(
                  item.day_after_tomorrow_prediction,
                );
                let percentageChange = '-';
                if (
                  !isNaN(lastPriceNumber) &&
                  !isNaN(tomorrowPredictionNumber) &&
                  lastPriceNumber !== 0
                ) {
                  // Calculate the percentage change
                  percentageChange =
                    ((tomorrowPredictionNumber - lastPriceNumber) /
                      lastPriceNumber) *
                    100;
                  percentageChange = parseFloat(percentageChange).toFixed(2);

                  if (percentageChange > 0) {
                    percentageChange = '-' + percentageChange;
                  } else if (percentageChange < 0) {
                    percentageChange = percentageChange.substring(1);
                  }
                }
                let sPercentageChange = '-';
                if (
                  !isNaN(lastPriceNumber) &&
                  !isNaN(supportPredictionNumber) &&
                  lastPriceNumber !== 0
                ) {
                  // Calculate the percentage change
                  sPercentageChange =
                    ((supportPredictionNumber - lastPriceNumber) /
                      lastPriceNumber) *
                    100;
                  sPercentageChange = parseFloat(sPercentageChange).toFixed(2);
                }
                let finalPercentage;
                let isR;
                if (percentageChange !== '-' && sPercentageChange !== '-') {
                  finalPercentage = Math.max(
                    parseFloat(percentageChange),
                    parseFloat(sPercentageChange),
                  ).toFixed(2);
                  isR =
                    parseFloat(percentageChange) >
                    parseFloat(sPercentageChange);
                } else if (percentageChange !== '-') {
                  finalPercentage = percentageChange;
                  isR = true;
                } else {
                  finalPercentage = sPercentageChange;
                  isR = false;
                }
                let futurePriceVisible = 0;
                let selectedValue = 0;
                if (isR) {
                  const futurePrice =
                    (tomorrowPredictionNumber * randomPercentageValue) / 100;
                  selectedValue = tomorrowPredictionNumber;
                  futurePriceVisible = tomorrowPredictionNumber + futurePrice;
                } else {
                  selectedValue = supportPredictionNumber;
                  const futurePrice =
                    (supportPredictionNumber * randomPercentageValue) / 100;
                  futurePriceVisible = supportPredictionNumber - futurePrice;
                }
                const originalNumber = parseFloat(binanceSymbolData.c);
                const formattedNumber = originalNumber
                  .toFixed(10)
                  .replace(/\.?0*$/, '');
                // if (item?.notificationStatus) {
                //   if (item.status != status) {
                //     if (item.trends == 'All') {
                //       sendPushNotification(
                //         fcmToken,
                //         item.symbol,
                //         status,
                //         settingData.sound_notification,
                //       );
                //       if (notifyData != null) {
                //         let array = JSON.parse(notifyData);
                //         array.push({
                //           title: item.symbol,
                //           des: status,
                //           date: new Date(),
                //           readMessage: false,
                //         });
                //         notifyCount = notifyCount + 1;
                //         dispatch(fetchNotificationCount(notifyCount));
                //         AsyncStorage.setItem('Notify', JSON.stringify(array));
                //       } else {
                //         let array = [];
                //         array.push({
                //           title: item.symbol,
                //           des: status,
                //           date: new Date(),
                //           readMessage: false,
                //         });
                //         notifyCount = notifyCount + 1;
                //         dispatch(fetchNotificationCount(notifyCount));
                //         AsyncStorage.setItem('Notify', JSON.stringify(array));
                //       }
                //     } else if (item.trends == status) {
                //       sendPushNotification(
                //         fcmToken,
                //         item.symbol,
                //         status,
                //         settingData.sound_notification,
                //       );
                //       if (notifyData != null) {
                //         let array = JSON.parse(notifyData);
                //         array.push({
                //           title: item.symbol,
                //           des: status,
                //           date: new Date(),
                //           readMessage: false,
                //         });
                //         AsyncStorage.setItem('Notify', JSON.stringify(array));
                //         notifyCount = notifyCount + 1;
                //         dispatch(fetchNotificationCount(notifyCount));
                //       } else {
                //         let array = [];
                //         array.push({
                //           title: item.symbol,
                //           des: status,
                //           date: new Date(),
                //           readMessage: false,
                //         });
                //         AsyncStorage.setItem('Notify', JSON.stringify(array));
                //         notifyCount = notifyCount + 1;
                //         dispatch(fetchNotificationCount(notifyCount));
                //       }
                //     }
                //   }
                // }
                return {
                  ...item,
                  selectedValue: selectedValue,
                  priceChangePercent: item.priceChangePercent,
                  lastPrice: formattedNumber,
                  futurePriceVisible: futurePriceVisible,
                  day_after_tomorrow_prediction: supportPredictionNumber,
                  tomorrow_prediction: tomorrowPredictionNumber,
                };
              }
              return item;
            });
          });
          setDataActive(prevData => {
            return prevData.map(item => {
              const binanceSymbolData = binanceWebSocketData.find(
                data => data.s === `${item.symbol}`,
              );
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              const randomPercentageValue = percentage.find(
                data => data.ticker === `${item.symbol}`,
              )?.percentage;
              if (binanceSymbolData) {
                // Check if the values are valid numbers
                const lastPriceNumber = parseFloat(binanceSymbolData.c);
                const tomorrowPredictionNumber = parseFloat(
                  item.tomorrow_prediction,
                );
                const supportPredictionNumber = parseFloat(
                  item.day_after_tomorrow_prediction,
                );
                let percentageChange = '-';
                if (
                  !isNaN(lastPriceNumber) &&
                  !isNaN(tomorrowPredictionNumber) &&
                  lastPriceNumber !== 0
                ) {
                  // Calculate the percentage change
                  percentageChange =
                    ((tomorrowPredictionNumber - lastPriceNumber) /
                      lastPriceNumber) *
                    100;
                  percentageChange = parseFloat(percentageChange).toFixed(2);

                  // Change the sign based on positive or negative value
                  if (percentageChange > 0) {
                    // If it's positive, make it negative
                    percentageChange = '-' + percentageChange;
                  } else if (percentageChange < 0) {
                    // If it's negative, remove the negative sign (make it positive)
                    percentageChange = percentageChange.substring(1);
                  }
                }

                let sPercentageChange = '-';
                if (
                  !isNaN(lastPriceNumber) &&
                  !isNaN(supportPredictionNumber) &&
                  lastPriceNumber !== 0
                ) {
                  // Calculate the percentage change
                  sPercentageChange =
                    ((supportPredictionNumber - lastPriceNumber) /
                      lastPriceNumber) *
                    100;
                  sPercentageChange = parseFloat(sPercentageChange).toFixed(2);
                }
                let finalPercentage;
                let isR;
                let status;
                if (percentageChange !== '-' && sPercentageChange !== '-') {
                  finalPercentage = Math.max(
                    parseFloat(percentageChange),
                    parseFloat(sPercentageChange),
                  ).toFixed(2);
                  isR =
                    parseFloat(percentageChange) >
                    parseFloat(sPercentageChange);
                } else if (percentageChange !== '-') {
                  finalPercentage = percentageChange;
                  isR = true;
                } else {
                  finalPercentage = sPercentageChange;
                  isR = false;
                }

                let futurePriceVisible = 0;
                let selectedValue = 0;
                if (isR) {
                  const futurePrice =
                    (tomorrowPredictionNumber * randomPercentageValue) / 100;
                  selectedValue = tomorrowPredictionNumber;
                  futurePriceVisible = tomorrowPredictionNumber + futurePrice;
                } else {
                  selectedValue = supportPredictionNumber;
                  const futurePrice =
                    (supportPredictionNumber * randomPercentageValue) / 100;
                  futurePriceVisible = supportPredictionNumber - futurePrice;
                }
                const originalNumber = parseFloat(binanceSymbolData.c);
                const formattedNumber = originalNumber
                  .toFixed(10)
                  .replace(/\.?0*$/, '');
                return {
                  ...item,
                  selectedValue: selectedValue,
                  priceChangePercent: item.priceChangePercent,
                  lastPrice: formattedNumber,
                  futurePriceVisible: futurePriceVisible,
                  day_after_tomorrow_prediction: supportPredictionNumber,
                  tomorrow_prediction: tomorrowPredictionNumber,
                };
              }
              return item;
            });
          });
          socket.close();
        };
      }
    };
    if (isFocused) {
      const interval = setInterval(fetchData, 2500);
      return () => {
        clearInterval(interval);
        socket.close();
      };
    }
  }, [isFocused, allCoinData]);

  const handleSearch = async text => {
    setSearch(text);
    if (text !== '') {
      let allData = dataActive;
      const filtered = allData.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setAllCoinData(filtered);
      setRefresh(!refresh);
    } else {
      setAllCoinData(dataActive);
      setRefresh(!refresh);
    }
  };

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a.symbol.toLowerCase();
    const stringB = b.symbol.toLowerCase();

    let index = 0;
    while (index < stringA.length && index < stringB.length) {
      if (stringA[index] !== stringB[index]) {
        return stringA.charCodeAt(index) - stringB.charCodeAt(index);
      }
      index++;
    }
    // If the characters are the same up to the length of the shorter string,
    // the shorter string should come first
    return stringA.length - stringB.length;
  };

  const firstSorting = async from => {
    if (from === 'Coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setLastPrice(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      } else {
        setCoinSort(coinSort + 1);
        setLastPrice(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = allCoinData.sort(customSort).reverse();
        setAllCoinData(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = allCoinData.sort(customSort);
        setAllCoinData(sortedDates);
      } else {
        setAllCoinData(dataActive);
      }
    } else if (from === 'lastPrice') {
      if (lastPrice === 2) {
        setCoinSort(0);
        setLastPrice(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      } else {
        setLastPrice(lastPrice + 1);
        setCoinSort(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      }
      if (lastPrice + 1 === 1) {
        const sortedDates = allCoinData
          .sort((a, b) => a.lastPrice - b.lastPrice)
          .reverse();
        setAllCoinData(sortedDates);
      } else if (lastPrice + 1 === 2) {
        const sortedDates = allCoinData.sort(
          (a, b) => a.lastPrice - b.lastPrice,
        );
        setAllCoinData(sortedDates);
      } else {
        setAllCoinData(dataActive);
      }
    } else if (from === 'CurrentP') {
      if (currentP === 2) {
        setCoinSort(0);
        setLastPrice(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      } else {
        setCurrentP(currentP + 1);
        setLastPrice(0);
        setCoinSort(0);
        setAITrend(false);
        setFutureTarget(0);
      }
      if (currentP + 1 === 1) {
        const sortedDates = allCoinData
          .sort((a, b) => a.priceChangePercent - b.priceChangePercent)
          .reverse();
        setAllCoinData(sortedDates);
      } else if (currentP + 1 === 2) {
        const sortedDates = allCoinData.sort(
          (a, b) => a.priceChangePercent - b.priceChangePercent,
        );
        setAllCoinData(sortedDates);
      } else {
        setAllCoinData(dataActive);
      }
    } else if (from === 'futureTarget') {
      if (FutureTarget === 2) {
        setCoinSort(0);
        setLastPrice(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      } else {
        setLastPrice(FutureTarget + 1);
        setCoinSort(0);
        setAITrend(false);
        setFutureTarget(0);
        setCurrentP(0);
      }
      if (FutureTarget + 1 === 1) {
        const sortedDates = allCoinData
          .sort((a, b) => a.futurePriceVisible - b.futurePriceVisible)
          .reverse();
        setAllCoinData(sortedDates);
      } else if (FutureTarget + 1 === 2) {
        const sortedDates = allCoinData.sort(
          (a, b) => a.futurePriceVisible - b.futurePriceVisible,
        );
        setAllCoinData(sortedDates);
      } else {
        setAllCoinData(dataActive);
      }
    } else if (from === 'Trend') {
      setAITrend(!AITrend);
    }
  };

  const onGetFavoriteData = async favorites => {
    try {
      setFavorite(!favorite);
      if (favorites) {
        let stickerData = [];
        allCoinData.map(item => {
          if (item.favoriteStatus) {
            stickerData.push(item);
          }
        });
        setAllCoinData(stickerData);
      } else if (!favorites && !notification) {
        setAllCoinData(dataActive);
      } else if (notification) {
        onGetNotificationData(notification);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onGetNotificationData = async favorites => {
    try {
      setNotification(!notification);
      if (favorites) {
        let stickerData = [];
        allCoinData.map(item => {
          if (item.notificationStatus) {
            stickerData.push(item);
          }
        });
        setAllCoinData(stickerData);
      } else if (!favorites && !favorite) {
        setAllCoinData(dataActive);
      } else if (favorite) {
        onGetFavoriteData(favorite);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onPostNotificationData = async ticker => {
    try {
      setTrendSelect(ticker);
      if (ticker != 'None') {
        let raw = JSON.stringify({
          ticker: tickerSelected,
          trends: ticker,
        });
        const response = await onPostNotificationStatusApi(raw);
        if (response.data) {
          let valueStore = allCoinData;
          response.data.map(item => {
            valueStore.map((item1, index) => {
              if (item1.symbol == item.ticker) {
                valueStore[index].notificationStatus = true;
                valueStore[index].trends = item.trends;
              }
            });
          });
          setAllCoinData(valueStore);
          setDataActive(valueStore);
        } else {
          console.log('Error::', response.data);
        }
      } else {
        let raw = JSON.stringify({
          ticker: tickerSelected,
        });
        const response = await onDeleteNotificationDataApi(raw);
        if (response) {
          let valueStore = allCoinData;
          // const response1 = await onGetNotificationStatusApi();
          valueStore.map((item1, index) => {
            if (item1.symbol === tickerSelected) {
              valueStore[index].notificationStatus = false;
              valueStore[index].trends = ticker;
            }
          });
          // valueStore.map((item1, index) => {
          //   response1.data.map(item => {
          //     if (item1.symbol === item.ticker) {
          //       valueStore[index].notificationStatus = true;
          //       valueStore[index].trends = item.trends;
          //     }
          //   });
          // });
          setAllCoinData(valueStore);
          setDataActive(valueStore);
        } else {
          console.log('Err::', response);
        }
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onPostFavoriteData = async (ticker, index1) => {
    try {
      let raw = JSON.stringify({
        tickers_list: ticker,
      });
      const response = await onPostFavoriteStatusApi(raw);
      if (response.data) {
        let valueStore = allCoinData;
        // response.data.tickers_list.map(item => {
        //   valueStore.map((item1, index) => {
        //     if (item1.symbol == item) {
        valueStore[index1].favoriteStatus = true;
        //     }
        //   });
        // });
        setAllCoinData(valueStore);
        setDataActive(valueStore);
      } else {
        console.log('Error response::', response.data);
      }
    } catch (err) {
      console.log('Error::', err.response.data);
    }
  };

  const onDeleteFavoriteData = async (ticker, index1) => {
    try {
      let raw = JSON.stringify({
        ticker: ticker,
      });
      const response = await onDeleteFavoriteDataApi(raw);
      if (response) {
        let valueStore = allCoinData;
        // valueStore.map((item, index) => {
        //   if (item.favoriteStatus != undefined) {
        //     valueStore[index].favoriteStatus = false;
        //   } else {
        //     valueStore[index].favoriteStatus = false;
        //   }
        // });
        // if (response.tickers_list.length > 0) {
        //   valueStore.map((item1, index) => {
        //     response.tickers_list.map(item => {
        //       if (item1.symbol === item) {
        valueStore[index1].favoriteStatus = false;
        //     }
        //   });
        // });
        // }

        setAllCoinData(valueStore);
        setDataActive(valueStore);
      } else {
        console.log('Err::', response);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onSortingTrends = async array => {
    let sortData = [];
    setTrandOptionArray(array);
    array.map(item => {
      if (item.selected) {
        dataActive.map(item1 => {
          if (item.name == item1.currentTrend) {
            sortData.push(item1);
          }
        });
      }
    });

    if (sortData.length != 0) {
      setAllCoinData(sortData);
    } else {
      setAllCoinData(dataActive);
    }
  };

  // const ItemComponent = ({item, index}) => {
  //     const decimalDigitsInPrice = countDecimalDigits(item?.lastPrice);
  //   if (isSkeletonVisible) {
  //     return <PredictionSkeleton />;
  //   } else {
  //     return (
  //       <View
  //         key={item.symbol}
  //         style={[
  //           styles.dataActiveView,
  //           {
  //             backgroundColor:
  //               index % 2 === 0 ? COLORS.lightPrimary : COLORS.lightPrimary3,
  //           },
  //         ]}>
  //         <TouchableOpacity
  //           style={styles.imageView1}
  //           onPress={() => {
  //             item.favoriteStatus
  //               ? onDeleteFavoriteData(item.symbol)
  //               : onPostFavoriteData(item.symbol);
  //           }}>
  //           <Image
  //             style={[
  //               styles.starIcon,
  //               {
  //                 tintColor: item.favoriteStatus
  //                   ? COLORS.goldenColor
  //                   : COLORS.black,
  //               },
  //             ]}
  //             source={item.favoriteStatus ? star1 : star}
  //           />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.imageView}
  //           onPress={() => {
  //             setBottomModal(true);
  //             setTickerSelected(item.symbol);
  //             if (item.trends) {
  //               setTrendSelect(item.trends);
  //             } else {
  //               setTrendSelect('None');
  //             }
  //           }}>
  //           <Image
  //             style={[
  //               styles.starIcon,
  //               {
  //                 tintColor: item.notificationStatus
  //                   ? COLORS.goldenColor
  //                   : COLORS.black,
  //               },
  //             ]}
  //             source={item.notificationStatus ? bell2 : bell1}
  //           />
  //         </TouchableOpacity>
  //         <View style={styles.coinStartView}>
  //           <Text style={styles.dataText3}>{item.symbol}</Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text style={[styles.dataText1]}>{item.lastPrice}</Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text style={[styles.dataText1]}>{item.priceChangePercent}</Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text
  //             style={[
  //               styles.dataText1,
  //               {
  //                 color:
  //                   item.status === 'Resistance Broken'
  //                     ? '#00008b'
  //                     : item.status === 'Bullish'
  //                     ? '#236a4f'
  //                     : item.status === 'Very Bullish'
  //                     ? '#349b73'
  //                     : item.status === 'Extremely Bullish'
  //                     ? '#39ff14'
  //                     : item.status === 'Support Broken'
  //                     ? '#4444b2'
  //                     : item.status === 'Bearish'
  //                     ? '#a81e08eb'
  //                     : item.status === 'Very Bearish'
  //                     ? '#d83218eb'
  //                     : item.status === 'Extremely Bearish'
  //                     ? '#ff3314'
  //                     : '#ffa500',
  //               },
  //             ]}>
  //             {item.status}
  //           </Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text style={[styles.dataText]}>
  //             {parseFloat(item.tomorrow_prediction).toFixed(
  //               decimalDigitsInPrice._j,
  //             )}
  //           </Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text style={[styles.dataText]}>
  //             {parseFloat(
  //               item.day_after_tomorrow_prediction,
  //             ).toFixed(decimalDigitsInPrice._j)}
  //           </Text>
  //         </View>
  //         <View style={styles.coinStartView}>
  //           <Text
  //             style={[
  //               styles.dataText1,
  //               {
  //                 color:
  //                   item.selectedValue ===
  //                   item.tomorrow_prediction
  //                     ? COLORS.darkGreen
  //                     : COLORS.errorColor,
  //               },
  //             ]}>
  //             {parseFloat(item.futurePriceVisible).toFixed(
  //               decimalDigitsInPrice._j,
  //             )}
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   }
  // };
  const countDecimalDigits = async number => {
    const numberString = number;

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
  const ItemComponent = ({item, index}) => {
    if (isSkeletonVisible) {
      return <PredictionSkeleton />;
    } else {
      const decimalDigitsInPrice = countDecimalDigits(item?.lastPrice);
      return (
        <View
          key={item.symbol}
          style={[
            styles.dataActiveView,
            {
              backgroundColor:
                index % 2 === 0 ? COLORS.lightPrimary : COLORS.lightPrimary3,
            },
          ]}>
          <TouchableOpacity
            style={styles.imageView1}
            onPress={() => {
              item.favoriteStatus
                ? onDeleteFavoriteData(item.symbol, index)
                : onPostFavoriteData(item.symbol, index);
            }}>
            <Image
              style={[
                styles.starIcon,
                {
                  tintColor: item.favoriteStatus
                    ? COLORS.goldenColor
                    : COLORS.black,
                },
              ]}
              source={item.favoriteStatus ? star1 : star}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageView}
            onPress={() => {
              setBottomModal(true);
              setTickerSelected(item.symbol);
              if (item.trends) {
                setTrendSelect(item.trends);
              } else {
                setTrendSelect('None');
              }
            }}>
            <Image
              style={[
                styles.starIcon,
                {
                  tintColor: item.notificationStatus
                    ? COLORS.goldenColor
                    : COLORS.black,
                },
              ]}
              source={item.notificationStatus ? bell2 : bell1}
            />
          </TouchableOpacity>
          <View style={styles.coinStartView}>
            <Text style={styles.dataText3}>{item.symbol}</Text>
          </View>
          <View style={styles.coinStartView}>
            <Text style={[styles.dataText1]}>{item.lastPrice}</Text>
          </View>
          <View style={styles.coinStartView}>
            <Text style={[styles.dataText1]}>{item.priceChangePercent}</Text>
          </View>
          <View style={styles.coinStartView}>
            <Text
              style={[
                styles.dataText1,
                {
                  color:
                    item.currentTrend === 'resistance-broken'
                      ? '#00008b'
                      : item.currentTrend === 'bullish'
                      ? '#236a4f'
                      : item.currentTrend === 'very-bullish'
                      ? '#349b73'
                      : item.currentTrend === 'extremely-bullish'
                      ? '#39ff14'
                      : item.currentTrend === 'support-broken'
                      ? '#4444b2'
                      : item.currentTrend === 'bearish'
                      ? '#a81e08eb'
                      : item.currentTrend === 'very-bearish'
                      ? '#d83218eb'
                      : item.currentTrend === 'extremely-bearish'
                      ? '#ff3314'
                      : '#ffa500',
                },
              ]}>
              {item.currentTrend === 'resistance-broken'
                ? 'Resistance Broken'
                : item.currentTrend === 'bullish'
                ? 'Bullish'
                : item.currentTrend === 'very-bullish'
                ? 'Very Bullish'
                : item.currentTrend === 'extremely-bullish'
                ? 'Extremely Bullish'
                : item.currentTrend === 'support-broken'
                ? 'Support Broken'
                : item.currentTrend === 'bearish'
                ? 'Bearish'
                : item.currentTrend === 'very-bearish'
                ? 'Very Bearish'
                : item.currentTrend === 'extremely-bearish'
                ? 'Extremely Bearish'
                : 'Neutral'}
            </Text>
          </View>
          <View style={styles.coinStartView}>
            {item.currentTrend === 'neutral' ? (
              <Text
                style={[
                  styles.dataText1,
                  {
                    color:
                      item.earlierTrend === 'resistance-broken'
                        ? '#00008b'
                        : item.earlierTrend === 'bullish'
                        ? '#236a4f'
                        : item.earlierTrend === 'very-bullish'
                        ? '#349b73'
                        : item.earlierTrend === 'extremely-bullish'
                        ? '#39ff14'
                        : item.earlierTrend === 'support-broken'
                        ? '#4444b2'
                        : item.earlierTrend === 'bearish'
                        ? '#a81e08eb'
                        : item.earlierTrend === 'very-bearish'
                        ? '#d83218eb'
                        : item.earlierTrend === 'extremely-bearish'
                        ? '#ff3314'
                        : '#ffa500',
                    fontSize: hp(2.9),
                  },
                ]}>
                =
              </Text>
            ) : item?.result === 'high' && item.currentTrend !== 'neutral' ? (
              <Image
                style={[
                  styles.arrowImage,
                  {
                    tintColor:
                      item.earlierTrend === 'resistance-broken'
                        ? '#00008b'
                        : item.earlierTrend === 'bullish'
                        ? '#236a4f'
                        : item.earlierTrend === 'very-bullish'
                        ? '#349b73'
                        : item.earlierTrend === 'extremely-bullish'
                        ? '#39ff14'
                        : item.earlierTrend === 'support-broken'
                        ? '#4444b2'
                        : item.earlierTrend === 'bearish'
                        ? '#a81e08eb'
                        : item.earlierTrend === 'very-bearish'
                        ? '#d83218eb'
                        : item.earlierTrend === 'extremely-bearish'
                        ? '#ff3314'
                        : '#ffa500',
                  },
                ]}
                source={upArrow}
              />
            ) : item?.result === 'low' && item.currentTrend !== 'neutral' ? (
              <Image
                style={[
                  styles.arrowImage,
                  {
                    tintColor:
                      item.earlierTrend === 'resistance-broken'
                        ? '#00008b'
                        : item.earlierTrend === 'bullish'
                        ? '#236a4f'
                        : item.earlierTrend === 'very-bullish'
                        ? '#349b73'
                        : item.earlierTrend === 'extremely-bullish'
                        ? '#39ff14'
                        : item.earlierTrend === 'support-broken'
                        ? '#4444b2'
                        : item.earlierTrend === 'bearish'
                        ? '#a81e08eb'
                        : item.earlierTrend === 'very-bearish'
                        ? '#d83218eb'
                        : item.earlierTrend === 'extremely-bearish'
                        ? '#ff3314'
                        : '#ffa500',
                  },
                ]}
                source={downArrow}
              />
            ) : item?.result === 'none' && item.currentTrend !== 'neutral' ? (
              ''
            ) : null}
          </View>
          <View style={styles.coinStartView}>
            <Text style={[styles.dataText]}>
              {parseFloat(item.tomorrow_prediction).toFixed(
                decimalDigitsInPrice._j,
              )}
            </Text>
          </View>
          <View style={styles.coinStartView}>
            <Text style={[styles.dataText]}>
              {parseFloat(item.day_after_tomorrow_prediction).toFixed(
                decimalDigitsInPrice._j,
              )}
            </Text>
          </View>
          <View style={styles.coinStartView}>
            <Text
              style={[
                styles.dataText1,
                {
                  color:
                    item.selectedValue === item.tomorrow_prediction
                      ? COLORS.darkGreen
                      : COLORS.errorColor,
                },
              ]}>
              {parseFloat(item.futurePriceVisible).toFixed(decimalDigitsInPrice._j)}
            </Text>
          </View>
        </View>
      );
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
            title={'AI Price Prediction'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            onPress={() => navigation.openDrawer()}
            notificationCount={notifyCount}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.headingsView}>
              {titleArray.map((item, index) => {
                if (index == 0) {
                  return (
                    <View key={item.name} style={styles.heading1}>
                      <Text style={[styles.valueText, {color: item.color}]}>
                        {neutralCount}
                      </Text>
                      <View
                        style={[styles.titleView, {backgroundColor: item.color}]}>
                        <Text style={styles.titleText}>{item.name}</Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View key={item.name} style={styles.heading}>
                      <Text style={[styles.valueText, {color: item.color}]}>
                        {item.name === 'Resistance Broken'
                          ? resistanceBrokenCount
                          : item.name === 'Bullish'
                          ? bullishCount
                          : item.name === 'Very Bullish'
                          ? veryBullishCount
                          : item.name === 'Extremely Bullish'
                          ? extremelyBullishCount
                          : item.name === 'Support Broken'
                          ? supportBrokenCount
                          : item.name === 'Bearish'
                          ? bearishCount
                          : item.name === 'Very Bearish'
                          ? veryBearishCount
                          : item.name === 'Extremely Bearish'
                          ? extremelyBearishCount
                          : neutralCount}
                      </Text>
                      <View
                        style={[
                          styles.titleView,
                          {backgroundColor: item.color},
                        ]}>
                        <Text style={styles.titleText}>{item.name}</Text>
                      </View>
                    </View>
                  );
                }
              })}
            </View>
            <TextInput
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder="Search Coin..."
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />

            <View style={styles.activeView}>
              <View style={styles.titleActiveView}>
                <TouchableOpacity
                  style={styles.imageView1}
                  onPress={() => onGetFavoriteData(!favorite)}>
                  <Image
                    style={[
                      styles.starIcon,
                      {
                        tintColor: favorite ? COLORS.goldenColor : COLORS.white,
                      },
                    ]}
                    source={favorite ? star1 : star}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageView}
                  onPress={() => onGetNotificationData(!notification)}>
                  <Image
                    style={[
                      styles.starIcon,
                      {
                        tintColor: notification
                          ? COLORS.goldenColor
                          : COLORS.white,
                      },
                    ]}
                    source={notification ? bell2 : bell1}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => firstSorting('Coin')}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText1}>
                    {`Trending\nCoins  `}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => firstSorting('lastPrice')}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText1}>
                    {`Last\nPrice  `}
                    {lastPrice === 0 || lastPrice === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {lastPrice === 0 || lastPrice === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => firstSorting('CurrentP')}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText1}>
                    {`Current\n%  `}
                    {lastPrice === 0 || lastPrice === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {lastPrice === 0 || lastPrice === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => firstSorting('Trend')}
                  style={[styles.optionTitleView, {width: wp(27)}]}>
                  <Text style={styles.titleText2}>
                    {'Trending\nStage'}
                    {AITrend ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : (
                      <Image style={styles.upDownImage} source={down} />
                    )}
                  </Text>
                  
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(27)}]}>
                  <Text style={styles.titleText2}>AI Trend</Text>
                </TouchableOpacity>
                <View style={styles.coinStartView1}>
                  <Text style={[styles.titleText1, {width: wp(25)}]}>
                    AI Resistance
                  </Text>
                </View>
                <View style={styles.coinStartView1}>
                  <Text style={[styles.titleText1, {width: wp(27)}]}>
                    AI Support
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => firstSorting('futureTarget')}
                  style={[styles.optionTitleView, {width: wp(25)}]}>
                  <Text style={[styles.titleText1]}>
                    {'Future\nTarget  '}
                    {FutureTarget === 0 || FutureTarget === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {FutureTarget === 0 || FutureTarget === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  maxWidth: wp(64),
                  borderTopRightRadius: wp(3),
                  borderBottomRightRadius: wp(3),
                }}>
                <FlatList
                  data={allCoinData}
                  bounces={false}
                  initialNumToRender={allCoinData.length}
                  removeClippedSubviews={true}
                  nestedScrollEnabled
                  virtualized
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  // ListFooterComponent={renderFooter}
                  keyExtractor={item => item.symbol}
                  ListEmptyComponent={() => (
                    <>
                      {isSkeletonVisible ? (
                        skeletonArray.map(item => {
                          return <PredictionSkeleton />;
                        })
                      ) : (
                        <View key={0} style={styles.ListEmptyView}>
                          <View style={styles.subEmptyView}>
                            <Text style={styles.emptyText}>
                              No Records Available
                            </Text>
                          </View>
                      </View>
                      )}
                    </>
                  )}
                  renderItem={ItemComponent}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={bottomModal}
        onRequestClose={() => setBottomModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          backdropTransitionOutTiming={1}
          style={styles.container1}
          onPress={() => setBottomModal(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity activeOpacity={1}>
              <ScrollView contentContainerStyle={{paddingBottom: hp(2)}}>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'None' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('None');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>None</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'All' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('All');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>All</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Extremely Bullish'
                            ? COLORS.primary
                            : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Extremely Bullish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Extremely Bullish</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Very Bullish'
                            ? COLORS.primary
                            : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Very Bullish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Very Bullish</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Bullish' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Bullish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Bullish</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Resistance Broken'
                            ? COLORS.primary
                            : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Resistance Broken');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Resistance Broken</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Neutral' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Neutral');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Neutral</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Support Broken'
                            ? COLORS.primary
                            : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Support Broken');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Support Broken</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Bearish' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Bearish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Bearish</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Very Bearish' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Very Bearish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Very Bearish</Text>
                </View>
                <View style={styles.checkboxView}>
                  <TouchableOpacity
                    backdropTransitionOutTiming={1}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor:
                          trendSelect == 'Extremely Bearish' ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      onPostNotificationData('Extremely Bearish');
                      setBottomModal(false);
                    }}></TouchableOpacity>
                  <Text style={styles.checkboxValueText}>Extremely Bearish</Text>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* <BottomOptionMenu
        modelVisible={bottomModal}
        setModelVisible={() => setBottomModal(false)}
        setTrendSelect={text => onPostNotificationData(text)}
        trendSelect={trendSelect}
      /> */}
      <FilterOptionPopup
        modelVisible={AITrend}
        setModelVisible={() => setAITrend(false)}
        setTrendSelect={value => onSortingTrends(value)}
        trandsOptionArray={trandsOptionArray}
      />
    </View>
  );
};

export default PricePrediction;

// import {
//   Text,
//   View,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import React, {useEffect, useState, useRef} from 'react';
// import {useIsFocused} from '@react-navigation/native';
// import styles from './styles';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from '../../components/Pixel/index';
// import Header from '../../components/Header';
// import {hasNotch} from 'react-native-device-info';
// import {COLORS} from '../../utils';
// import star from '../../images/star.png';
// import star1 from '../../images/star1.png';
// import bell1 from '../../images/bell1.png';
// import bell2 from '../../images/bell2.png';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {
//   onDeleteFavoriteDataApi,
//   onDeleteNotificationDataApi,
//   onGetBinanceDataApi,
//   onGetFavoriteStatusApi,
//   onGetFuturePriceApi,
//   onGetIndicatortBotApi,
//   onGetNotificationStatusApi,
//   onGetPercentStatusApi,
//   onGetSentimentApi,
//   onGetTickerDataApi,
//   onGetfuturePriceBotApi,
//   onGetvolumePathApi,
//   onPostFavoriteStatusApi,
//   onPostNotificationStatusApi,
//   sendPushNotification,
// } from '../../services/Api';
// import arrowUp from '../../images/arrowUp.png';
// import down from '../../images/down.png';
// import {BottomOptionMenu} from '../../components/BottomOptionMenu';
// import PredictionSkeleton from '../../components/PredictionSkeleton';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Config from 'react-native-config';

// const titleArray = [
//   {
//     id: 1,
//     name: 'Extremely Bullish',
//     color: 'rgb(57,255,20)',
//   },
//   {
//     id: 2,
//     name: 'Very Bullish',
//     color: 'rgb(52 155 115)',
//   },
//   {
//     id: 3,
//     name: 'Bullish',
//     color: 'rgb(35 106 79)',
//   },
//   {
//     id: 4,
//     name: 'Reverse Down',
//     color: 'rgb(0 0 139)',
//   },
//   {
//     id: 5,
//     name: 'Neutral',
//     color: 'rgb(255 165 0)',
//   },
//   {
//     id: 6,
//     name: 'Reverse Up',
//     color: 'rgb(68 68 178)',
//   },
//   {
//     id: 7,
//     name: 'Bearish',
//     color: '#A81E08',
//   },
//   {
//     id: 8,
//     name: 'Very Bearish',
//     color: '#d83218',
//   },
//   {
//     id: 9,
//     name: 'Extremely Bearish',
//     color: 'rgb(255 51 20)',
//   },
// ];

// const activeDataArray = [
//   {
//     id: 1,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 2,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 3,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 4,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 5,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 6,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 7,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 8,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 9,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 10,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 11,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 12,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 13,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 7,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 8,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 9,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 10,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 11,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 12,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
//   {
//     id: 13,
//     date: '01/10/2018',
//     coin: 2000,
//     entryPrice: '105',
//     lastPrice: '120',
//     type: 'BSV',
//   },
// ];

// const PricePrediction = ({navigation}) => {
//   const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
//   const socketPath = '/ws/live-ohlcv-consumer/';

//   const isFocused = useIsFocused();
//   const scrollRef = useRef(null);
//   const [search, setSearch] = useState('');
//   const [dataActive, setDataActive] = useState([]);
//   const [favorite, setFavorite] = useState(false);
//   const [notification, setNotification] = useState(false);
//   const [allCoinData, setAllCoinData] = useState([]);
//   const [coinSort, setCoinSort] = useState(0);
//   const [lastPrice, setLastPrice] = useState(0);
//   const [serialNo, setSerialNo] = useState(0);
//   const [current, setCurrent] = useState(0);
//   const [AITrend, setAITrend] = useState(false);
//   const [FutureTarget, setFutureTarget] = useState(0);
//   const [percentage, setPercentage] = useState([]);
//   const [tickerSelected, setTickerSelected] = useState('');
//   const [trendSelect, setTrendSelect] = useState('');
//   const [bottomModal, setBottomModal] = useState(false);
//   const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);

//   function countDigitsAfterDecimal(number) {
//     const match = /\.(\d+)$/.exec(String(number));
//     return match ? match[1].length : 0;
//   }

//   useEffect(() => {
//     onTickerListGet();
//     onPercentageListGet();
//   }, []);

//   const onTickerListGet = async () => {
//     try {
//       const response = await onGetTickerDataApi();
//       if (response.data?.data) {
//         getValueOfTickerData(response.data?.data);
//       } else {
//         console.log('Error::', response.data);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const onPercentageListGet = async () => {
//     try {
//       const response = await onGetPercentStatusApi();
//       if (response.data) {
//         setPercentage(response.data);
//       } else {
//         console.log('Error::', response.data);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const getValueOfTickerData = async ticker => {
//     try {
//       setIsSkeletonVisible(true);
//       const response = await onGetBinanceDataApi();
//       if (response.data) {
//         let allTicker = [];
//         let allTicket1 = [];
//         ticker.map(item => {
//           allTicker.push({symbol: item});
//         });
//         allTicker.map((item, index) => {
//           response.data.map(item1 => {
//             if (item1.symbol === item.symbol) {
//               allTicker[index] = item1;
//             }
//           });
//         });
//         const response2 = await onGetFavoriteStatusApi();
//         allTicker.map((item, index) => {
//           response2.data.withlist.tickers_list.map(item1 => {
//             if (item1 === item.symbol) {
//               allTicker[index].favoriteStatus = true;
//             }
//           });
//         });
//         const response3 = await onGetNotificationStatusApi();
//         allTicker.map((item, index) => {
//           response3.data.map(item1 => {
//             if (item1.ticker === item.symbol) {
//               allTicker[index].notificationStatus = true;
//               allTicker[index].trends = item1.trends;
//             }
//           });
//         });
//         const response1 = await onGetFuturePriceApi();
//         allTicker.map((item, index) => {
//           response1.data.map(item1 => {
//             if (item1.ticker === item.symbol) {
//               allTicket1.push({
//                 ...item,
//                 tomorrow_prediction: item1.tomorrow_prediction,
//                 day_after_tomorrow_prediction:
//                   item1.day_after_tomorrow_prediction,
//                 tomorrow_prediction_analysis:
//                   item1.tomorrow_prediction_analysis,
//                 updated_at: item1.updated_at,
//               });
//               // allTicket1[index].tomorrow_prediction = item1.tomorrow_prediction;
//               // allTicket1[index].day_after_tomorrow_prediction =
//               //   item1.day_after_tomorrow_prediction;
//             }
//           });
//         });
//         const indicatorData = await onGetIndicatortBotApi();
//         const sentimentData = await onGetSentimentApi();
//         const response5 = await onGetPercentStatusApi();
//         const volumeValuesData = await onGetvolumePathApi();
//         // const futurePriceData = await onGetfuturePriceBotApi();
//         // const commonTickers = allTicket1.filter(value => {
//         //   return futurePriceData.data.some(
//         //     futurePriceEntry =>
//         //       futurePriceEntry.ticker === value.symbol &&
//         //       futurePriceEntry.tomorrow_prediction !== 0,
//         //   );
//         // });
//         allTicket1 = allTicket1.map((item, index) => {
//           const srNo = index + 1;
//           const randomPercentageValue = response5.data.find(
//             data => data.ticker === `${item.symbol}`,
//           )?.percentage;
//           const indicatorSignal = indicatorData.data?.find(
//             entry => entry.ticker === `${item.symbol}`,
//           )?.signal;
//           const sentimentSignal = sentimentData.data?.find(
//             entry => entry.ticker === `${item.symbol}`,
//           )?.signal;
//           const sentiment_label = sentimentData.data?.find(
//             entry => entry.ticker === `${item.symbol}`,
//           )?.sentiment_label;
//           if (randomPercentageValue) {
//             // Check if the values are valid numbers
//             const lastPriceNumber = parseFloat(item.lastPrice);
//             const pricePercent = parseFloat(item.priceChangePercent);
//             const tomorrowPredictionNumber1 = parseFloat(
//               item.tomorrow_prediction,
//             );
//             const supportPredictionNumber1 = parseFloat(
//               item.day_after_tomorrow_prediction,
//             );
//             const digitsAfterDecimalLastPrice =
//               typeof tomorrowPredictionNumber1 === 'number'
//                 ? countDigitsAfterDecimal(lastPriceNumber)
//                 : 0;
//             const tomorrowPredictionNumber = tomorrowPredictionNumber1.toFixed(
//               digitsAfterDecimalLastPrice,
//             );
//             const supportPredictionNumber = supportPredictionNumber1.toFixed(
//               digitsAfterDecimalLastPrice,
//             );

//             const updatedTime = item.updated_at;
//             const timePart = updatedTime
//               ? new Date(updatedTime).toLocaleTimeString('en-US', {
//                   hour12: false,
//                 })
//               : '-';

//             const predictionAnalysis = item?.tomorrow_prediction_analysis;

//             let formattedPredictionAnalysis;
//             if (
//               predictionAnalysis !== null &&
//               !isNaN(parseFloat(predictionAnalysis))
//             ) {
//               formattedPredictionAnalysis =
//                 parseFloat(predictionAnalysis).toFixed(2);
//             } else if (typeof predictionAnalysis === 'string') {
//               formattedPredictionAnalysis = predictionAnalysis;
//             } else {
//               formattedPredictionAnalysis = '-';
//             }

//             const avgVolumeData = volumeValuesData.data?.find(
//               entry => entry.ticker === `${item.symbol}`,
//             );
//             let avgVolume = '-';
//             if (avgVolumeData) {
//               avgVolume = parseFloat(
//                 avgVolumeData.last_month_avg_vol || '0.0',
//               ).toFixed(3);
//               if (avgVolume === '0.000') {
//                 avgVolume = '-';
//               }
//             }

//             let currentVolume = '-';
//             if (avgVolumeData) {
//               currentVolume = parseFloat(
//                 avgVolumeData.today_volume || '0',
//               ).toFixed(3);
//               if (currentVolume === '0.000') {
//                 currentVolume = '-';
//               }
//             }

//             const avgVolumeNumber = parseFloat(avgVolume).toFixed(3);
//             const currentVolumeNumber = parseFloat(currentVolume).toFixed(3);

//             let volPercentage = '-';

//             if (currentVolume === '-' || avgVolume === '-') {
//               volPercentage = '-';
//             } else {
//               volPercentage =
//                 ((currentVolumeNumber - avgVolumeNumber) / avgVolumeNumber) * 100;
//               volPercentage = volPercentage.toFixed(2);
//             }

//             let percentageChange = '-';
//             if (
//               !isNaN(lastPriceNumber) &&
//               !isNaN(tomorrowPredictionNumber) &&
//               lastPriceNumber !== 0
//             ) {
//               // Calculate the percentage change
//               percentageChange =
//                 ((tomorrowPredictionNumber - lastPriceNumber) / lastPriceNumber) *
//                 100;
//               percentageChange = percentageChange.toFixed(2);

//               // Change the sign based on positive or negative value
//               if (percentageChange > 0) {
//                 // If it's positive, make it negative
//                 percentageChange = '-' + percentageChange;
//               } else if (percentageChange < 0) {
//                 // If it's negative, remove the negative sign (make it positive)
//                 percentageChange = percentageChange.substring(1);
//               }
//             }

//             let status;
//             let aiTrendStatus;
//             let futurePriceVisible;
//             let selectedValue;

//             const isFutureTargetValid = (lastprice, resistance, aitarget) => {
//               // return lastprice > resistance || lastprice < support;
//               return (
//                 (lastprice <= aitarget && lastprice >= resistance) ||
//                 (lastprice >= aitarget && lastprice <= resistance)
//               );
//             };
//             const isRangeResSupValid = (lastprice, resistance, support) => {
//               // return lastprice > resistance || lastprice < support;
//               return (
//                 (lastprice <= support && lastprice >= resistance) ||
//                 (lastprice >= support && lastprice <= resistance)
//               );
//             };
//             const isFutureSellTargetValid = (lastprice, support, aitarget) => {
//               // return lastprice > support || lastprice < support;
//               return (
//                 (lastprice <= aitarget && lastprice >= support) ||
//                 (lastprice >= aitarget && lastprice <= support)
//               );
//             };
//             if (pricePercent > 0) {
//               const futurePrice =
//                 (tomorrowPredictionNumber1 * randomPercentageValue) / 100;
//               selectedValue = tomorrowPredictionNumber;
//               futurePriceVisible = (
//                 tomorrowPredictionNumber1 - futurePrice
//               ).toFixed(digitsAfterDecimalLastPrice);
//             } else {
//               const futurePrice =
//                 (supportPredictionNumber1 * randomPercentageValue) / 100;
//               selectedValue = supportPredictionNumber;
//               futurePriceVisible = (
//                 supportPredictionNumber1 + futurePrice
//               ).toFixed(digitsAfterDecimalLastPrice);
//               // console.log('get congif data:::', supportPredictionNumber1, futurePrice, futurePriceVisible, lastPriceNumber);
//             }

//             let sPercentageChange = '-';
//             if (tomorrowPredictionNumber == selectedValue) {
//               const isTargetValid = isFutureTargetValid(
//                 lastPriceNumber,
//                 tomorrowPredictionNumber,
//                 futurePriceVisible,
//               );
//               const isTargetResSup = isRangeResSupValid(
//                 lastPriceNumber,
//                 tomorrowPredictionNumber,
//                 supportPredictionNumber,
//               );
              
//               if (lastPriceNumber > futurePriceVisible) {
//                 aiTrendStatus = 'Extremely Bullish';
//                 if(index==6){

//                   console.log('get congif data:::', futurePriceVisible, lastPriceNumber);
//                 }
//               } else if (isTargetValid) {
//                 aiTrendStatus = 'Reverse Down';
//               } else if (
//                 lastPriceNumber < supportPredictionNumber ||
//                 isTargetResSup
//               ) {
//                 if(index==6){

//                   console.log('get congif data:::', futurePriceVisible, lastPriceNumber);
//                 }
//                 // aiTrendStatus = "Neutral";
//                 if (pricePercent >= 0 && pricePercent <= 2) {
//                   aiTrendStatus = 'Neutral';
//                 } else if (pricePercent > 2 && pricePercent <= 5) {
//                   aiTrendStatus = 'Bullish';
//                 } else if (pricePercent > 5 && pricePercent <= 8) {
//                   aiTrendStatus = 'Very Bullish';
//                 } else if (pricePercent > 8) {
//                   aiTrendStatus = 'Extremely Bullish';
//                 } else if (pricePercent < 0 && pricePercent >= -2) {
//                   aiTrendStatus = 'Neutral';
//                 } else if (pricePercent < -2 && pricePercent >= -5) {
//                   aiTrendStatus = 'bearish';
//                 } else if (pricePercent < -5 && pricePercent >= -8) {
//                   aiTrendStatus = 'Very Bearish';
//                 } else if (pricePercent < -8) {
//                   aiTrendStatus = 'Extremely Bearish';
//                 }
//               }
//             } else {
//               const isTargetValid = isFutureSellTargetValid(
//                 lastPriceNumber,
//                 supportPredictionNumber,
//                 futurePriceVisible,
//               );
//               const isTargetResSup = isRangeResSupValid(
//                 lastPriceNumber,
//                 tomorrowPredictionNumber,
//                 supportPredictionNumber,
//               );

//               if (lastPriceNumber < futurePriceVisible) {
//                 aiTrendStatus = 'Extremely Bearish';
//               } else if (isTargetValid) {
//                 aiTrendStatus = 'Reverse Up';
//               } else if (
//                 lastPriceNumber > tomorrowPredictionNumber ||
//                 isTargetResSup
//               ) {
//                 // aiTrendStatus = "Neutral";
//                 if (pricePercent >= 0 && pricePercent <= 2) {
//                   aiTrendStatus = 'Neutral';
//                 } else if (pricePercent > 2 && pricePercent <= 5) {
//                   aiTrendStatus = 'Bullish';
//                 } else if (pricePercent > 5 && pricePercent <= 8) {
//                   aiTrendStatus = 'Very Bullish';
//                 } else if (pricePercent > 8) {
//                   aiTrendStatus = 'Extremely Bullish';
//                 } else if (pricePercent < 0 && pricePercent >= -2) {
//                   aiTrendStatus = 'Neutral';
//                 } else if (pricePercent < -2 && pricePercent >= -5) {
//                   aiTrendStatus = 'bearish';
//                 } else if (pricePercent < -5 && pricePercent >= -8) {
//                   aiTrendStatus = 'Very Bearish';
//                 } else if (pricePercent < -8) {
//                   aiTrendStatus = 'Extremely Bearish';
//                 }
//               }
//             }
//             return {
//               ...item,
//               srNo,
//               selectedValue: selectedValue,
//               priceChangePercent: item.priceChangePercent,
//               lastPrice: lastPriceNumber,
//               futurePriceVisible: futurePriceVisible,
//               status: aiTrendStatus,
//               day_after_tomorrow_prediction: supportPredictionNumber,
//               tomorrow_prediction: tomorrowPredictionNumber,
//               formattedPredictionAnalysis,
//               avgVolume,
//               currentVolume,
//               volPercentage,
//               pricePercent,
//             };
//           }
//           return item;
//         });
//         setDataActive(allTicket1);
//         setAllCoinData(allTicket1);
//         setIsSkeletonVisible(false);
//       } else {
//         setIsSkeletonVisible(false);
//         console.log('Error::', response.data);
//       }
//     } catch (err) {
//       setIsSkeletonVisible(false);
//       console.log('Error::', err);
//     }
//   };

//   useEffect(() => {
//     const socket = new WebSocket(socketUrl + socketPath);
//     // var socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
//     const fetchData = async () => {
//       if (allCoinData.length > 0) {
//         const fcmToken = await AsyncStorage.getItem('fcmToken');
//         let notifyData = await AsyncStorage.getItem('Notify');
//         socket.onmessage = event => {
//           const binanceWebSocketData = JSON.parse(event.data);
//           setAllCoinData(prevData => {
//             return prevData.map(item => {
//               // const binanceSymbolData = binanceWebSocketData.find(
//               //   data => data.s === `${item.symbol}`,
//               // );
//               const binanceSymbolData = binanceWebSocketData[item.symbol];
//               const randomPercentageValue = percentage.find(
//                 data => data.ticker === `${item.symbol}`,
//               )?.percentage;
//               if (binanceSymbolData) {
//                 // Check if the values are valid numbers
//                 // const formattedNumber = binanceSymbolData.c
//                 //   .toFixed(10)
//                 //   .replace(/\.?0*$/, '');
//                 const lastPriceNumber = parseFloat(binanceSymbolData.c);
//                 const tomorrowPredictionNumber1 = parseFloat(
//                   item.tomorrow_prediction,
//                 );
//                 const pricePercent = parseFloat(binanceSymbolData.P);
//                 const supportPredictionNumber1 = parseFloat(
//                   item.day_after_tomorrow_prediction,
//                 );
//                 const digitsAfterDecimalLastPrice =
//                   typeof tomorrowPredictionNumber1 === 'number'
//                     ? countDigitsAfterDecimal(lastPriceNumber)
//                     : 0;
//                 const updatedTime = item.updated_at;
//                 const timePart = updatedTime
//                   ? new Date(updatedTime).toLocaleTimeString('en-US', {
//                       hour12: false,
//                     })
//                   : '-';
//                 const tomorrowPredictionNumber =
//                   tomorrowPredictionNumber1.toFixed(
//                     digitsAfterDecimalLastPrice,
//                   );
//                 const supportPredictionNumber =
//                   supportPredictionNumber1.toFixed(digitsAfterDecimalLastPrice);
//                 const predictionAnalysis = item?.tomorrow_prediction_analysis;

//                 let formattedPredictionAnalysis;
//                 if (
//                   predictionAnalysis !== null &&
//                   !isNaN(parseFloat(predictionAnalysis))
//                 ) {
//                   formattedPredictionAnalysis =
//                     parseFloat(predictionAnalysis).toFixed(2);
//                 } else if (typeof predictionAnalysis === 'string') {
//                   formattedPredictionAnalysis = predictionAnalysis;
//                 } else {
//                   formattedPredictionAnalysis = '-';
//                 }

//                 let percentageChange = '-';
//                 if (
//                   !isNaN(lastPriceNumber) &&
//                   !isNaN(tomorrowPredictionNumber) &&
//                   lastPriceNumber !== 0
//                 ) {
//                   // Calculate the percentage change
//                   percentageChange =
//                     ((tomorrowPredictionNumber - lastPriceNumber) / lastPriceNumber) *
//                     100;
//                   percentageChange = percentageChange.toFixed(2);

//                   // Change the sign based on positive or negative value
//                   if (percentageChange > 0) {
//                     // If it's positive, make it negative
//                     percentageChange = '-' + percentageChange;
//                   } else if (percentageChange < 0) {
//                     // If it's negative, remove the negative sign (make it positive)
//                     percentageChange = percentageChange.substring(1);
//                   }
//                 }

//                 let status;
//                 let aiTrendStatus;
//                 let futurePriceVisible;
//                 let selectedValue;
//                 const isFutureTargetValid = (
//                   lastprice,
//                   resistance,
//                   aitarget,
//                 ) => {
//                   // return lastprice > resistance || lastprice < support;
//                   return (
//                     (lastprice <= aitarget && lastprice >= resistance) ||
//                     (lastprice >= aitarget && lastprice <= resistance)
//                   );
//                 };
//                 const isRangeResSupValid = (lastprice, resistance, support) => {
//                   // return lastprice > resistance || lastprice < support;
//                   return (
//                     (lastprice <= support && lastprice >= resistance) ||
//                     (lastprice >= support && lastprice <= resistance)
//                   );
//                 };
//                 const isFutureSellTargetValid = (
//                   lastprice,
//                   support,
//                   aitarget,
//                 ) => {
//                   // return lastprice > support || lastprice < support;
//                   return (
//                     (lastprice <= aitarget && lastprice >= support) ||
//                     (lastprice >= aitarget && lastprice <= support)
//                   );
//                 };
//                 if (pricePercent > 0) {
//                   const futurePrice =
//                     (tomorrowPredictionNumber1 * randomPercentageValue) / 100;
//                   selectedValue = tomorrowPredictionNumber;
//                   futurePriceVisible = (
//                     tomorrowPredictionNumber1 - futurePrice
//                   ).toFixed(digitsAfterDecimalLastPrice);
//                 } else {
//                   const futurePrice =
//                     (supportPredictionNumber1 * randomPercentageValue) / 100;
//                   selectedValue = supportPredictionNumber;
//                   futurePriceVisible = (
//                     supportPredictionNumber1 + futurePrice
//                   ).toFixed(digitsAfterDecimalLastPrice);
//                 }

//                 let sPercentageChange = '-';
//                 if (tomorrowPredictionNumber == selectedValue) {
//                   const isTargetValid = isFutureTargetValid(
//                     lastPriceNumber,
//                     tomorrowPredictionNumber,
//                     futurePriceVisible,
//                   );
//                   const isTargetResSup = isRangeResSupValid(
//                     lastPriceNumber,
//                     tomorrowPredictionNumber,
//                     supportPredictionNumber,
//                   );
//                   if (lastPriceNumber > futurePriceVisible) {
//                     aiTrendStatus = 'Extremely Bullish';
//                   } else if (isTargetValid) {
//                     aiTrendStatus = 'Reverse Down';
//                   } else if (
//                     lastPriceNumber < supportPredictionNumber ||
//                     isTargetResSup
//                   ) {
//                     // aiTrendStatus = "Neutral";
//                     if (pricePercent >= 0 && pricePercent <= 2) {
//                       aiTrendStatus = 'Neutral';
//                     } else if (pricePercent > 2 && pricePercent <= 5) {
//                       aiTrendStatus = 'Bullish';
//                     } else if (pricePercent > 5 && pricePercent <= 8) {
//                       aiTrendStatus = 'Very Bullish';
//                     } else if (pricePercent > 8) {
//                       aiTrendStatus = 'Extremely Bullish';
//                     } else if (pricePercent < 0 && pricePercent >= -2) {
//                       aiTrendStatus = 'Neutral';
//                     } else if (pricePercent < -2 && pricePercent >= -5) {
//                       aiTrendStatus = 'bearish';
//                     } else if (pricePercent < -5 && pricePercent >= -8) {
//                       aiTrendStatus = 'Very Bearish';
//                     } else if (pricePercent < -8) {
//                       aiTrendStatus = 'Extremely Bearish';
//                     }
//                   }
//                 } else {
//                   const isTargetValid = isFutureSellTargetValid(
//                     lastPriceNumber,
//                     supportPredictionNumber,
//                     futurePriceVisible,
//                   );
//                   const isTargetResSup = isRangeResSupValid(
//                     lastPriceNumber,
//                     tomorrowPredictionNumber,
//                     supportPredictionNumber,
//                   );
//                   if (lastPriceNumber < futurePriceVisible) {
//                     aiTrendStatus = 'Extremely Bearish';
//                   } else if (isTargetValid) {
//                     aiTrendStatus = 'Reverse Up';
//                   } else if (
//                     lastPriceNumber > tomorrowPredictionNumber ||
//                     isTargetResSup
//                   ) {
//                     // aiTrendStatus = "Neutral";
//                     if (pricePercent >= 0 && pricePercent <= 2) {
//                       aiTrendStatus = 'Neutral';
//                     } else if (pricePercent > 2 && pricePercent <= 5) {
//                       aiTrendStatus = 'Bullish';
//                     } else if (pricePercent > 5 && pricePercent <= 8) {
//                       aiTrendStatus = 'Very Bullish';
//                     } else if (pricePercent > 8) {
//                       aiTrendStatus = 'Extremely Bullish';
//                     } else if (pricePercent < 0 && pricePercent >= -2) {
//                       aiTrendStatus = 'Neutral';
//                     } else if (pricePercent < -2 && pricePercent >= -5) {
//                       aiTrendStatus = 'bearish';
//                     } else if (pricePercent < -5 && pricePercent >= -8) {
//                       aiTrendStatus = 'Very Bearish';
//                     } else if (pricePercent < -8) {
//                       aiTrendStatus = 'Extremely Bearish';
//                     }
//                   }
//                 }

//                 // if (item?.notificationStatus) {
//                 //   if (item.status != aiTrendStatus) {
//                 //     if (item.trends == 'All') {
//                 //       sendPushNotification(
//                 //         fcmToken,
//                 //         item.symbol,
//                 //         aiTrendStatus,
//                 //       );
//                 //       if (notifyData != null) {
//                 //         let array = JSON.parse(notifyData);
//                 //         array.push({
//                 //           title: item.symbol,
//                 //           des: aiTrendStatus,
//                 //           date: new Date(),
//                 //         });
//                 //         AsyncStorage.setItem('Notify', JSON.stringify(array));
//                 //       } else {
//                 //         let array = [];
//                 //         array.push({
//                 //           title: item.symbol,
//                 //           des: aiTrendStatus,
//                 //           date: new Date(),
//                 //         });
//                 //         AsyncStorage.setItem('Notify', JSON.stringify(array));
//                 //       }
//                 //     } else if (item.trends == aiTrendStatus) {
//                 //       sendPushNotification(
//                 //         fcmToken,
//                 //         item.symbol,
//                 //         aiTrendStatus,
//                 //       );
//                 //       if (notifyData != null) {
//                 //         let array = JSON.parse(notifyData);
//                 //         array.push({
//                 //           title: item.symbol,
//                 //           des: aiTrendStatus,
//                 //           date: new Date(),
//                 //         });
//                 //         AsyncStorage.setItem('Notify', JSON.stringify(array));
//                 //       } else {
//                 //         let array = [];
//                 //         array.push({
//                 //           title: item.symbol,
//                 //           des: aiTrendStatus,
//                 //           date: new Date(),
//                 //         });
//                 //         AsyncStorage.setItem('Notify', JSON.stringify(array));
//                 //       }
//                 //     }
//                 //   }
//                 // }

//                 return {
//                   ...item,
//                   selectedValue: selectedValue,
//                   priceChangePercent: binanceSymbolData.P,
//                   lastPrice: lastPriceNumber,
//                   futurePriceVisible: futurePriceVisible,
//                   status: aiTrendStatus,
//                   day_after_tomorrow_prediction: supportPredictionNumber,
//                   tomorrow_prediction: tomorrowPredictionNumber,
//                   formattedPredictionAnalysis: formattedPredictionAnalysis,
//                   pricePercent: pricePercent,
//                 };
//               }
//               return item;
//             });
//           });
//           // setDataActive(allCoinData);
//           socket.close();
//         };
//       }
//     };
//     if (isFocused) {
//       const interval = setInterval(fetchData, 1000); // Fetch data every 60 seconds

//       // Cleanup function to clear the interval
//       return () => clearInterval(interval);
//     }
//   }, [allCoinData, percentage, dataActive, isFocused, socketUrl]);

//   let reverseDown = 0;
//   let bullishCount = 0;
//   let veryBullishCount = 0;
//   let extremelyBullishCount = 0;
//   let neutralCount = 0;
//   let reverseUp = 0;
//   let bearishCount = 0;
//   let veryBearishCount = 0;
//   let extremelyBearishCount = 0;

//   allCoinData.forEach(item => {
//     if (item.status === 'Reverse Up') {
//       reverseUp++;
//     }
//     if (item.status === 'Bullish') {
//       bullishCount++;
//     }
//     if (item.status === 'Very Bullish') {
//       veryBullishCount++;
//     }
//     if (item.status === 'Extremely Bullish') {
//       extremelyBullishCount++;
//     }
//     if (item.status === 'Neutral') {
//       neutralCount++;
//     }
//     if (item.status === 'Reverse Down') {
//       reverseDown++;
//     }
//     if (item.status === 'Bearish') {
//       bearishCount++;
//     }
//     if (item.status === 'Very Bearish') {
//       veryBearishCount++;
//     }
//     if (item.status === 'Extremely Bearish') {
//       extremelyBearishCount++;
//     }
//   });

//   const countDecimalDigits = async number => {
//     const numberString = number;

//     if (numberString.includes('.')) {
//       // Split the string at the decimal point
//       const decimalPart = numberString.split('.')[1];
//       // Return the length of the decimal part
//       return decimalPart.length;
//     } else {
//       // If there is no decimal point, return 0
//       return 0;
//     }
//   };

//   const handleSearch = async text => {
//     setSearch(text);
//     if (text !== '') {
//       const filtered = dataActive.filter(item =>
//         item.symbol.toLowerCase().includes(text.toLowerCase()),
//       );
//       setAllCoinData(filtered);
//     } else {
//       setAllCoinData(dataActive);
//     }
//   };

//   const customSort = (a, b) => {
//     // Convert strings to lowercase for case-insensitive comparison
//     const stringA = a.symbol.toLowerCase();
//     const stringB = b.symbol.toLowerCase();

//     let index = 0;
//     while (index < stringA.length && index < stringB.length) {
//       if (stringA[index] !== stringB[index]) {
//         return stringA.charCodeAt(index) - stringB.charCodeAt(index);
//       }
//       index++;
//     }
//     // If the characters are the same up to the length of the shorter string,
//     // the shorter string should come first
//     return stringA.length - stringB.length;
//   };

//   const firstSorting = async from => {
//     if (from === 'Coin') {
//       if (coinSort === 2) {
//         setCoinSort(0);
//         setLastPrice(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       } else {
//         setCoinSort(coinSort + 1);
//         setLastPrice(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       }
//       if (coinSort + 1 === 1) {
//         const sortedDates = allCoinData.sort(customSort).reverse();
//         setAllCoinData(sortedDates);
//       } else if (coinSort + 1 === 2) {
//         const sortedDates = allCoinData.sort(customSort);
//         setAllCoinData(sortedDates);
//       } else {
//         setAllCoinData(dataActive);
//       }
//     } else if (from === 'SerialNo') {
//       if (serialNo === 2) {
//         setCoinSort(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setLastPrice(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       } else {
//         setSerialNo(serialNo + 1);
//         setLastPrice(0);
//         setCoinSort(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       }
//       if (serialNo + 1 === 1) {
//         const sortedDates = allCoinData
//           .sort((a, b) => a.srNo - b.srNo)
//           .reverse();
//         setAllCoinData(sortedDates);
//       } else if (serialNo + 1 === 2) {
//         const sortedDates = allCoinData.sort((a, b) => a.srNo - b.srNo);
//         setAllCoinData(sortedDates);
//       } else {
//         setAllCoinData(dataActive);
//       }
//     } else if (from === 'Current') {
//       if (current === 2) {
//         setCoinSort(0);
//         setLastPrice(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       } else {
//         setSerialNo(current + 1);
//         setCoinSort(0);
//         setLastPrice(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       }
//       if (current + 1 === 1) {
//         const sortedDates = allCoinData
//           .sort((a, b) => a.pricePercent - b.pricePercent)
//           .reverse();
//         setAllCoinData(sortedDates);
//       } else if (current + 1 === 2) {
//         const sortedDates = allCoinData.sort(
//           (a, b) => a.pricePercent - b.pricePercent,
//         );
//         setAllCoinData(sortedDates);
//       } else {
//         setAllCoinData(dataActive);
//       }
//     } else if (from === 'lastPrice') {
//       if (lastPrice === 2) {
//         setCoinSort(0);
//         setLastPrice(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       } else {
//         setLastPrice(lastPrice + 1);
//         setCoinSort(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       }
//       if (lastPrice + 1 === 1) {
//         const sortedDates = allCoinData
//           .sort((a, b) => a.lastPrice - b.lastPrice)
//           .reverse();
//         setAllCoinData(sortedDates);
//       } else if (lastPrice + 1 === 2) {
//         const sortedDates = allCoinData.sort(
//           (a, b) => a.lastPrice - b.lastPrice,
//         );
//         setAllCoinData(sortedDates);
//       } else {
//         setAllCoinData(dataActive);
//       }
//     } else if (from === 'futureTarget') {
//       if (FutureTarget === 2) {
//         setCoinSort(0);
//         setLastPrice(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       } else {
//         setLastPrice(FutureTarget + 1);
//         setCoinSort(0);
//         setSerialNo(0);
//         setCurrent(0);
//         setAITrend(false);
//         setFutureTarget(0);
//       }
//       if (FutureTarget + 1 === 1) {
//         const sortedDates = allCoinData
//           .sort((a, b) => a.futurePriceVisible - b.futurePriceVisible)
//           .reverse();
//         setAllCoinData(sortedDates);
//       } else if (FutureTarget + 1 === 2) {
//         const sortedDates = allCoinData.sort(
//           (a, b) => a.futurePriceVisible - b.futurePriceVisible,
//         );
//         setAllCoinData(sortedDates);
//       } else {
//         setAllCoinData(dataActive);
//       }
//     } else if (from === 'Trend') {
//       setAITrend(!AITrend);
//     }
//   };

//   const onGetFavoriteData = async favorites => {
//     try {
//       setFavorite(!favorite);
//       if (favorites) {
//         let stickerData = [];
//         allCoinData.map(item => {
//           if (item.favoriteStatus) {
//             stickerData.push(item);
//           }
//         });
//         setAllCoinData(stickerData);
//       } else if (!favorites && !notification) {
//         setAllCoinData(dataActive);
//       } else if (notification) {
//         onGetNotificationData(notification);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const onGetNotificationData = async favorites => {
//     try {
//       setNotification(!notification);
//       if (favorites) {
//         let stickerData = [];
//         allCoinData.map(item => {
//           if (item.notificationStatus) {
//             stickerData.push(item);
//           }
//         });
//         setAllCoinData(stickerData);
//       } else if (!favorites && !favorite) {
//         setAllCoinData(dataActive);
//       } else if (favorite) {
//         onGetFavoriteData(favorite);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const onPostNotificationData = async ticker => {
//     try {
//       setTrendSelect(ticker);
//       if (ticker != 'None') {
//         let raw = JSON.stringify({
//           ticker: tickerSelected,
//           trends: ticker,
//         });
//         const response = await onPostNotificationStatusApi(raw);
//         if (response.data) {
//           console.log('notification Data>>>>', response.data);
//           let valueStore = allCoinData;
//           response.data.map(item => {
//             valueStore.map((item1, index) => {
//               if (item1.symbol == item.ticker) {
//                 valueStore[index].notificationStatus = true;
//                 valueStore[index].trends = item.trends;
//               }
//             });
//           });
//           setAllCoinData(valueStore);
//           setDataActive(valueStore);
//         } else {
//           console.log('Error::', response.data);
//         }
//       } else {
//         let raw = JSON.stringify({
//           ticker: tickerSelected,
//         });
//         const response = await onDeleteNotificationDataApi(raw);
//         if (response) {
//           console.log('favorite Data>>>>', response);
//           let valueStore = allCoinData;
//           const response1 = await onGetNotificationStatusApi();
//           valueStore.map(index => {
//             valueStore[index].notificationStatus = false;
//             valueStore[index].trends = 'None';
//           });
//           valueStore.map((item1, index) => {
//             response1.data.map(item => {
//               if (item1.symbol === item.ticker) {
//                 valueStore[index].notificationStatus = true;
//                 valueStore[index].trends = item.trends;
//               }
//             });
//           });
//           setAllCoinData(valueStore);
//           setDataActive(valueStore);
//         } else {
//           console.log('Err::', response);
//         }
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const onPostFavoriteData = async ticker => {
//     try {
//       let raw = JSON.stringify({
//         tickers_list: ticker,
//       });
//       const response = await onPostFavoriteStatusApi(raw);
//       if (response.data) {
//         console.log('favorite Data>>>>', response.data);
//         let valueStore = allCoinData;
//         response.data.tickers_list.map(item => {
//           valueStore.map((item1, index) => {
//             if (item1.symbol == item) {
//               valueStore[index].favoriteStatus = true;
//             }
//           });
//         });
//         setAllCoinData(valueStore);
//         setDataActive(valueStore);
//       } else {
//         console.log('Error::', response.data);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   const onDeleteFavoriteData = async ticker => {
//     try {
//       let raw = JSON.stringify({
//         ticker: ticker,
//       });
//       const response = await onDeleteFavoriteDataApi(raw);
//       if (response) {
//         console.log('favorite Data>>>>', response);
//         let valueStore = allCoinData;
//         valueStore.map(index => {
//           valueStore[index].favoriteStatus = false;
//         });
//         valueStore.map((item1, index) => {
//           response.tickers_list.map(item => {
//             if (item1.symbol === item) {
//               valueStore[index].favoriteStatus = true;
//             }
//           });
//         });
//         setAllCoinData(valueStore);
//         setDataActive(valueStore);
//       } else {
//         console.log('Err::', response);
//       }
//     } catch (err) {
//       console.log('Error::', err);
//     }
//   };

//   return (
//     <View style={styles.safeAreaStyle}>
//       <View
//         style={{
//           width: '100%',
//           height: hasNotch() ? hp(5) : 0,
//           backgroundColor: COLORS.white,
//         }}
//       />
//       <View style={styles.container}>
//         <View style={styles.headerView}>
//           <Header
//             title={'AI Price Prediction'}
//             notificationPress={() => navigation.navigate('NotificationScreen')}
//             onPress={() => navigation.openDrawer()}
//           />
//         </View>
//         <View style={styles.mainView}>
//           <KeyboardAwareScrollView
//             ref={scrollRef}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{paddingBottom: hp(15)}}>
//             <View style={styles.headingsView}>
//               {titleArray.map((item, index) => {
//                 return (
//                   <View style={styles.heading}>
//                     <Text style={[styles.valueText, {color: item.color}]}>
//                       {item.name === 'Reverse Down'
//                         ? reverseDown
//                         : item.name === 'Bullish'
//                         ? bullishCount
//                         : item.name === 'Very Bullish'
//                         ? veryBullishCount
//                         : item.name === 'Extremely Bullish'
//                         ? extremelyBullishCount
//                         : item.name === 'Reverse Up'
//                         ? reverseUp
//                         : item.name === 'Bearish'
//                         ? bearishCount
//                         : item.name === 'Very Bearish'
//                         ? veryBearishCount
//                         : item.name === 'Extremely Bearish'
//                         ? extremelyBearishCount
//                         : neutralCount}
//                     </Text>
//                     <View
//                       style={[styles.titleView, {backgroundColor: item.color}]}>
//                       <Text style={styles.titleText}>{item.name}</Text>
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//             <TextInput
//               value={search}
//               onChangeText={text => handleSearch(text)}
//               placeholder="Search Coin..."
//               placeholderTextColor={COLORS.greyColor}
//               style={styles.searchText}
//             />

//             <View style={styles.activeView}>
//               <View style={styles.titleActiveView}>
//                 <TouchableOpacity
//                   style={styles.imageView1}
//                   onPress={() => onGetFavoriteData(!favorite)}>
//                   <Image
//                     style={[
//                       styles.starIcon,
//                       {
//                         tintColor: favorite ? COLORS.goldenColor : COLORS.white,
//                       },
//                     ]}
//                     source={favorite ? star1 : star}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.imageView}
//                   onPress={() => onGetNotificationData(!notification)}>
//                   <Image
//                     style={[
//                       styles.starIcon,
//                       {
//                         tintColor: notification
//                           ? COLORS.goldenColor
//                           : COLORS.white,
//                       },
//                     ]}
//                     source={notification ? bell2 : bell1}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('Coin')}
//                   style={[styles.optionTitleView]}>
//                   <Text style={styles.titleText1}>
//                     {`Serial\nNo.  `}
//                     {coinSort === 0 || coinSort === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {coinSort === 0 || coinSort === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('Coin')}
//                   style={[styles.optionTitleView]}>
//                   <Text style={styles.titleText1}>
//                     {`Trending\nCoins  `}
//                     {coinSort === 0 || coinSort === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {coinSort === 0 || coinSort === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('lastPrice')}
//                   style={[styles.optionTitleView]}>
//                   <Text style={styles.titleText1}>
//                     {`Last\nPrice  `}
//                     {lastPrice === 0 || lastPrice === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {lastPrice === 0 || lastPrice === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('lastPrice')}
//                   style={[styles.optionTitleView]}>
//                   <Text style={styles.titleText1}>
//                     {`Current\n%  `}
//                     {lastPrice === 0 || lastPrice === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {lastPrice === 0 || lastPrice === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('lastPrice')}
//                   style={[styles.optionTitleView]}>
//                   <Text style={styles.titleText1}>
//                     {`AI\nTarget  `}
//                     {lastPrice === 0 || lastPrice === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {lastPrice === 0 || lastPrice === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => firstSorting('Trend')}
//                   style={[styles.optionTitleView, {width: wp(27)}]}>
//                   <Text style={styles.titleText2}>AI Trend</Text>
//                   {AITrend ? (
//                     <Image style={styles.upDownImage} source={arrowUp} />
//                   ) : (
//                     <Image style={styles.upDownImage} source={down} />
//                   )}
//                 </TouchableOpacity>
//                 <View style={styles.coinStartView1}>
//                   <Text style={[styles.titleText1, {width: wp(25)}]}>
//                     AI Resistance
//                   </Text>
//                 </View>
//                 <View style={styles.coinStartView1}>
//                   <Text style={[styles.titleText1, {width: wp(27)}]}>
//                     AI Support
//                   </Text>
//                 </View>
//                 {/* <TouchableOpacity
//                   onPress={() => firstSorting('futureTarget')}
//                   style={[styles.optionTitleView, {width: wp(25)}]}>
//                   <Text style={[styles.titleText1]}>
//                     {'Future\nTarget  '}
//                     {FutureTarget === 0 || FutureTarget === 1 ? (
//                       <Image style={styles.upDownImage} source={arrowUp} />
//                     ) : null}
//                     {FutureTarget === 0 || FutureTarget === 2 ? (
//                       <Image style={styles.upDownImage} source={down} />
//                     ) : null}
//                   </Text>
//                 </TouchableOpacity> */}
//               </View>
//               <FlatList
//                 data={allCoinData}
//                 extraData={allCoinData}
//                 showsVerticalScrollIndicator={false}
//                 // nestedScrollEnabled
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 // stickyHeaderIndices={[0]}
//                 // ListHeaderComponent={
//                 //   <View style={styles.titleActiveView}>
//                 //     <TouchableOpacity
//                 //       onPress={() => firstSorting('Coin')}
//                 //       style={[styles.optionTitleView1, {width: wp(27)}]}>
//                 //       <Text style={styles.titleText1}>
//                 //         {`Trending\nCoins  `}
//                 //         {coinSort === 0 || coinSort === 1 ? (
//                 //           <Image style={styles.upDownImage} source={arrowUp} />
//                 //         ) : null}
//                 //         {coinSort === 0 || coinSort === 2 ? (
//                 //           <Image style={styles.upDownImage} source={down} />
//                 //         ) : null}
//                 //       </Text>
//                 //     </TouchableOpacity>
//                 //     <TouchableOpacity
//                 //       style={styles.imageView1}
//                 //       onPress={() => onGetFavoriteData(!favorite)}>
//                 //       <Image
//                 //         style={[
//                 //           styles.starIcon,
//                 //           {
//                 //             tintColor: favorite
//                 //               ? COLORS.goldenColor
//                 //               : COLORS.white,
//                 //           },
//                 //         ]}
//                 //         source={favorite ? star1 : star}
//                 //       />
//                 //     </TouchableOpacity>
//                 //     <TouchableOpacity
//                 //       style={styles.imageView}
//                 //       onPress={() => onGetNotificationData(!notification)}>
//                 //       <Image
//                 //         style={[
//                 //           styles.starIcon,
//                 //           {
//                 //             tintColor: notification
//                 //               ? COLORS.goldenColor
//                 //               : COLORS.white,
//                 //           },
//                 //         ]}
//                 //         source={notification ? bell2 : bell1}
//                 //       />
//                 //     </TouchableOpacity>
//                 //     <TouchableOpacity
//                 //       onPress={() => firstSorting('lastPrice')}
//                 //       style={[styles.optionTitleView, {width: wp(25)}]}>
//                 //       <Text style={styles.titleText1}>
//                 //         {`Last\nPrice  `}
//                 //         {lastPrice === 0 || lastPrice === 1 ? (
//                 //           <Image style={styles.upDownImage} source={arrowUp} />
//                 //         ) : null}
//                 //         {lastPrice === 0 || lastPrice === 2 ? (
//                 //           <Image style={styles.upDownImage} source={down} />
//                 //         ) : null}
//                 //       </Text>
//                 //     </TouchableOpacity>
//                 //     <TouchableOpacity
//                 //       onPress={() => firstSorting('Trend')}
//                 //       style={[styles.optionTitleView, {width: wp(27)}]}>
//                 //       <Text style={styles.titleText1}>AI Trend</Text>
//                 //       {AITrend ? (
//                 //         <Image style={styles.upDownImage} source={arrowUp} />
//                 //       ) : (
//                 //         <Image style={styles.upDownImage} source={down} />
//                 //       )}
//                 //     </TouchableOpacity>
//                 //     <Text style={[styles.titleText1, {width: wp(25)}]}>
//                 //       AI Resistance
//                 //     </Text>
//                 //     <Text style={[styles.titleText1, {width: wp(27)}]}>
//                 //       AI Support
//                 //     </Text>
//                 //     <TouchableOpacity
//                 //       onPress={() => firstSorting('futureTarget')}
//                 //       style={[styles.optionTitleView, {width: wp(25)}]}>
//                 //       <Text style={[styles.titleText1]}>
//                 //         {'Future\nTarget  '}
//                 //         {FutureTarget === 0 || FutureTarget === 1 ? (
//                 //           <Image style={styles.upDownImage} source={arrowUp} />
//                 //         ) : null}
//                 //         {FutureTarget === 0 || FutureTarget === 2 ? (
//                 //           <Image style={styles.upDownImage} source={down} />
//                 //         ) : null}
//                 //       </Text>
//                 //     </TouchableOpacity>
//                 //   </View>
//                 // }
//                 // contentContainerStyle={{paddingBottom: hp(2)}}
//                 keyExtractor={item => item.symbol}
//                 ListEmptyComponent={() => (
//                   <View style={{marginVertical: hp(10), marginLeft: wp(10)}}>
//                     <View
//                       style={{
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}>
//                       <Text
//                         style={{
//                           paddingTop: 15,
//                           color: COLORS.darkGreen,
//                           fontSize: 16,
//                         }}>
//                         No Records Available
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//                 renderItem={({item, index}) => {
//                   const decimalDigitsInPrice = countDigitsAfterDecimal(
//                     item?.lastPrice,
//                   );
//                   if (isSkeletonVisible) {
//                     return <PredictionSkeleton />;
//                   } else {
//                     return (
//                       <View
//                         key={item.symbol}
//                         style={[
//                           styles.dataActiveView,
//                           {
//                             backgroundColor:
//                               index % 2 === 0
//                                 ? COLORS.lightPrimary
//                                 : COLORS.lightPrimary3,
//                           },
//                         ]}>
//                         <TouchableOpacity
//                           style={styles.imageView1}
//                           onPress={() => {
//                             item.favoriteStatus
//                               ? onDeleteFavoriteData(item.symbol)
//                               : onPostFavoriteData(item.symbol);
//                           }}>
//                           <Image
//                             style={[
//                               styles.starIcon,
//                               {
//                                 tintColor: item.favoriteStatus
//                                   ? COLORS.goldenColor
//                                   : COLORS.black,
//                               },
//                             ]}
//                             source={item.favoriteStatus ? star1 : star}
//                           />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           style={styles.imageView}
//                           onPress={() => {
//                             setBottomModal(true);
//                             setTickerSelected(item.symbol);
//                             setTrendSelect(item.trends);
//                           }}>
//                           <Image
//                             style={[
//                               styles.starIcon,
//                               {
//                                 tintColor: item.notificationStatus
//                                   ? COLORS.goldenColor
//                                   : COLORS.black,
//                               },
//                             ]}
//                             source={item.notificationStatus ? bell2 : bell1}
//                           />
//                         </TouchableOpacity>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText1]}>{item.srNo} </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText1]}>{item.symbol} </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText1]}>
//                             {item.lastPrice}
//                           </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText1]}>
//                             {item.pricePercent}
//                           </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text
//                             style={[
//                               styles.dataText1,
//                               {
//                                 color:
//                                   item.selectedValue ===
//                                   item.tomorrow_prediction
//                                     ? COLORS.darkGreen
//                                     : COLORS.errorColor,
//                               },
//                             ]}>
//                             {item.futurePriceVisible}
//                           </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text
//                             style={[
//                               styles.dataText1,
//                               {
//                                 color:
//                                   item.status === 'Reverse Down'
//                                     ? '#00008b'
//                                     : item.status === 'Bullish'
//                                     ? '#236a4f'
//                                     : item.status === 'Very Bullish'
//                                     ? '#349b73'
//                                     : item.status === 'Extremely Bullish'
//                                     ? '#39ff14'
//                                     : item.status === 'Reverse Up'
//                                     ? '#4444b2'
//                                     : item.status === 'Bearish'
//                                     ? '#a81e08eb'
//                                     : item.status === 'Very Bearish'
//                                     ? '#d83218eb'
//                                     : item.status === 'Extremely Bearish'
//                                     ? '#ff3314'
//                                     : '#ffa500',
//                               },
//                             ]}>
//                             {item.status}
//                           </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText]}>
//                             {item.tomorrow_prediction}
//                           </Text>
//                         </View>
//                         <View style={styles.coinStartView}>
//                           <Text style={[styles.dataText]}>
//                             {item.day_after_tomorrow_prediction}
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   }
//                 }}
//               />
//             </View>
//           </KeyboardAwareScrollView>
//         </View>
//       </View>
//       <BottomOptionMenu
//         modelVisible={bottomModal}
//         setModelVisible={() => setBottomModal(false)}
//         setTrendSelect={text => onPostNotificationData(text)}
//         trendSelect={trendSelect}
//       />
//     </View>
//   );
// };

// export default PricePrediction;
