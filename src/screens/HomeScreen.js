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
  // console.log('linkk --- - - - -', link)
  console.log('searchData ---------------', searchData);
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
  async function getPics() {
    const data = await CameraRoll.getPhotos({
      first: 100,
      assetType: 'Photos',
      include: ['filename'],
    });
    // console.log('data - ', data);
    const uri = data.edges;
    // setLink(uri);
    // console.log('uri -- ', uri[0]);
    let tempArray = [];
    let searchDataArray = [];
    for (let i = 0; i < uri.length; i++) {
      tempArray.push(uri[i]);
      // console.log(uri[i].node.image.uri);
      const tempUri = uri[i].node.image.uri;
      // let textData;
      const tst = await TextRecognition.recognize(tempUri);
      // await getText(tempUri);
      // console.log(tst.text);
      searchDataArray.push({uri: uri[i].node.image.uri, data: tst.text, id: i});
      // console.log(searchDataArray);
    }
    // console.log('temp arr -- - - --', tempArray);
    setLink(tempArray);
    setSearchData(searchDataArray);
  }

  useEffect(() => {
    getPics();
  }, []);

  async function getText(pic) {
    // console.log('passed uri - ', pic);
    // const result = await TextRecognition.recognize(pic);
    const txt = await TextRecognition.recognize(pic);
    // console.log('txt = ', txt);
    return txt;
  }

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
