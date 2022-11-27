import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>HHHHeader</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  root: {
    // height: 80,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  text: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
});
