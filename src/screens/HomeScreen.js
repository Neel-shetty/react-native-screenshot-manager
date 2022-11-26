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
// import {Searchbar} from 'react-native-paper';

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

  console.log(searchData);

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

    setSearchData(searchDataArray);
    setOldSearchData(searchDataArray);
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
    let searchResults = [];
    // searchResults = data.filter(item => {
    //   return item.toLowerCase().indexOf(text.toLowerCase()) > -1 ? 1 : -1;
    // });
  };

  useEffect(() => {
    getData();
    showPics();
  }, []);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  return (
    <View>
      <View style={styles.root}>
        <View style={styles.ListView}>
          <FlashList
            data={link}
            renderItem={item => {
              var photo = item.item.node.image.uri;
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
