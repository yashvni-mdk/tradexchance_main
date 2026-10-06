import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {COLORS, Fonts} from '../../utils';
import pic1 from '../../images/pic1.jpg';
import {hasNotch} from 'react-native-device-info';
import {onUpdateProfileApi} from '../../services/Api';
import ImagePicker from 'react-native-image-crop-picker';
import copy from '../../images/copy.png';
import Clipboard from '@react-native-clipboard/clipboard';
import CountryPicker from 'react-native-country-picker-modal';
import SubHeader from '../../components/SubHeader';
import {LogoutPopup} from '../../components/LogoutPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataSuccess} from '../../redux/reducer';
import {PlanExpirePopup} from '../../components/PlanExpirePopup';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user_data = useSelector(state => state.user_data);
  const balanceData = useSelector(state => state.balanceData);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [country, setCountry] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [binanceApi, setBinanceApi] = useState('');
  const [binanceKey, setBinanceKey] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [referal, setReferal] = useState('');
  const [referalCopy, setReferalCopy] = useState(false);
  const [binanceCopy, setBinanceCopy] = useState(false);
  const [binanceApiCopy, setBinanceApiCopy] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [planExpire, setPlanExpire] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const onSelect = country => {
    console.log('Get Selected Country', country);
    setCountryCode(country.callingCode[0]);
    setCountry(country);
  };
  //   const handleCountryPicker = () => {
  //     setCountryPickerVisibility(true); // Open the CountryPicker when the dropDownContainer is pressed
  // };

  // const handleCountrySelect = (country) => {
  //   console.log("Get Value::", country);
  //     setSelectedCountry(country.name); // Set the selected country in state
  //     setCountryPickerVisibility(false); // Close the CountryPicker
  // };

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      // const response = await onGetProfileApi();
      // console.log('Get PRofile Data::', response.data);
      if (user_data?.avatar) {
        let url = `https://signal.indicatorleads.com${user_data?.avatar}`;
        const filename = url.substring(url.lastIndexOf('/') + 1);
        const fileExtension = url.substring(url.lastIndexOf('.') + 1);
        const mimeTypes = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          // Add more mappings as needed
        };

        let mimeType = mimeTypes[fileExtension.toLowerCase()];
        let avatarObject = {
          uri: url,
          name: filename,
          type: mimeType,
        };
        setAvatar(avatarObject);
      }
      if (user_data?.binance_api) {
        const firstFour = user_data?.binance_api.substring(0, 4);
        const lastFour = user_data?.binance_api.substring(
          user_data?.binance_api.length - 4,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_api.length - 8); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceApi(maskedString);
      }
      if (user_data?.binance_secret_key) {
        const firstFour = user_data?.binance_secret_key.substring(0, 4);
        const lastFour = user_data?.binance_secret_key.substring(
          user_data?.binance_secret_key.length - 4,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_secret_key.length - 8); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceKey(maskedString);
      }
      if (user_data?.contact_number != null) {
        setMobileNumber(user_data?.contact_number);
      }
      if (user_data?.dial_code) {
        setCountryCode(user_data?.dial_code);
      }
      if (user_data?.email) {
        setEmail(user_data?.email);
      }
      if (user_data?.first_name) {
        setFirstName(user_data?.first_name);
      }
      if (user_data?.last_name) {
        setLastName(user_data?.last_name);
      }
      if (user_data?.referal_code) {
        setReferal(user_data?.referal_code);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const openProfileImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        multiple: false, // Allow selecting only one image
        compressImageQuality: 0.5,
      });

      if (image && image.path) {
        if (image && image.path) {
          var filename = image.path.substring(image.path.lastIndexOf('/') + 1);
          let imageData = {
            uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
            type: image.mime,
            name: Platform.OS === 'ios' ? image.filename : filename,
          };
          setAvatar(imageData);

          console.log('Selected image:', avatar);
        }
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const onUpdateData = async () => {
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('binance_api', binanceApi);
      formData.append('binance_secret_key', binanceKey);
      formData.append('dial_code', countryCode);
      formData.append('contact_number', mobileNumber);
      if (avatar && avatar?.uri) {
        formData.append('avatar', avatar);
      }
      const response = await onUpdateProfileApi(formData);
      if (response.status === 201) {
        dispatch(fetchUserDataSuccess(response.data));
        setButtonVisible(false);
        showMessage({
          message: 'Profile Data Update Successfully!',
          type: 'success',
          duration: 3000,
        });
      } else {
        showMessage({
          message: 'Successfully Copied!',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
        console.log('Error:das', response.data);
      }
    } catch (err) {
      if (err.response.status == 413) {
        showMessage({
          message: 'Image size is to large please select small image.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something is wrong please try again.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      console.log('Error:', err.response);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: hasNotch() ? hp(5) : 0,
            backgroundColor: COLORS.white,
          }}
        />
        <View style={styles.headerView}>
          {/* <SubHeader title={'Profile'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={'Profile'}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            backVisible={true}
            notificationCount={notificationCount}
            onPress={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle ={{paddingBottom: hp(10)}}>
            <View style={styles.firstView}>
              {avatar && avatar.uri ? (
                <Image source={{uri: avatar.uri}} style={styles.profileRound} />
              ) : (
                <Image source={pic1} style={styles.profileImage} />
              )}
              <View
                style={{
                  marginVertical: hp(2),
                  width: '75%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: hp(8),
                }}>
                <Text
                  style={styles.linkText}
                  onPress={() => {
                    setReferalCopy(true);
                    Clipboard.setString(
                      `https://indicatorleads.com/login?referralId=${referal}`,
                    );
                    showMessage({
                      message: 'Successfully Copied!',
                      type: 'success',
                      duration: 3000,
                    });
                  }}>
                  {`https://indicatorleads.com/login?referralId=${referal}  `}
                  {referal != '' && (
                    <TouchableOpacity
                      onPress={() => {
                        setReferalCopy(true);
                        Clipboard.setString(
                          `https://indicatorleads.com/login?referralId=${referal}`,
                        );
                        showMessage({
                          message: 'Successfully Copied!',
                          type: 'success',
                          duration: 3000,
                        });
                      }}>
                      <Image
                        source={copy}
                        style={{
                          height: hp(2),
                          width: wp(4),
                          resizeMode: 'contain',
                          tintColor: referalCopy
                            ? COLORS.greenColor
                            : COLORS.white,
                          marginTop: hp(2),
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </Text>
              </View>
              <Text style={styles.activeText}>Active</Text>
              <Text style={styles.joinDate}> Joined: 2023-03-15 13:02:29 </Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.logoutText}> Logout</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.secondView}>
              <Text style={styles.updateProfileText}>Update Profile</Text>
              <View style={styles.browserView}>
                {avatar && avatar.uri ? (
                  <Image
                    source={{uri: avatar.uri}}
                    style={styles.profileRound}
                  />
                ) : (
                  <Image source={pic1} style={styles.profileRound} />
                )}
                <TouchableOpacity
                  onPress={() => openProfileImagePicker()}
                  style={[
                    styles.browseButton,
                    {opacity: buttonVisible ? 1 : 0.5},
                  ]}
                  disabled={!buttonVisible}>
                  <Text style={styles.browseText}>Browse</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.emailPlaceHolder}>First Name</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <Text style={styles.emailPlaceHolder}>Last Name</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <Text style={styles.emailPlaceHolder}>Email Address</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  editable={false}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>Binance API</Text>
              <Text style={styles.browseText1}>
                {'[Please Enter IP 213.199.48.54]'}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setBinanceCopy(true);
                    Clipboard.setString(`213.199.48.54`);
                  }}>
                  {binanceCopy ? (
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        color: COLORS.greenColor,
                        fontFamily: Fonts.FONTS.PoppinsSemiBold,
                        // marginTop: hp(2.5),
                        marginLeft: wp(2),
                      }}>
                      Copied!
                    </Text>
                  ) : (
                    <Image
                      source={copy}
                      style={{
                        height: hp(2),
                        width: wp(4),
                        resizeMode: 'contain',
                        tintColor: COLORS.black,
                        // marginTop: hp(2.5),
                        marginLeft: wp(2),
                      }}
                    />
                  )}
                </TouchableOpacity>
              </Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={binanceApi}
                  onChangeText={text => {
                    setBinanceApi(text);
                  }}
                  numberOfLines={1}
                  editable={buttonVisible}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>Binance Secret key</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={binanceKey}
                  onChangeText={text => {
                    setBinanceKey(text);
                  }}
                  numberOfLines={1}
                  editable={buttonVisible}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>Country code</Text>
              <View style={styles.textInputView}>
                <TouchableOpacity
                  disabled={!buttonVisible}
                  onPress={() =>
                    setCountryPickerVisibility(!isCountryPickerVisible)
                  }>
                  <Text style={styles.textInput}>
                    {`${countryCode}` || 'Select Country'}
                  </Text>
                </TouchableOpacity>
                {/* <TextInput
                  value={countryCode}
                  keyboardType={'number-pad'}
                  onChangeText={text => {
                    setCountryCode(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                /> */}
                {isCountryPickerVisible && ( // Render CountryPicker conditionally based on isCountryPickerVisible
                  <CountryPicker
                    visible={isCountryPickerVisible}
                    onClose={() => setCountryPickerVisibility(false)}
                    onSelect={onSelect}
                    withCloseButton
                    withCallingCode
                    withFilter
                    containerButtonStyle={{backgroundColor: COLORS.white}}
                  />
                )}
              </View>
              <Text style={styles.emailPlaceHolder}>Mobile number</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={mobileNumber}
                  onChangeText={text => {
                    setMobileNumber(text);
                  }}
                  keyboardType={'number-pad'}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.EditView}>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: !buttonVisible
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
                  onPress={() => {
                    balanceData != null
                      ? setButtonVisible(true)
                      : setPlanExpire(true);
                  }}
                  disabled={buttonVisible}>
                  <Text
                    style={[
                      styles.editText,
                      {color: !buttonVisible ? COLORS.white : COLORS.iconColor},
                    ]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onUpdateData()}
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: buttonVisible
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
                  disabled={!buttonVisible}>
                  <Text
                    style={[
                      styles.editText,
                      {color: buttonVisible ? COLORS.white : COLORS.iconColor},
                    ]}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => {
          AsyncStorage.setItem('accessToken', '');
          AsyncStorage.setItem('refreshToken', '');
          AsyncStorage.setItem('selectedScreen', '');
          AsyncStorage.setItem('Notify', '');
          navigation.replace('LoginScreen');
        }}
      />
      <PlanExpirePopup
        modelVisible={planExpire}
        setModelVisible={setPlanExpire}
        title={`To Edit Your Profile Please Purchase A Plan`}
        firstButtonTitle={'CENCEL'}
        firstButtonClick={() => setPlanExpire(false)}
      />
    </View>
  );
};

export default ProfileScreen;
