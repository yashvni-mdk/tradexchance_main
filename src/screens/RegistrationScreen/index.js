import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import view from '../../images/view.png';
import hidden from '../../images/hidden.png';
import logo from '../../images/logo.png';
import {onRegistrationApi} from '../../services/Api';
import {ErrorComponent} from '../../components/ErrorComponent';
import {COLORS} from '../../utils';

const RegistrationScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = password => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onRegistrationData = async () => {
    if (email === '') {
      setErrorMessage('Email address is required.');
      setEmailError(true);
    } else if (password === '') {
      setErrorMessage('Password is required.');
      setPasswordError(true);
    } else if (!isPasswordValid(password)) {
      setPasswordError(true);
      setErrorMessage(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      );
    } else {
      try {
        setIsLoading(true);
        let raw = JSON.stringify({
          email: email,
          password: password,
        });

        const response = await onRegistrationApi(raw);
        console.log('get Repsonse>>', response.data);
        if (response.status === 200) {
          setIsLoading(false);
          navigation.navigate('LoginScreen');
        } else {
          setApiError(true);
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        console.log('error::', error.response.data['password']);
        if (error.response.data['email'] !== undefined) {
          setErrorMessage(error.response.data['email'][0]);
          setEmailError(true);
          setIsLoading(false);
        } else if (error.response.data['password'] !== undefined) {
          setErrorMessage(error.response.data['password'][0]);
          setPasswordError(true);
          setIsLoading(false);
        } else {
          setApiError(true);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.safeAreaStyle}>
      <View style={styles.container}>
        <Image style={styles.logoImage} source={logo} />
        <Text style={styles.textStyle}>Sign up your account</Text>
        {apiError && (
          <View style={styles.mainView}>
            <ErrorComponent errorMessage={'Invalid Credentials'} />
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
          {emailError && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Text style={styles.emailPlaceHolder}>Password</Text>
          <View
            style={[
              styles.textInputView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                if (passwordError) {
                  if (isPasswordValid(text)) {
                    setPassword(text);
                    setPasswordError(false);
                    setApiError(false);
                  } else {
                    setPassword(text);
                    setApiError(false);
                  }
                } else {
                  setPassword(text);
                  setApiError(false);
                  setPasswordError(false);
                }
              }}
              placeholderTextColor={COLORS.greyColor}
              placeholder="******"
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
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={[styles.buttonView, {opacity: isLoading ? 0.75 : 1}]}
            onPress={() => onRegistrationData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>Sign Me Up</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.haveAnAccount}>
            {'Already have an account ? '}
            <Text
              style={styles.signUpText}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationScreen;
