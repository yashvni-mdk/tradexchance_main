import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
  },
  mainView: {
    flex: 0.9,
    width: '100%',
    // backgroundColor: COLORS.white,
    paddingHorizontal: wp(3),
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  accountText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.apiError,
  },
  firstView: {
    width: '100%',
    height: hp(11),
    borderRadius: hp(2),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    marginVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(2),
  },
  profileImage: {
    width: wp(18),
    height: hp(8),
    borderRadius: 10,
  },
  activeText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  joinDate: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  profileData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRound: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(14),
  },
  nextImage: {
    width: wp(7),
    height: hp(5),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  nextImage1: {
    width: wp(6),
    height: hp(5),
    resizeMode: 'contain',
    marginLeft: wp(2),
  },
  nextImage2: {
    width: wp(5),
    height: hp(3),
    resizeMode: 'contain',
    marginLeft: wp(2),
  },
  optionView: {
    width: '98%',
    height: hp(7.5),
    borderRadius: hp(2),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  activeText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginLeft: wp(3),
  },
  logoutButton1: {
    width: wp(25),
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 5,
    alignSelf: 'center',
  },
  logoutText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
  },
});

export default styles;
