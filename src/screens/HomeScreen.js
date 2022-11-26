import {
  Button,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {FlashList} from '@shopify/flash-list';
// import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import SearchBar from '../components/HomeScreenComponents/SearchBar';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const HomeScreen = () => {
  const [link, setLink] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [oldSearchData, setOldSearchData] = useState([]);

  // console.log(searchData);

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
    const data = await CameraRoll.getPhotos({
      first: 10,
      assetType: 'Photos',
    });
    const uri = data.edges;
    let searchDataArray = [];

    for (let i = 0; i < uri.length; i++) {
      if (uri[i].node.group_name === 'Screenshots') {
        const tempUri = uri[i].node.image.uri;
        const tst = await TextRecognition.recognize(tempUri);
        searchDataArray.push({
          uri: uri[i].node.image.uri,
          data: tst.text,
          id: i,
        });
      }
    }
    setLink(searchDataArray);
    setSearchData(searchDataArray);
    setOldSearchData(searchDataArray);
    console.log('photos indexed');
  }

  async function showPics() {
    const data = await CameraRoll.getPhotos({
      first: 100,
      assetType: 'Photos',
      include: ['filename'],
    });
    const uri = data.edges;
    let tempArray = [];
    for (let i = 0; i < uri.length; i++) {
      if (uri[i].node.group_name === 'Screenshots') {
        tempArray.push(uri[i]);
      }
    }
    setLink(tempArray);
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
    getData();
    // showPics();
  }, []);

  return (
    <View>
      <View style={styles.root}>
        <SearchBar onChangeText={txt => onSearch(txt)} />
        <View style={styles.ListView}>
          <FlashList
            data={link}
            renderItem={item => {
              // console.log(item.item.uri);
              var photo = item.item.uri;
              return (
                <View style={styles.itemView}>
                  <TouchableOpacity>
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
          {/* <Searchbar
            placeholder="Search"
            onChangeText={onSearch}
            value={'test'}
          /> */}
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: 350,
    width: Dimensions.get('window').width / 2,
  },
  root: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
});
