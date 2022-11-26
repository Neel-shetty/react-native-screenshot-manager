import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';

const SearchBar = ({onChangeText, placeholder = 'Search', value}) => {
  return (
    <View style={styles.root}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
      />
      <Button>ok</Button>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  root: {
    height: 40,
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'violet',
    borderRadius: 8,
  },
  input: {
    width: Dimensions.get('window').width * 0.8,
  },
});
