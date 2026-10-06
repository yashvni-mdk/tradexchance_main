import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import view from '../../images/view.png';
import hidden from '../../images/hidden.png';
import logo from '../../images/logo.png';
import {onLoginApi, onPostAIDataApi} from '../../services/Api';
import {ErrorComponent} from '../../components/ErrorComponent';
import {COLORS} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  const onLoginData = async () => {
    if (email === '') {
      setEmailError(true);
    } else if (password === '') {
      setPasswordError(true);
    } else {
      try {
        setIsLoading(true);
        let raw = JSON.stringify({
          email: email,
          password: password,
        });

        const response = await onLoginApi(raw);
        if (response.status === 200) {
          setIsLoading(false);
          console.log('get Repsonse>>', response.data.access);
          AsyncStorage.setItem('accessToken', response.data.access);
          AsyncStorage.setItem('refreshToken', response.data.refresh);
          // onAllDataGet();
          if (Platform.OS == 'android') {
            const fcmToken = await messaging().getToken();
            try {
              let raw = JSON.stringify({
                firewall_token: fcmToken,
              });
              const response = await onPostAIDataApi(raw);
            } catch (err) {
              console.log('Get FCM TOKEN:::', err);
            }
          }
          navigation.replace('LoadingScreen');
        } else {
          setApiError(true);
          setApiErrorMessage('Invalid Credentials');
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        console.log('error::', error.response.data.detail);
        if (
          error.response.data.detail ==
          'No active account found with the given credentials'
        ) {
          setApiError(true);
          setApiErrorMessage('Invalid Credentials');
          setIsLoading(false);
        } else {
          setApiError(true);
          setApiErrorMessage('Server Issue: Please try again later.');
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.safeAreaStyle}>
      <View style={styles.container}>
        <Image style={styles.logoImage} source={logo} />
        <Text style={styles.textStyle}>Login</Text>
        {apiError && (
          <View style={styles.mainView}>
            <ErrorComponent errorMessage={apiErrorMessage} />
          </View>
        )}
        <View style={styles.mainView}>
          <Text style={styles.emailPlaceHolder}>Email Address</Text>
          <View style={styles.textInputView}>
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError(false);
                setApiError(false);
              }}
              placeholder="hello@example.com"
              placeholderTextColor={COLORS.greyColor}
              style={styles.textInput}
              autoCapitalize="none"
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>
              {'Please first enter email address.'}
            </Text>
          )}

          <Text style={styles.emailPlaceHolder}>Password</Text>
          <View
            style={[
              styles.textInputView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError(false);
                setApiError(false);
              }}
              placeholder="******"
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {width: '83%'}]}
              autoCapitalize="none"
              secureTextEntry={passwordVisible}
            />
            <TouchableOpacity
              style={{width: '9%'}}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}>
              {passwordVisible ? (
                <Image style={styles.eyeIcon} source={hidden} />
              ) : (
                <Image style={styles.eyeIcon} source={view} />
              )}
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={styles.errorText}>
              {'Please first enter password.'}
            </Text>
          )}
          {/* <View style={styles.forgotView}> */}
          <Text
            style={styles.forgotPassword}
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}>
            Forget password
          </Text>
          {/* </View> */}

          <TouchableOpacity
            style={[styles.buttonView, {opacity: isLoading ? 0.75 : 1}]}
            onPress={() => onLoginData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>Sign Me In</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.haveAnAccount}>
            {'Do not have an account? '}
            <Text
              style={styles.signUpText}
              onPress={() => {
                navigation.navigate('RegistrationScreen');
              }}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
