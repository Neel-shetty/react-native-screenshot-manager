import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

const LoadingScreen = ({navigation}) => {
  const [response, setResponse] = useState();
  async function getPermission() {
    // try {
    const storageResponse = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    console.log(storageResponse);
    setResponse(storageResponse);
    // } catch (e) {
    // console.log(e);
    // }
  }
  useEffect(() => {
    getPermission();
  }, []);

  if (response === 'granted') {
    navigation.navigate('Home');
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>LoadingScreen</Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
