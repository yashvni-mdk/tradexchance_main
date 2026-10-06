import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  TouchableHighlight,
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
import card5 from '../../images/card5.png';
import {Marquee} from '@animatereactnative/marquee';
import {
  onGetAutoManualDataApi,
  onGetBalanceApi,
  onGetLastLeadApi,
  onGetMarqueeApi,
  onPostAutoManualDataApi,
  onGetTickerDataApi,
  onGetBinanceDataApi,
  onPostTickerDataApi,
  onGetCryptoTickerDataApi,
  onDeleteTickerDataApi,
  onPostTickerConfigDataApi,
  onDeleteTickerConfigDataApi,
  onGetTickerConfigDataApi,
  onGetAIDataApi,
  onPostAIDataApi,
} from '../../services/Api';
import moment from 'moment';
import {InvitePopup} from '../../components/InvitePopup';
import Clipboard from '@react-native-clipboard/clipboard';
import {BotSettingPopup} from '../../components/BotSettingPopup';
import {CommonPopup} from '../../components/CommonPopup';
import {BotManualPopup} from '../../components/BotManualPopup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {CoinSettingPopup} from '../../components/CoinSettingPopup';
import SkeletonPlaceholderComponent from '../../components/SkeletonPlaceholderComponent';
import {useIsFocused} from '@react-navigation/native';
import Config from 'react-native-config';
import {Neomorph} from 'react-native-neomorph-shadows';
import {AIBotSettingPopup} from '../../components/AIBotSettingPopup';
import {useSelector, useDispatch} from 'react-redux';
import {fetchAutoManualData} from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dataArray = [
  {
    id: 1,
    date: '0.063',
    coin: 'POLYXUSDT',
    price: '0.1563245',
    type: 'Sell',
  },
];

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user_data = useSelector(state => state.user_data);
  const balanceData = useSelector(state => state.balanceData);
  const settingData = useSelector(state => state.settingData);
  const marqueeData = useSelector(state => state.marqueeData);
  const lastLeadData = useSelector(state => state.lastLeadData);
  const autoManualData = useSelector(state => state.autoManualData);
  const tickerData = useSelector(state => state.tickerData);
  const binanceData = useSelector(state => state.binanceData);
  // const notificationCount = useSelector(state => state.notificationCount);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referal, setReferal] = useState('');
  const [filterLead, setFilterLead] = useState([]);
  const [coinDataList, setCoinDataList] = useState([]);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [marqueeDataList, setMarqueeDataList] = useState([]);
  const [search, setSearch] = useState('');
  const [search1, setSearch1] = useState('');
  const [autoSelect, setAutoSelect] = useState(false);
  const [leverage, setLeverage] = useState('0');
  const [amount, setAmount] = useState('0');
  const [profit, setProfit] = useState('0');
  const [loss, setLoss] = useState('0');
  const [sellProfit, setSellProfit] = useState('0');
  const [sellLoss, setSellLoss] = useState('0');
  const [dailyProfit, setDailyProfit] = useState('0');
  const [dailyLoss, setDailyLoss] = useState('0');
  const [botConfig, setBotConfig] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [botModalVisible, setBotModalVisible] = useState(false);
  const [botManualVisible, setBotManualVisible] = useState(false);
  const [AIleverage, setAILeverage] = useState('0');
  const [AIamount, setAIAmount] = useState('0');
  const [AIprofit, setAIProfit] = useState('0');
  const [AIloss, setAILoss] = useState('0');
  const [AIsellProfit, setAISellProfit] = useState('0');
  const [AIsellLoss, setAISellLoss] = useState('0');
  const [AIdailyProfit, setAIDailyProfit] = useState('0');
  const [AIdailyLoss, setAIDailyLoss] = useState('0');
  const [AIbotConfig, setAIBotConfig] = useState(false);
  const [AIcurrentPage, setAICurrentPage] = useState(0);
  const [AISettingObject, setAISettingObject] = useState(null);
  const [AIbotModalVisible, setAIBotModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [deletePopup, setDeletePopup] = useState(false);
  const [allTickerData, setAllTickerData] = useState([]);
  const [filterTickerData, setFilterTickerData] = useState([]);
  const [tickerValueVisible, setTickerValueVisible] = useState(false);
  const [selectedValueDelete, setSelectedValueDelete] = useState('');
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [leverage1, setLeverage1] = useState('5');
  const [amount1, setAmount1] = useState('100');
  const [profit1, setProfit1] = useState('5');
  const [loss1, setLoss1] = useState('10');
  const [sellProfit1, setSellProfit1] = useState('5');
  const [sellLoss1, setSellLoss1] = useState('10');
  const [buyOnly, setBuyOnly] = useState(true);
  const [sellOnly, setSellOnly] = useState(false);
  const [buySellMode, setBuySellMode] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [botConfig1, setBotConfig1] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [coinSort, setCoinSort] = useState(0);
  const [CHG, setCHGSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [autoConfigObject, setAutoConfigObject] = useState(null);
  const [coinLength, setCoinLength] = useState(0);
  const [isPressArray, setIsPressArray] = useState([]);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [onFinishStatus, setOnFinishStatus] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    try {
      if (user_data) {
        if (user_data?.first_name) {
          setFirstName(user_data?.first_name);
        }
        if (user_data?.last_name) {
          setLastName(user_data?.last_name);
        }
        if (user_data?.referal_code) {
          setReferal(user_data?.referal_code);
        }
      }
      if (settingData) {
        setAISettingObject(settingData);
        setAIBotConfig(settingData?.active_ai_bot_trading);
      }
      if (lastLeadData) {
        setFilterLead(lastLeadData);
        setIsPressArray(Array(lastLeadData.length).fill(false));
        setIsPressArray1(Array(lastLeadData.length).fill(false));
      }
      if (autoManualData) {
        if (autoManualData?.leverage > 0) {
          setCurrentPage(4);
        }
        setAutoConfigObject(autoManualData);
        setLeverage(JSON.stringify(autoManualData?.leverage));
        setAmount(JSON.stringify(autoManualData?.amount));
        setProfit(JSON.stringify(autoManualData?.take_profit));
        setLoss(JSON.stringify(autoManualData?.stoploss));
        setSellProfit(JSON.stringify(autoManualData?.sell_take_profit));
        setSellLoss(JSON.stringify(autoManualData?.sell_stoploss));
        setDailyProfit(
          JSON.stringify(autoManualData?.take_profit_daily_percentage),
        );
        setDailyLoss(
          JSON.stringify(autoManualData?.take_loss_daily_percentage),
        );
        setBotConfig(autoManualData?.auto_bot_config);
      }
    } catch (err) {
      console.log('error', err);
    }
  }, []);

  const onPostSettingData = async () => {
    try {
      let raw = JSON.stringify({
        active_ai_bot_trading: AIbotConfig,
      });
      const response = await onPostAIDataApi(raw);
      if (response.data) {
        setOnFinishStatus(true);
        setCurrentPage(5);
        setAISettingObject(response.data);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const onGetSelectedTicker = async ticker => {
    try {
      const response = await onGetCryptoTickerDataApi();
      if (response.data) {
        let allTicker = [];
        response.data.tickers_list.map(item => {
          allTicker.push({symbol: item});
        });
        allTicker.map((item1, index) => {
          ticker.map(item => {
            if (item.symbol === item1.symbol) {
              allTicker[index] = item;
            }
          });
        });
        setCoinLength(response.data.total_tracker);
        onCoinTickerConfigAdd(allTicker.reverse());
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  useEffect(() => {
    const getValueOfTickerData = async () => {
      try {
        let count = await AsyncStorage.getItem('notificationCount');
        setNotificationCount(count);
        if (binanceData) {
          let allTicker = [];
          tickerData.map(item => {
            binanceData.map(item1 => {
              if (item1.symbol == item) {
                allTicker.push(item1);
              }
            });
          });
          setAllTickerData(allTicker);
          setFilterTickerData(allTicker);
          onGetSelectedTicker(allTicker);
        }
      } catch (err) {
        console.log('Error::', err);
      }
    };
    getValueOfTickerData();
  }, []);

  const onCoinTickerConfigAdd = async allTicker => {
    try {
      setIsSkeletonVisible(true);
      const response = await onGetTickerConfigDataApi();

      if (response.data) {
        let allTicker1 = allTicker;
        response.data.map(item1 => {
          allTicker1.map((item, index) => {
            if (item.symbol === item1.ticker_name) {
              allTicker1[index] = {...item, ...item1};
            }
          });
        });
        setIsSkeletonVisible(false);
        setCoinDataList(allTicker1);
        setDataActiveSort(allTicker1);
        setIsLoading(!isLoading);
      }
    } catch (err) {
      console.log('err::', err.response.data);
    }
  };

  useEffect(() => {
    let socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
    const fetchData = () => {
      // const socket = new WebSocket(socketUrl + socketPath);
      if (coinDataList.length > 0) {
        socket.onmessage = event => {
          const binanceWebSocketData = JSON.parse(event.data);
          setCoinDataList(prevData => {
            return prevData.map(item => {
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
          });
          setDataActiveSort(coinDataList);
          setFilterTickerData(prevData => {
            return prevData.map(item => {
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
          });
          socket.close();
        };
      }
    };
    if (isFocused) {
      const interval = setInterval(fetchData, 2000);

      return () => clearInterval(interval);
    }
  }, [isFocused, coinDataList]);

  const onPostAutoManualData = async () => {
    try {
      let raw = JSON.stringify({
        currency: 'USDT',
        leverage: parseFloat(leverage),
        amount: parseFloat(amount),
        take_profit: parseFloat(profit),
        sell_take_profit: parseFloat(sellProfit),
        stoploss: parseFloat(loss),
        sell_stoploss: parseFloat(sellLoss),
        take_profit_daily_percentage: parseFloat(dailyProfit),
        take_loss_daily_percentage: parseFloat(dailyLoss),
        auto_bot_config: botConfig,
      });
      const response = await onPostAutoManualDataApi(raw);
      console.log('Response>>', response.data?.leverage);
      if (response.data) {
        setOnFinishStatus(true);
        setCurrentPage(5);
        dispatch(fetchAutoManualData(response.data));
        setAutoConfigObject(response.data);
        setLeverage(JSON.stringify(response.data?.leverage));
        setAmount(JSON.stringify(response.data?.amount));
        setProfit(JSON.stringify(response.data?.take_profit));
        setLoss(JSON.stringify(response.data?.stoploss));
        setSellProfit(JSON.stringify(response.data?.sell_take_profit));
        setSellLoss(JSON.stringify(response.data?.sell_stoploss));
        setDailyProfit(
          JSON.stringify(response.data?.take_profit_daily_percentage),
        );
        setDailyLoss(JSON.stringify(response.data?.take_loss_daily_percentage));

        setBotConfig(response.data?.auto_bot_config);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const onPostTickerAddData = async () => {
    try {
      let raw = JSON.stringify({
        ticker_name: selectedValueDelete,
        currency: 'USDT',
        leverage: parseFloat(leverage1),
        amount: parseFloat(amount1),
        take_profit: parseFloat(profit1),
        sell_take_profit: parseFloat(sellProfit1),
        stoploss: parseFloat(loss1),
        sell_stoploss: parseFloat(sellLoss1),
        stretegy: buyOnly
          ? 'buy-on-signal'
          : sellOnly
          ? 'sell-on-signal'
          : buySellMode
          ? 'buy-or-sell-on-signal'
          : 'reverse-trade',
        is_active: botConfig1,
      });
      const response = await onPostTickerConfigDataApi(raw);
      console.log('Response>>', response.data?.leverage);
      if (response.data) {
        console.log('Response>>', response.data?.leverage);
        let allTicker1 = coinDataList;
        allTicker1.map((item, index) => {
          if (item.symbol === response.data?.ticker_name) {
            allTicker1[index].leverage = response.data?.leverage;
            allTicker1[index].amount = response.data?.amount;
            allTicker1[index].stretegy = response.data?.stretegy;
            allTicker1[index].is_active = response.data?.is_active;
            allTicker1[index].take_profit = response.data?.take_profit;
            allTicker1[index].stoploss = response.data?.stoploss;
            allTicker1[index].sell_take_profit = response.data?.sell_take_profit;
            allTicker1[index].sell_stoploss = response.data?.sell_stoploss;
            allTicker1[index].created_at = response.data?.created_at;
            allTicker1[index].updated_at = response.data?.updated_at;
          }
        });
        setCoinDataList(allTicker1);
        setDataActiveSort(allTicker1);
        setCoinModalVisible(false);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = lastLeadData.filter(item =>
        item.ticker.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterLead(filtered);
    } else {
      setFilterLead(lastLeadData);
    }
  };

  const onLinkCopy = () => {
    setInviteVisible(false);
    Clipboard.setString(
      `https://indicatorleads.com/login?referralId=${referal}`,
    );
    showMessage({
      message: 'Successfully Copied!',
      type: 'success',
      duration: 3000,
    });
  };

  const handleSearch1 = text => {
    setSearch1(text);
    if (text !== '') {
      setTickerValueVisible(true);
      const filtered = allTickerData.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterTickerData(filtered);
      setRefresh(!refresh);
    } else {
      setTickerValueVisible(false);
      setFilterTickerData(allTickerData);
      setRefresh(!refresh);
    }
  };

  const onPostTickerData = async symbol => {
    try {
      let raw = JSON.stringify({
        tickers_list: symbol,
      });
      const response = await onPostTickerDataApi(raw);
      if (response.data) {
        let allTicker = [];
        allTickerData.map(item1 => {
          response.data.tickers_list.map(item => {
            if (item1.symbol === item) {
              allTicker.push(item1);
            }
          });
        });
        onCoinTickerConfigAdd(allTicker);
        showMessage({
          message: `${symbol} Coin Added Successfully`,
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      showMessage({
        message: err.response.data.detail,
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error:', err.response.data);
    }
  };

  const renderItem = ({item, index}) => {
    const originalNumber = parseFloat(item?.lastPrice);
    const formattedNumber = originalNumber.toFixed(10).replace(/\.?0*$/, '');
    if (search1 === '') {
      if (index <= 3) {
        return (
          <TouchableOpacity
            key={item.symbol}
            style={styles.rawValueView}
            onPress={() => onPostTickerData(item.symbol)}>
            <Text style={[styles.tickerText, {width: '40%'}]}>
              {item.symbol}
            </Text>
            <Text
              style={[
                styles.tickerText,
                {
                  width: '30%',
                  color:
                    item.priceChangePercent > 0
                      ? COLORS.darkGreen
                      : COLORS.errorColor,
                },
              ]}>
              {item.priceChangePercent}
            </Text>
            <Text style={[styles.tickerText, {width: '30%'}]}>
              {formattedNumber}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity
          style={styles.rawValueView}
          onPress={() => onPostTickerData(item.symbol)}>
          <Text style={[styles.tickerText, {width: '40%'}]}>{item.symbol}</Text>
          <Text
            style={[
              styles.tickerText,
              {
                width: '30%',
                color:
                  item.priceChangePercent > 0
                    ? COLORS.darkGreen
                    : COLORS.errorColor,
              },
            ]}>
            {item.priceChangePercent}
          </Text>
          <Text style={[styles.tickerText, {width: '30%'}]}>
            {formattedNumber}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const onDeleteTickerPopup = async () => {
    try {
      let raw = JSON.stringify({
        ticker: selectedValueDelete,
      });
      const response = await onDeleteTickerDataApi(raw);
      if (response) {
        let raw1 = JSON.stringify({
          ticker: selectedValueDelete,
          currency: 'USDT',
        });
        const response1 = await onDeleteTickerConfigDataApi(raw1);
        setDeletePopup(false);
        let allTicker = [];
        coinDataList.map(item1 => {
          response.tickers_list.map(item => {
            if (item1.symbol === item) {
              allTicker.push(item1);
            }
          });
        });
        setCoinDataList(allTicker);
        setDataActiveSort(allTicker);
        showMessage({
          message: `${selectedValueDelete} Coin Delete Successfully`,
          type: 'success',
          duration: 3000,
        });
      } else {
        setDeletePopup(false);
      }
    } catch (err) {
      setDeletePopup(false);
      showMessage({
        message: err.response.data.detail,
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error:', err.response.data);
    }
  };

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a?.symbol.toLowerCase();
    const stringB = b?.symbol.toLowerCase();

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

  const firstSorting = from => {
    if (from === 'coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
        setCHGSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setAmountSort(0);
        setCHGSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = coinDataList.sort(customSort).reverse();
        setCoinDataList(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = coinDataList.sort(customSort);
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
    } else if (from === 'chg') {
      if (CHG === 2) {
        setCoinSort(0);
        setAmountSort(0);
        setCHGSort(0);
      } else {
        setAmountSort(0);
        setCoinSort(0);
        setCHGSort(CHG + 1);
      }
      if (CHG + 1 === 1) {
        const sortedDates = coinDataList
          .sort((a, b) => a?.priceChangePercent - b?.priceChangePercent)
          .reverse();
        setCoinDataList(sortedDates);
      } else if (CHG + 1 === 2) {
        const sortedDates = coinDataList.sort(
          (a, b) => a?.priceChangePercent - b?.priceChangePercent,
        );
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
    } else if (from === 'price') {
      if (amountSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
        setCHGSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
        setCHGSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = coinDataList
          .sort((a, b) => a.lastPrice - b.lastPrice)
          .reverse();
        setCoinDataList(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = coinDataList.sort(
          (a, b) => a.lastPrice - b.lastPrice,
        );
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
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
      newState[index] = true;
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
            title={'Crypto'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            notificationCount={notificationCount}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <Marquee spacing={0} speed={1}>
              <View style={styles.marqueeView}>
                {marqueeData.map((item, index) => {
                  return (
                    <Text key={index} style={styles.marqueeTagText}>
                      {item.tag}
                    </Text>
                  );
                })}
              </View>
            </Marquee>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => setInviteVisible(true)}>
              <Text style={styles.inviteText}>Invite your friend</Text>
            </TouchableOpacity>
            <View style={{width: '100%'}}>
              <ImageBackground
                style={styles.backImage}
                borderRadius={15}
                source={card5}>
                <Text style={styles.userText}>Hi, {firstName}</Text>

                <Text style={styles.coinText}>
                  {balanceData !== null && balanceData?.availableBalance !== null
                    ? `$ ${parseFloat(balanceData?.availableBalance).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>Balance On Exchange</Text>

                <Text style={styles.coinText}>
                  {balanceData !== null && balanceData?.TodayRealizedPnl !== null
                    ? `$ ${parseFloat(balanceData?.TodayRealizedPnl).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>Today's P/L</Text>

                <Text style={styles.coinText}>
                  {balanceData !== null && balanceData?.crossUnPnl !== null
                    ? `$ ${parseFloat(balanceData?.crossUnPnl).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>Profit/Loss [BOT]</Text>
              </ImageBackground>
            </View>
            <View style={styles.activeView}>
              <View style={styles.titleActiveView}>
                <Text style={styles.titleText1}>Last Leads</Text>
                <TextInput
                  value={search}
                  onChangeText={text => handleSearch(text)}
                  placeholder="Search Coin..."
                  placeholderTextColor={COLORS.greyColor}
                  style={styles.searchText}
                />
              </View>
              <FlatList
                data={filterLead}
                extraData={filterLead}
                nestedScrollEnabled
                initialNumToRender={5000000}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: hp(2),
                  marginTop: hp(1.5),
                  marginBottom: hp(2),
                }}
                keyExtractor={item => item.id}
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
                renderItem={({item, index}) => {
                  return (
                    <TouchableHighlight
                      onShowUnderlay={() => handleShowUnderlay1(index)}
                      activeOpacity={1}
                      onPress={() => console.log('hello')}
                      underlayColor={COLORS.lightWhite}
                      key={item.id}>
                      <View
                        style={[
                          styles.dataActiveView,
                          {
                            backgroundColor: isPressArray1[index]
                              ? COLORS.lightWhite
                              : COLORS.white,
                          },
                        ]}>
                        <View>
                          <Text style={styles.dataText2}>{item.ticker}</Text>
                          <Text style={styles.dataText1}>
                            {moment(item.created_at).format(
                              'hh:mm:ss YYYY-MM-DD',
                            )}
                          </Text>
                        </View>
                        {item.signal !== 'sell' ? (
                          <TouchableHighlight
                            onHideUnderlay={() => handleHideUnderlay(index)}
                            onShowUnderlay={() => handleShowUnderlay(index)}
                            activeOpacity={1}
                            onPress={() => console.log('hello')}
                            underlayColor={'green'}
                            style={[
                              styles.typeButton,
                              {
                                borderColor: COLORS.greenColor,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.dataText,
                                {
                                  color: isPressArray[index]
                                    ? COLORS.white
                                    : COLORS.greenColor,
                                },
                              ]}>
                              {'Buy'}
                            </Text>
                          </TouchableHighlight>
                        ) : (
                          <TouchableHighlight
                            onHideUnderlay={() => handleHideUnderlay(index)}
                            onShowUnderlay={() => handleShowUnderlay(index)}
                            onPress={() => console.log('hello')}
                            activeOpacity={1}
                            underlayColor={'red'}
                            style={[
                              styles.typeButton,
                              {
                                borderColor: COLORS.errorColor,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.dataText,
                                {
                                  color: isPressArray[index]
                                    ? COLORS.white
                                    : COLORS.errorColor,
                                },
                              ]}>
                              {'Sell'}
                            </Text>
                          </TouchableHighlight>
                        )}
                      </View>
                    </TouchableHighlight>
                  );
                }}
              />
            </View>
            <View style={styles.autoAIView}>
              <View style={styles.autoView}>
                <TouchableOpacity
                  style={[
                    styles.autoButton,
                    {
                      backgroundColor: botConfig
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
                  onPress={() => {
                    setBotModalVisible(true);
                    if (autoConfigObject?.leverage) {
                      setCurrentPage(4);
                      setOnFinishStatus(false);
                      setLeverage(JSON.stringify(autoConfigObject?.leverage));
                      setAmount(JSON.stringify(autoConfigObject?.amount));
                      setProfit(JSON.stringify(autoConfigObject?.take_profit));
                      setLoss(JSON.stringify(autoConfigObject?.stoploss));
                      setSellProfit(
                        JSON.stringify(autoConfigObject?.sell_take_profit),
                      );
                      setSellLoss(
                        JSON.stringify(autoConfigObject?.sell_stoploss),
                      );
                      setDailyProfit(
                        JSON.stringify(
                          autoConfigObject?.take_profit_daily_percentage,
                        ),
                      );
                      setDailyLoss(
                        JSON.stringify(
                          autoConfigObject?.take_loss_daily_percentage,
                        ),
                      );
                      setBotConfig(autoConfigObject?.auto_bot_config);
                    }
                  }}>
                  <Text
                    style={[
                      styles.autoText,
                      {
                        color: botConfig ? COLORS.white : COLORS.textColor,
                      },
                    ]}>
                    Auto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.autoButton1,
                    {
                      backgroundColor: botConfig
                        ? COLORS.lightGreyColor
                        : COLORS.greenColor,
                    },
                  ]}
                  onPress={() => setBotManualVisible(true)}>
                  <Text
                    style={[
                      styles.autoText,
                      {
                        color: botConfig ? COLORS.textColor : COLORS.white,
                      },
                    ]}>
                    Manual
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.AIButton,
                  {
                    backgroundColor: AIbotConfig
                      ? COLORS.greenColor
                      : COLORS.lightGreyColor,
                  },
                ]}
                onPress={() => {
                  setAIBotModalVisible(true);
                  if (autoConfigObject?.leverage) {
                    setOnFinishStatus(false);
                    setCurrentPage(4);
                    setLeverage(JSON.stringify(autoConfigObject?.leverage));
                    setAmount(JSON.stringify(autoConfigObject?.amount));
                    setProfit(JSON.stringify(autoConfigObject?.take_profit));
                    setLoss(JSON.stringify(autoConfigObject?.stoploss));
                    setSellProfit(
                      JSON.stringify(autoConfigObject?.sell_take_profit),
                    );
                    setSellLoss(
                      JSON.stringify(autoConfigObject?.sell_stoploss),
                    );
                    setDailyProfit(
                      JSON.stringify(
                        autoConfigObject?.take_profit_daily_percentage,
                      ),
                    );
                    setDailyLoss(
                      JSON.stringify(
                        autoConfigObject?.take_loss_daily_percentage,
                      ),
                    );
                    setAIBotConfig(AISettingObject?.active_ai_bot_trading);
                  }
                }}>
                <Text
                  style={[
                    styles.autoText,
                    {
                      color: AIbotConfig ? COLORS.white : COLORS.textColor,
                    },
                  ]}>
                  AI
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={search1}
              onChangeText={text => handleSearch1(text)}
              placeholder="Search Your Coin..."
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              onFocus={() => setTickerValueVisible(true)}
              onBlur={() => setTickerValueVisible(false)}
              autoCapitalize="none"
            />
            {tickerValueVisible ? (
              <View style={styles.tickerSearchView}>
                <FlatList
                  data={filterTickerData}
                  nestedScrollEnabled
                  renderItem={renderItem}
                  keyboardShouldPersistTaps={'always'}
                  keyExtractor={item => item.symbol}
                />
              </View>
            ) : null}
            <View style={styles.activeView1}>
              <ScrollView
                horizontal
                nestedScrollEnabled={true}
                contentContainerStyle={{paddingBottom: hp(1)}}
                showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView1}>
                    <TouchableOpacity
                      onPress={() => firstSorting('coin')}
                      style={[
                        styles.optionTitleView,
                        {
                          width: wp(30),
                          justifyContent: 'flex-start',
                          marginLeft: wp(4),
                        },
                      ]}>
                      <Text
                        style={
                          styles.titleText4
                        }>{`COIN [${coinDataList.length}/${coinLength}]`}</Text>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('chg')}
                      style={[styles.optionTitleView, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>CHG%</Text>
                      {CHG === 0 || CHG === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {CHG === 0 || CHG === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('price')}
                      style={[styles.optionTitleView, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>PRICE</Text>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.titleText3,
                        {width: wp(25), marginLeft: wp(7)},
                      ]}>
                      BOT STATUS
                    </Text>
                  </View>
                  <FlatList
                    data={coinDataList}
                    extraData={coinDataList}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: hp(2)}}
                    initialNumToRender={1000}
                    keyExtractor={item => item.symbol}
                    ListEmptyComponent={() => (
                      <>
                      {balanceData != null ? (
                          <View style={{marginVertical: hp(2)}}>
                            <View style={styles.dataFoundView}>
                              <Text style={styles.dataFoundText}>
                                No Records Available
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View style={{marginVertical: hp(2)}}>
                            <View style={styles.dataFoundView}>
                              <Text style={styles.dataFoundText}>
                                No active Package Found Please Buy Package and try again...
                              </Text>
                            </View>
                          </View>
                        )}
                    </>
                    )}
                    renderItem={({item, index}) => {
                      const originalNumber = parseFloat(item?.lastPrice);
                      const formattedNumber = originalNumber
                        .toFixed(10)
                        .replace(/\.?0*$/, '');
                      return (
                        <>
                          {isSkeletonVisible ? (
                            <SkeletonPlaceholderComponent />
                          ) : (
                            <TouchableOpacity
                              key={item.symbol}
                              onPress={() => {
                                if (!item?.is_active) {
                                  setSelectedValueDelete(item.symbol);
                                  setDeletePopup(true);
                                } else {
                                  showMessage({
                                    message: `Can't Delete Coin While Bot Is Active`,
                                    type: 'warning',
                                    duration: 3000,
                                    icon: 'warning',
                                  });
                                }
                              }}
                              style={[
                                styles.dataActiveView1,
                                {
                                  backgroundColor:
                                    index % 2 === 0
                                      ? COLORS.white
                                      : COLORS.lightPrimary3,
                                  borderBottomWidth:
                                    coinDataList.length == index + 1 ? 0 : 1,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.dataText3,
                                  {
                                    width: wp(30),
                                    textAlign: 'left',
                                    marginLeft: wp(4),
                                  },
                                ]}>
                                {item.symbol}
                              </Text>
                              <Text
                                style={[
                                  styles.dataText3,
                                  {
                                    width: wp(24),
                                    color:
                                      item.priceChangePercent > 0
                                        ? COLORS.darkGreen
                                        : COLORS.errorColor,
                                  },
                                ]}>
                                {item.priceChangePercent}
                              </Text>
                              <Text style={[styles.dataText3, {width: wp(24)}]}>
                                {formattedNumber != 'NaN' ? formattedNumber : ''}
                              </Text>
                              <View style={styles.statusView}>
                                <TouchableOpacity
                                  style={[
                                    styles.statusButton,
                                    {
                                      backgroundColor: item?.is_active
                                        ? COLORS.greenColor
                                        : COLORS.errorColor,
                                    },
                                  ]}
                                  onPress={() => {
                                    if (item?.leverage) {
                                      setLeverage1(
                                        JSON.stringify(item?.leverage),
                                      );
                                      setAmount1(JSON.stringify(item?.amount));
                                      setProfit1(
                                        JSON.stringify(item?.take_profit),
                                      );
                                      setLoss1(JSON.stringify(item?.stoploss));
                                      setSellProfit1(
                                        JSON.stringify(item?.sell_take_profit),
                                      );
                                      setSellLoss1(
                                        JSON.stringify(item?.sell_stoploss),
                                      );
                                      setBotConfig1(item?.is_active);
                                      setCurrentPage1(4);
                                      if (item?.stretegy == 'buy-on-signal') {
                                        setBuyOnly(true);
                                        setSellOnly(false);
                                        setBuySellMode(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy == 'sell-on-signal'
                                      ) {
                                        setSellOnly(true);
                                        setBuyOnly(false);
                                        setBuySellMode(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy ===
                                        'buy-or-sell-on-signal'
                                      ) {
                                        setBuySellMode(true);
                                        setBuyOnly(false);
                                        setSellOnly(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy == 'reverse-trade'
                                      ) {
                                        setReverseMode(true);
                                        setBuySellMode(false);
                                        setBuyOnly(false);
                                        setSellOnly(false);
                                      }
                                    }
                                    setSelectedValueDelete(item.symbol);
                                    setCoinModalVisible(true);
                                  }}>
                                  <Text
                                    style={[
                                      styles.searchText2,
                                      {color: COLORS.white},
                                    ]}>
                                    {item?.is_active ? 'NO' : 'OFF'}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <InvitePopup
        modelVisible={inviteVisible}
        setModelVisible={setInviteVisible}
        link={`https://indicatorleads.com/login?referralId=${referal}`}
        onPress={() => onLinkCopy()}
      />
      <BotSettingPopup
        modalVisible={botModalVisible}
        setModalVisible={setBotModalVisible}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        leverage={leverage}
        setLeverage={text => setLeverage(text)}
        amount={amount}
        setAmount={text => setAmount(text)}
        profit={profit}
        setProfit={text => setProfit(text)}
        loss={loss}
        setLoss={text => setLoss(text)}
        sellProfit={sellProfit}
        setSellProfit={text => setSellProfit(text)}
        sellLoss={sellLoss}
        setSellLoss={text => setSellLoss(text)}
        dailyLoss={dailyLoss}
        setDailyLoss={text => setDailyLoss(text)}
        dailyProfit={dailyProfit}
        setDailyProfit={text => setDailyProfit(text)}
        botConfig={botConfig}
        setBotConfig={text => setBotConfig(text)}
        onPress={() => onPostAutoManualData()}
        onFinishStatus={onFinishStatus}
      />
      <AIBotSettingPopup
        modalVisible={AIbotModalVisible}
        setModalVisible={setAIBotModalVisible}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        leverage={leverage}
        setLeverage={text => setLeverage(text)}
        amount={amount}
        setAmount={text => setAmount(text)}
        profit={profit}
        setProfit={text => setProfit(text)}
        loss={loss}
        setLoss={text => setLoss(text)}
        sellProfit={sellProfit}
        setSellProfit={text => setSellProfit(text)}
        sellLoss={sellLoss}
        setSellLoss={text => setSellLoss(text)}
        dailyLoss={dailyLoss}
        setDailyLoss={text => setDailyLoss(text)}
        dailyProfit={dailyProfit}
        setDailyProfit={text => setDailyProfit(text)}
        botConfig={AIbotConfig}
        setBotConfig={text => setAIBotConfig(text)}
        onPress={() => onPostSettingData()}
        onFinishStatus={onFinishStatus}
      />
      <CoinSettingPopup
        modalVisible={coinModalVisible}
        selectedValueDelete={selectedValueDelete}
        setModalVisible={setCoinModalVisible}
        currentPage={currentPage1}
        setCurrentPage={setCurrentPage1}
        leverage={leverage1}
        setLeverage={text => setLeverage1(text)}
        amount={amount1}
        setAmount={text => setAmount1(text)}
        profit={profit1}
        setProfit={text => setProfit1(text)}
        loss={loss1}
        setLoss={text => setLoss1(text)}
        sellProfit={sellProfit1}
        setSellProfit={text => setSellProfit1(text)}
        sellLoss={sellLoss1}
        setSellLoss={text => setSellLoss1(text)}
        buyOnly={buyOnly}
        setBuyOnly={setBuyOnly}
        sellOnly={sellOnly}
        setSellOnly={setSellOnly}
        buySellMode={buySellMode}
        setBuySellMode={setBuySellMode}
        reverseMode={reverseMode}
        setReverseMode={setReverseMode}
        botConfig={botConfig1}
        setBotConfig={text => setBotConfig1(text)}
        onPress={() => onPostTickerAddData()}
      />
      <CommonPopup
        modelVisible={deletePopup}
        setModelVisible={setDeletePopup}
        title={`Are You Sure You Want To Delete ${selectedValueDelete} Coin?`}
        firstButtonTitle={'CENCEL'}
        secondButtonTitle={'DELETE'}
        firstButtonClick={() => setDeletePopup(false)}
        secondButtonClick={() => onDeleteTickerPopup()}
      />

      <BotManualPopup
        modalVisible={botManualVisible}
        setModalVisible={setBotManualVisible}
        dailyLoss={dailyLoss}
        setDailyLoss={text => setDailyLoss(text)}
        dailyProfit={dailyProfit}
        setDailyProfit={text => setDailyProfit(text)}
        botConfig={botConfig}
        setBotConfig={text => setBotConfig(text)}
        onPress={() => onPostAutoManualData()}
      />
    </View>
  );
};

export default HomeScreen;
