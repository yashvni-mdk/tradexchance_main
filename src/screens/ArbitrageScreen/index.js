import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
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
import SubHeader from '../../components/SubHeader';

const ArbitrageScreen = ({navigation}) => {
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
          <SubHeader title={'Arbitrage'} onPress={() => navigation.goBack()} />
          {/* <Header
            title={'Arbitrage'}
            notificationPress={() => navigation.navigate('NotificationScreen')}
            onPress={() => navigation.openDrawer()}
          /> */}
        </View>
        <View style={styles.mainView}>
          <Text style={styles.titleHeader}>Arbitrage Coming Soon</Text>
        </View>
      </View>
    </View>
  );
};

export default ArbitrageScreen;
