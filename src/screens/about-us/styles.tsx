
import { StyleSheet } from 'react-native'
import colors from 'theme';

export default StyleSheet.create({
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: "center",
      gap: 15,
      padding: 10,
    },
    headerMainText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
    },
    headerSubText: {
        fontSize: 18,
        color: colors.black,
    },
    detailContainer: {
        padding: 15,
    },
    detailText: {
        fontSize: 16,
        paddingBottom: 15,
        fontWeight: 400,
        lineHeight: 22,
    }
});
