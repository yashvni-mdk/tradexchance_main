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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  dataActiveView: {
    width: wp(100),
    height: hp(8.5),
    // flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    // alignItems: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: COLORS.lightPrimary,
    // borderRadius: wp(2),
    // marginBottom: hp(1),
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.white,
  },
  verticalView: {
    // height: hp(6),
    // justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
  },
  horizontalView: {
    height: hp(3.5),
    width: '100%',
    flexDirection: 'row',
  },
  dataText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.apiError,
  },
  desText: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.darkGreen,
    marginLeft: wp(2),
  },
  dateText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.apiError,
    width: '100%',
  },
  readAllText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greyColor,
  },
  searchText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.textColor,
    paddingLeft: wp(3),
    width: '92%',
    height: hp(6.5),
    alignSelf: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: wp(2),
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: hp(2),
  },
});

export default styles;
