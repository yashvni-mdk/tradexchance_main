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
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: hp(3),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
  imageView: {
    width: wp(20),
    height: hp(10),
    resizeMode: 'contain',
  },
});

export default styles;
