export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA-SUCCESS';
export const FETCH_BALANCE_DATA_SUCCESS = 'FETCH_BALANCE_DATA_SUCCESS';
export const FETCH_SETTING_DATA = 'FETCH_SETTING_DATA';
export const FETCH_MARQUEE_DATA = 'FETCH_MARQUEE_DATA';
export const FETCH_LAST_LEAD_DATA = 'FETCH_LAST_LEAD_DATA';
export const FETCH_AUTOMANUAL_DATA = 'FETCH_AUTOMANUAL_DATA';
export const FETCH_TICKER_DATA = 'FETCH_TICKER_DATA';
export const FETCH_BINANCE_DATA = 'FETCH_BINANCE_DATA';
export const FETCH_FAVORITE_DATA = 'FETCH_FAVORITE_DATA';
export const FETCH_NOTIFICATION_DATA = 'FETCH_NOTIFICATION_DATA';
export const FETCH_FUTURE_PRICE_DATA = 'FETCH_FUTURE_PRICE_DATA';
export const FETCH_PERCENTAGE_STATUS_DATA = 'FETCH_PERCENTAGE_STATUS_DATA';
export const FETCH_ANALYTICS_COIN_DATA = 'FETCH_ANALYTICS_COIN_DATA';
export const FETCH_BOT_LAST_LEAD_DATA = 'FETCH_BOT_LAST_LEAD_DATA';
export const PRICE_PREDICATION_DATA = 'PRICE_PREDICATION_DATA';
export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';
export const GET_MENU_LIST = 'GET_MENU_LIST';
export const GET_NOTIFICATION_LIST = 'GET_NOTIFICATION_LIST';

export const fetchUserDataSuccess = user_data => {
  return {
    type: FETCH_USER_DATA_SUCCESS,
    payload: user_data,
  };
};

export const fetchBalance = balanceData => {
  return {
    type: FETCH_BALANCE_DATA_SUCCESS,
    payload: balanceData,
  };
};

export const fetchSttingData = settingData => {
  return {
    type: FETCH_SETTING_DATA,
    payload: settingData,
  };
};

export const fetchMarqueeData = marqueeData => {
  return {
    type: FETCH_MARQUEE_DATA,
    payload: marqueeData,
  };
};

export const fetchLastLeadData = lastLeadData => {
  return {
    type: FETCH_LAST_LEAD_DATA,
    payload: lastLeadData,
  };
};

export const fetchAutoManualData = autoManualData => {
  return {
    type: FETCH_AUTOMANUAL_DATA,
    payload: autoManualData,
  };
};

export const fetchTickerData = tickerData => {
  return {
    type: FETCH_TICKER_DATA,
    payload: tickerData,
  };
};

export const fetchBinanceData = tickerData => {
  return {
    type: FETCH_BINANCE_DATA,
    payload: tickerData,
  };
};

export const fetchFavoriteData = favoriteData => {
  return {
    type: FETCH_FAVORITE_DATA,
    payload: favoriteData,
  };
};

export const fetchNotificationData = notificationData => {
  return {
    type: FETCH_NOTIFICATION_DATA,
    payload: notificationData,
  };
};

export const fetchFuturePriceData = futurePriceData => {
  return {
    type: FETCH_FUTURE_PRICE_DATA,
    payload: futurePriceData,
  };
};

export const fetchPercentageStatusData = percentageStatusData => {
  return {
    type: FETCH_PERCENTAGE_STATUS_DATA,
    payload: percentageStatusData,
  };
};

export const fetchAnalyticsData = analyticsCoinData => {
  return {
    type: FETCH_ANALYTICS_COIN_DATA,
    payload: analyticsCoinData,
  };
};

export const fetchBotLeadData = botLastLeadData => {
  return {
    type: FETCH_BOT_LAST_LEAD_DATA,
    payload: botLastLeadData,
  };
};

export const fetchPricePredicationData = pricePredicationData => {
  return {
    type: PRICE_PREDICATION_DATA,
    payload: pricePredicationData,
  };
};

export const fetchNotificationCount = notificationCount => {
  return {
    type: NOTIFICATION_COUNT,
    payload: notificationCount,
  };
};

export const fetchMenuList = getMenuList => {
  return {
    type: GET_MENU_LIST,
    payload: getMenuList,
  };
};

export const fetchNotificationList = getNotificationList => {
  return {
    type: GET_NOTIFICATION_LIST,
    payload: getNotificationList,
  };
};

// Initial State
const initialState = {
  user_data: null,
  balanceData: null,
  settingData: null,
  marqueeData: [],
  lastLeadData: [],
  autoManualData: null,
  tickerData: [],
  binanceData: [],
  favoriteData: [],
  notificationData: [],
  futurePriceData: [],
  percentageStatusData: [],
  analyticsCoinData: [],
  botLastLeadData: [],
  pricePredicationData: [],
  notificationCount: 0,
  getMenuList: [],
  getNotificationList: [],
};

// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        user_data: action.payload,
      };
    case FETCH_BALANCE_DATA_SUCCESS:
      return {
        ...state,
        balanceData: action.payload,
      };
    case FETCH_SETTING_DATA:
      return {
        ...state,
        settingData: action.payload,
      };
    case FETCH_MARQUEE_DATA:
      return {
        ...state,
        marqueeData: action.payload,
      };
    case FETCH_LAST_LEAD_DATA:
      return {
        ...state,
        lastLeadData: action.payload,
      };
    case FETCH_AUTOMANUAL_DATA:
      return {
        ...state,
        autoManualData: action.payload,
      };
    case FETCH_TICKER_DATA:
      return {
        ...state,
        tickerData: action.payload,
      };
    case FETCH_BINANCE_DATA:
      return {
        ...state,
        binanceData: action.payload,
      };
    case FETCH_FAVORITE_DATA:
      return {
        ...state,
        favoriteData: action.payload,
      };
    case FETCH_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
    case FETCH_FUTURE_PRICE_DATA:
      return {
        ...state,
        futurePriceData: action.payload,
      };
    case FETCH_PERCENTAGE_STATUS_DATA:
      return {
        ...state,
        percentageStatusData: action.payload,
      };
    case FETCH_ANALYTICS_COIN_DATA:
      return {
        ...state,
        analyticsCoinData: action.payload,
      };
    case FETCH_BOT_LAST_LEAD_DATA:
      return {
        ...state,
        botLastLeadData: action.payload,
      };
    case PRICE_PREDICATION_DATA:
      return {
        ...state,
        pricePredicationData: action.payload,
      };
    case NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.payload,
      };
    case GET_MENU_LIST:
      return {
        ...state,
        getMenuList: action.payload,
      };
    case GET_NOTIFICATION_LIST:
      return {
        ...state,
        getNotificationList: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
