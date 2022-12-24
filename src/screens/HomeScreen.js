import {
  Button,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {FlashList} from '@shopify/flash-list';
// import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import SearchBar from '../components/HomeScreenComponents/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import {Ionicons} from '@expo/vector-icons';

const HomeScreen = ({navigation}) => {
  const [link, setLink] = useState([null]);
  const [searchData, setSearchData] = useState([null]);
  const [oldSearchData, setOldSearchData] = useState([null]);
  const [offlineSearchData, setOfflineSearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imagesLength, setImagesLength] = useState(0);

  useEffect(() => {
    const backAction = () => {
      // Alert.alert('Hold on!', 'Are you sure you want to leave the app?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => BackHandler.exitApp()},
      // ]);
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // console.log('offline data --- ', offlineSearchData);

  async function temp() {
    await AsyncStorage.removeItem('searchData');
    console.log('deleted');
  }
  // console.log(Constants.systemFonts);
  // temp()

  async function getPermission() {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    // requestCameraPermission();
    // getPermission();
  }, []);

  async function getData() {
    const readJsonData = await AsyncStorage.getItem('searchData');
    // console.log(JSON.parse(readJsonData));;;
    if (readJsonData !== null) {
      setLoading(false);
      // console.log(JSON.parse(readJsonData));
      setOfflineSearchData(JSON.parse(readJsonData));
      setLink(JSON.parse(readJsonData));
      setSearchData(JSON.parse(readJsonData));
      setOldSearchData(JSON.parse(readJsonData));
    } else if (readJsonData === null) {
      setLoading(true);
      let data = await CameraRoll.getPhotos({
        first: 50000,
        assetType: 'Photos',
      });
      data = await CameraRoll.getPhotos({
        first: data.edges.length,
        assetType: 'Photos',
      });
      const uri = data.edges;
      console.log('present log -------------------------', data.page_info);
      let searchDataArray = [];
      // console.log('uri -- ', data);
      let idnum = 0;
      for (let i = 0; i < uri.length; i++) {
        console.log('--------------------------------', uri[i].node.group_name);
        if (uri[i].node.group_name === 'Screenshots') {
          const tempUri = uri[i].node.image.uri;
          const tst = await TextRecognition.recognize(tempUri);
          idnum = idnum + 1;
          searchDataArray.push({
            uri: uri[i].node.image.uri,
            data: tst.text,
            id: idnum,
          });
        }
        setProgress(i);
        setImagesLength(uri.length);
        console.log(`reading image ${i}/${uri.length}`);
      }
      // console.log(searchDataArray);
      if (searchDataArray === []) {
        setSearchData([null]);
      }
      setLink(searchDataArray);
      setSearchData(searchDataArray);
      setOldSearchData(searchDataArray);
      setOfflineSearchData(searchDataArray);
      const jsonData = JSON.stringify(searchDataArray);
      await AsyncStorage.setItem('searchData', jsonData);
      console.log('photos indexed');
      setLoading(false);
    }
  }

  const onSearch = text => {
    if (text === ' ') {
      setSearchData(oldSearchData);
    } else {
      let resultLink = [];
      let searchResults = searchData.filter(item => {
        console.log('item data === ', item.data.includes(text));
        if (item.data.toLowerCase().includes(text.toLowerCase())) {
          console.log(item.uri);
          return item.uri;
        }
      });
      // setSearchData(searchResults);
      setLink(searchResults);
    }
  };

  useEffect(() => {
    async function idk() {
      // if ((await AsyncStorage.getItem('searchData')) === null) {
      //   console.log('getting data');
      getData();
      // } else {
      //   console.log('returning//');
      //   return;
      // }
    }
    idk();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            color: 'black',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          Please wait while we make your Screenshots searchable
        </Text>
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 10,
            color: 'black',
            paddingHorizontal: 20,
          }}>
          This step only happens when you open the app for the first time
        </Text>
        <Text
          style={{
            textAlign: 'center',
            padding: 5,
            color: 'black',
            paddingHorizontal: 20,
          }}>
          Processing {progress} of {imagesLength} images
        </Text>
        <Progress.Bar
          progress={progress / imagesLength}
          width={Dimensions.get('window').width * 0.8}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.root}>
        <StatusBar
          // animated={true}
          // backgroundColor={'transparent'}
          // barStyle={'dark-content'}
          hidden
        />
        <View style={{alignItems: 'center', paddingTop: 10}}>
          <SearchBar onChangeText={txt => onSearch(txt)} />
        </View>
        <View style={styles.ListView}>
          <FlashList
            data={link}
            renderItem={item => {
              // console.log(item.item.uri);
              var photo = item.item?.uri;
              function PhotoButton() {
                navigation.navigate('PhotoScreen', {uri: photo});
              }
              return (
                <View style={styles.itemView}>
                  <TouchableOpacity onPress={PhotoButton}>
                    <FastImage
                      source={{uri: photo, priority: FastImage.priority.normal}}
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            key={new Date() + Math.random}
            numColumns={2}
            estimatedItemSize={100}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  ListView: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  itemView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    // borderRadius: 10,
    overflow: 'hidden',
    // paddingHorizontal: 5,
    alignSelf: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  image: {
    height: 320,
    width: Dimensions.get('window').width / 2,
    alignSelf: 'center',
  },
  root: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
});
