import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

export default class Api {
  static baseUrl1 = Config.BASE_URL;
}

export const sendPushNotification = async (token, title, body, sound) => {
  const FIREBASE_API_KEY = Config.FIREBASE_API_KEY;

  const message = {
    registration_ids: [token],
    notification: {
      title: title,
      body: body,
      vibrate: 1,
      sound: sound,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });
  console.log("Get Respomse Notification:::::", JSON.stringify(message));
  let response = await fetch(Config.NOTIFICATION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  // console.log("=><*", response);
  response = await response.json();
  //  console.log("=><*", response);
};

export const onLoginApi = async requestData => {
  const url = Api.baseUrl1 + 'auth/login/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onRegistrationApi = async requestData => {
  const url = Api.baseUrl1 + 'auth/register/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onForgotPasswordApi = async requestData => {
  const url = Api.baseUrl1 + 'auth/forgot-password/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetProfileApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/profile/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateProfileApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/profile/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBalanceApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Token>>', token);
  const url = Api.baseUrl1 + 'customer/bot-trading/account-details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetHistoryDetailApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetExtraHistoryApi = async url => {
  const token = await AsyncStorage.getItem('accessToken');
  // const url = Api.baseUrl1 + `customer/bot-trading/history-trade-detail/`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMarqueeApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/context/marquee-tag/?page_for=crypto&is_active=True';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetLastLeadApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/latest/last-lead/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBotLastLeadApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/latest/custom/last-lead/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAutoManualDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/crypto-default-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAutoManualDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/crypto-default-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMarketSentiDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/context/market-sentimate/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAnalyticsDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/context/analytics/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPackageDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/packages/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActivePackageDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/packages/active-details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPaymentDetailsDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/future-tickers/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCryptoTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBotStickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBinanceDataApi = async () => {
  const url = 'https://api.binance.com/api/v3/ticker/24hr';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTickerConfigDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActiveBotStausApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActivePMSApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/pms-active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPMSHistoryDetailApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/pms-history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFuturePriceApi = async () => {
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/futureprice-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPercentStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/percent-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFavoriteStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostFavoriteStatusApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostNotificationStatusApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/trends-notiication-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetNotificationStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/trends-notiication-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteFavoriteDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteNotificationDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'customer/bot-trading/trends-notiication-ai-bot-status/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPlanCoinApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/ticker-payment-accept/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetIndicatortBotApi = async () => {
  const url = Api.baseUrl1 + 'super-admin/bot-trading/indicator-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSentimentApi = async () => {
  const url = Api.baseUrl1 + 'super-admin/bot-trading/sentiment-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetvolumePathApi = async () => {
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/crypto-thirty-day-volume/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAIDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAIDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostGenerateInvoiceApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/generate-invoice/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMenuApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/menu-injection/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSplashLogoApi = async () => {
  const url = Api.baseUrl1 + 'unauth/context/company-drawer/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetNotificationListApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/notifications/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostNotificationListApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/dashboard/notifications/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
