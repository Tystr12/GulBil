/* eslint-disable prettier/prettier */
/**
 * Styles for all Views to use on render. Import this into all new screens.
 */

import {
  StyleSheet
} from 'react-native';
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    padding: 180,
    backgroundColor: 'yellow',
  },
  loadingText: {
    color: 'black',
    fontSize: 20,
    padding: -10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 60,
    position: 'relative',
    backgroundColor: 'black',
  },
  leaderBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyAlign: 'center',
    backgroundColor: 'black',
  },
  gulBilButton: {
    backgroundColor: 'yellow',
    padding: 8,
    borderRadius: 8,
  },
  switchFilterButton: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    //marginLeft: 128,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonLeft: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 10,
    marginLeft: -5,
  },
  buttonRight: {
    backgroundColor: 'yellow',
    padding: 6,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 16,
  },
  bottomLeftButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bottomRightButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    color: 'yellow',
    fontSize: 20,
  },
  highlight: {
    color: '#42f2f5',
    fontSize: 30,
  },
});

export default styles;