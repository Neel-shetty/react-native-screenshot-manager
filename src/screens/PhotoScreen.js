import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
// import Header from '../components/PhotoScreenComponents/header';
import Share from 'react-native-share';
import {Ionicons} from '@expo/vector-icons';

const PhotoScreen = (props, {navigation}) => {
  const link = props.route.params.uri;
  console.log(link);

  async function shareButton() {
    const options = {
      url: link,
    };
    const shareResponse = await Share.open(options);
    console.log(JSON.stringify(shareResponse));
  }

  function backButton() {
    props.navigation.navigate('Home');
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: Dimensions.get('window').height,
          alignSelf: 'center',
        }}>
        <StatusBar translucent backgroundColor="transparent" hidden />
        <ImageBackground
          source={{uri: link}}
          resizeMode="cover"
          style={styles.image}>
          <View style={styles.headerComponent}>
            <TouchableOpacity onPress={backButton}>
              <View
                style={{
                  backgroundColor: 'black',
                  borderRadius: 40 / 2,
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="arrow-back" size={30} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={shareButton}>
              <View
                style={{
                  backgroundColor: 'black',
                  borderRadius: 40 / 2,
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="share-social" size={30} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.text}>test</Text> */}
        </ImageBackground>
      </View>
    </View>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
  // image: {},
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  headerComponent: {
    height: 40,
    width: Dimensions.get('window').width,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    // backgroundColor: 'pink',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight,
    // position: 'absolute',
    // top: 0 + StatusBar.currentHeight,
  },
  bottomContainer: {
    height: 100,
    width: Dimensions.get('window').width,
    // backgroundColor: 'violet',
    // position: 'absolute',
    flex: 1,
    // top: 200,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 50,
    paddingHorizontal: 40,
    // paddingVertical: 300,
  },
});
