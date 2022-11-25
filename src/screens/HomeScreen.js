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
  // console.log('linkk --- - - - -', link[2].node.image.uri);
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
      first: 50,
      assetType: 'Photos',
    });
    const uri = data.edges;
    setLink(uri);
    // const result = await TextRecognition.recognize(uri);

    // console.log('Recognized text:', result.text);

    // for (let block of result.blocks) {
    //   console.log('Block text:', block.text);
    //   console.log('Block frame:', block.frame);

    //   for (let line of block.lines) {
    //     console.log('Line text:', line.text);
    //     console.log('Line frame:', line.frame);
    //   }
    // }
  }

  useEffect(() => {
    getPics();
  }, []);

  const width = Dimensions.get('window').width;
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="ocr" onPress={getPics} />
      <View style={{width: width, height: 600}}>
        <FlashList
          data={link}
          renderItem={item => {
            const photo = item.item.node.image.uri;
            console.log(photo);
            async function dim() {
              console.log(
                await Image.getSize(
                  photo,
                  res => {
                    console.log('success', res);
                  },
                  e => {
                    console.log('error', e);
                  },
                ),
              );
            }
            dim();
            async function getText({photo}) {
              console.log('passed uri - ', photo);
              const result = await TextRecognition.recognize(photo);
              console.log('recognised Text - \n', result);
            }
            // getText(photo);
            return (
              <View style={{width: width}}>
                <Image
                  source={{uri: photo}}
                  style={{height: 300, width: width, alignSelf: 'stretch'}}
                />
                <Text>test</Text>
              </View>
            );
          }}
          key={new Date() + Math.random}
          estimatedItemSize={118}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
