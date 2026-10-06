import {View, SafeAreaView, Platform, Image, Animated, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {
  fetchAnalyticsData,
  fetchAutoManualData,
  fetchBalance,
  fetchBinanceData,
  fetchBotLeadData,
  fetchFavoriteData,
  fetchFuturePriceData,
  fetchLastLeadData,
  fetchMarqueeData,
  fetchMenuList,
  fetchNotificationCount,
  fetchNotificationData,
  fetchPercentageStatusData,
  fetchPricePredicationData,
  fetchSttingData,
  fetchTickerData,
  fetchUserDataSuccess,
} from '../../redux/reducer';
import {
  onGetAIDataApi,
  onGetAnalyticsDataApi,
  onGetAutoManualDataApi,
  onGetBalanceApi,
  onGetBinanceDataApi,
  onGetBotLastLeadApi,
  onGetFavoriteStatusApi,
  onGetFuturePriceApi,
  onGetLastLeadApi,
  onGetMarqueeApi,
  onGetMenuApi,
  onGetNotificationListApi,
  onGetNotificationStatusApi,
  onGetPercentStatusApi,
  onGetProfileApi,
  onGetSplashLogoApi,
  onGetTickerDataApi,
} from '../../services/Api';

const LoadingScreen = ({navigation}) => {
  const [logoImage, setLogoImage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // const onGetLogoValue = async () => {
    //   try {
    //     const response = await onGetSplashLogoApi();
    //     if (response.data) {
    //       console.log('onGetProfileApi Data>>>>', response.data);
    //       response.data.map(item => {
    //         if (item.name == 'LOGO') {
    //           setLogoImage(item.images);
    //           setRefresh(!refresh);
    //         }
    //       });
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // onGetLogoValue();
    onAllDataGet();
  }, []);

  // const onCheckAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     if (Platform.OS == 'android') {
  //       const fcmToken = await messaging().getToken();
  //       console.log('Get FCM TOKEN:::', fcmToken);
  //       AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //     if (token !== null) {
  //       onAllDataGet();
  //       const notification = await AsyncStorage.getItem('Notify');
  //       if (notification != null) {
  //         let strNotify = JSON.parse(notification);
  //         let count = 0;
  //         strNotify.map((item, index) => {
  //           if (item.readMessage == false) {
  //             count = count + 1;
  //           }
  //         });
  //         dispatch(fetchNotificationCount(count));
  //       }
  //     } else {
  //       navigation.replace('LoginScreen');
  //     }
  //   } catch (err) {
  //     console.log('Error::', err);
  //   }
  // };

  const onAllDataGet = async () => {
    try {
      try {
        const notification = await onGetNotificationListApi();
        if (notification.data) {
          let strNotify = notification.data.results;
          let count = 0;
          strNotify.map((item, index) => {
            if (item.recive == false) {
              count = count + 1;
            }
          });
          dispatch(fetchNotificationCount(count));
        }
      } catch (err) {
        console.log('onGetProfileApi::', err);
      }
      AsyncStorage.setItem('selectedScreen', '');
      try {
        const response = await onGetProfileApi();
        if (response.data) {
          console.log('onGetProfileApi Data>>>>', response.data);
          dispatch(fetchUserDataSuccess(response.data));
        }
      } catch (err) {
        console.log('onGetProfileApi::', err);
      }

      try {
        const balanceResponse = await onGetBalanceApi();
        if (balanceResponse.data) {
          console.log('onGetBalanceApi Data>>>>', balanceResponse.data);
          dispatch(fetchBalance(balanceResponse.data));
        }
      } catch (err) {
        console.log('onGetBalanceApi::', err);
      }

      try {
        const response1 = await onGetAIDataApi();
        if (response1.data) {
          console.log('onGetAIDataApi Data>>>>', response1.data);
          dispatch(fetchSttingData(response1.data));
        }
      } catch (err) {
        console.log('onGetAIDataApi::', err);
      }

      try {
        const response2 = await onGetMarqueeApi();
        if (response2.data) {
          console.log('onGetMarqueeApi Data>>>>', response2.data);
          dispatch(fetchMarqueeData(response2.data.reverse()));
        }
      } catch (err) {
        console.log('onGetMarqueeApi::', err);
      }

      try {
        const response3 = await onGetLastLeadApi();
        if (response3.data?.results) {
          dispatch(fetchLastLeadData(response3.data?.results));
        }
      } catch (err) {
        console.log('onGetLastLeadApi::', err);
      }

      try {
        const responseMenu = await onGetMenuApi();
        if (responseMenu.data?.mobile_menu_injection) {
          dispatch(fetchMenuList(responseMenu.data?.mobile_menu_injection));
        }
      } catch (err) {
        console.log('onGetLastLeadApi::', err);
      }

      try {
        const response4 = await onGetAutoManualDataApi();
        if (response4.data) {
          dispatch(fetchAutoManualData(response4.data));
        }
      } catch (err) {
        console.log('onGetAutoManualDataApi::', err);
      }

      try {
        const response5 = await onGetTickerDataApi();
        if (response5.data?.data) {
          dispatch(fetchTickerData(response5.data?.data));
        }
        const response6 = await onGetBinanceDataApi();
        if (response6.data) {
          dispatch(fetchBinanceData(response6.data));
        }
        const responseFavorite = await onGetFavoriteStatusApi();
        if (responseFavorite.data) {
          dispatch(
            fetchFavoriteData(responseFavorite.data.withlist.tickers_list),
          );
        }
        const responseNotification = await onGetNotificationStatusApi();
        if (responseNotification.data) {
          dispatch(fetchNotificationData(responseNotification.data));
        }
        const futureResponse = await onGetFuturePriceApi();
        if (futureResponse.data) {
          dispatch(fetchFuturePriceData(futureResponse.data));
        }
        const percentageStatusResponse = await onGetPercentStatusApi();
        if (percentageStatusResponse.data) {
          dispatch(fetchPercentageStatusData(percentageStatusResponse.data));
        }
        // getValueOfTickerData(
        //   response6.data,
        //   response5.data?.data,
        //   responseFavorite.data.withlist.tickers_list,
        //   responseNotification.data,
        //   futureResponse.data,
        //   percentageStatusResponse.data,
        // );
      } catch (err) {
        console.log('percentageStatusResponse::', err);
      }

      try {
        const AnalyticsResponse = await onGetAnalyticsDataApi();
        if (AnalyticsResponse.data) {
          dispatch(fetchAnalyticsData(AnalyticsResponse.data));
        }
      } catch (err) {
        console.log('AnalyticsResponse::', err);
      }

      try {
        const botLeadResponse = await onGetBotLastLeadApi();
        if (botLeadResponse.data?.results) {
          dispatch(fetchBotLeadData(botLeadResponse.data?.results));
        }
      } catch (err) {
        console.log('botLeadResponse::', err);
      }
    } catch (err) {
      console.log('Error::', err);
    }
    navigation.replace('TabStack');
  };

  const getValueOfTickerData = async (
    binanceData,
    tickerData,
    favoriteData,
    notificationData,
    futurePriceData,
    percentageStatusData,
  ) => {
    try {
      if (binanceData) {
        let allTicker = [];
        let allTicket1 = [];
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
        // allTicker.map(index => {
        //   allTicker[index].favoriteStatus = false;
        // });
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
            // Check if the values are valid numbers
            const lastPriceNumber = parseFloat(item.lastPrice);
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
            let futurePriceVisible = 0;
            let selectedValue = 0;
            if (isR) {
              const futurePrice =
                (tomorrowPredictionNumber * randomPercentageValue) / 100;
              selectedValue = tomorrowPredictionNumber;
              futurePriceVisible = tomorrowPredictionNumber + futurePrice;
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
              futurePriceVisible = supportPredictionNumber - futurePrice;
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
            const originalNumber = parseFloat(item.lastPrice);
            const formattedNumber = originalNumber
              .toFixed(10)
              .replace(/\.?0*$/, '');
            return {
              ...item,
              selectedValue: selectedValue,
              priceChangePercent: item.priceChangePercent,
              lastPrice: formattedNumber,
              futurePriceVisible: futurePriceVisible,
              status: status,
              day_after_tomorrow_prediction: supportPredictionNumber,
              tomorrow_prediction: tomorrowPredictionNumber,
            };
          }
          return item;
        });
        dispatch(fetchPricePredicationData(allTicket1));
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const width = new Animated.Value(80);
  const height = new Animated.Value(40);

  useEffect(() => {
    const onGetLogoValue = async () => {
      try {
        const response = await onGetSplashLogoApi();
        if (response.data) {
          console.log('onGetProfileApi Data>>>>', response.data);
          response.data.forEach(item => {
            if (item.name === 'LOADING_SCREEN') {
              setLogoImage(item.images);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    onGetLogoValue(); // Fetch logo image from API

    // Start animation after logo image is fetched
    const animate = () => {
      Animated.timing(
        width, // The animated value to drive
        {
          toValue: 160, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        // width.setValue(100);
        animate1(); // Repeat animation
      });
    };

    const animate1 = () => {
      Animated.timing(
        width, // The animated value to drive
        {
          toValue: 80, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        width.setValue(80);
        animate(); // Repeat animation
      });
    };

    const animate2 = () => {
      Animated.timing(
        height, // The animated value to drive
        {
          toValue: 90, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        // height.setValue(60);
        animate3(); // Repeat animation
      }); // Starts the animation
    };

    const animate3 = () => {
      Animated.timing(
        height, // The animated value to drive
        {
          toValue: 40, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        height.setValue(40);
        animate2(); // Repeat animation
      });
    };
    if (logoImage) {
      animate(); // Start animation only if logoImage is available
    }
    if (logoImage) {
      animate2();
    }
  }, [logoImage]);

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.container}>
        {logoImage ? (
          <Animated.Image
            source={{uri: logoImage}}
            style={{
              width: width,
              height: height,
              position: 'absolute',
              resizeMode: 'contain',
            }}
          />
        ) : (
          <Animated.Image
            source={require('../../images/logo.png')}
            style={{
              width: width,
              height: height,
              position: 'absolute',
              resizeMode: 'contain',
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
