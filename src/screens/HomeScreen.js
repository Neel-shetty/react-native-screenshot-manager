import {
  Button,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {FlashList} from '@shopify/flash-list';
import RNFS from 'react-native-fs';

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

  // console.log(link);

  //RNFS TESTS
  /* RNFS.readDir(RNFS.ExternalStorageDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then(result => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then(statResult => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .then(contents => {
      // log the file contents
      console.log(contents);
    })
    .catch(err => {
      console.log(err.message, err.code);
    }); */

  // RNFS.readDir('/storage/emulated/0/Pictures/Screenshots');

  //RNFS TESTS

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
      first: 1,
      assetType: 'Photos',
      include: ['filename'],
    });
    const uri = data.edges;
    let searchDataArray = [];
    for (let i = 0; i < uri.length; i++) {
      const tempUri = uri[i].node.image.uri;

      const tst = await TextRecognition.recognize(tempUri);

      searchDataArray.push({uri: uri[i].node.image.uri, data: tst.text, id: i});
    }

    setSearchData(searchDataArray);
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
      tempArray.push(uri[i]);
    }
    setLink(tempArray);
  }

  useEffect(() => {
    getData();
    showPics();
  }, []);

  const width = Dimensions.get('window').width;
  return (
    <View>
      {/* <Text>HomeScreen</Text> */}
      {/* <Button title="ocr" onPress={getPics} /> */}
      <View style={{width: width, height: 600, backgroundColor: 'white'}}>
        <FlashList
          data={link}
          renderItem={item => {
            const photo = item.item.node.image.uri;
            console.log(photo)
            // getText(photo);
            return (
              <>
                {photo && (
                  <Image
                    source={{uri: photo}}
                    style={{height: 300, width: width, resizeMode: 'contain'}}
                    // blurRadius={10}
                  />
                )}
              </>
            );
          }}
          key={new Date() + Math.random * 100}
          estimatedItemSize={100}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
