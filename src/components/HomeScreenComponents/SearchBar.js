import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import Search from '../ui/icons/search';
import Svg, {Path} from 'react-native-svg';

const SearchBar = ({onChangeText, placeholder = 'Search', value}) => {
  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={'#667085'}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  // root: {
  //   height: 40,
  //   width: Dimensions.get('window').width * 0.9,
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'lightblue',
  //   borderRadius: 8,
  //   flexDirection: 'row',
  // },
  // input: {
  //   width: Dimensions.get('window').width * 0.8,
  //   paddingLeft: 10,
  // },
  root: {
    // height: 40,
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#D0D5DD',
  },
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    // justifyContent: 'flex-start',
    // backgroundColor:'violet',
    width: width * 0.7,
  },
  input: {
    width: width * 0.7,
    color: 'black',
  },
});
