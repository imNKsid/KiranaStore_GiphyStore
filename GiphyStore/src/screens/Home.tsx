import {
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphySDK,
} from '@giphy/react-native-sdk';
import Share, {ShareSingleOptions} from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {throttle} from 'lodash';

const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';

GiphySDK.configure({apiKey: key});

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [media, setMedia] = useState<GiphyMedia | null>(null);

  const throttledShare = throttle(shareImage, 1000);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={styles.searchBox}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.searchImg}
        />
        <TextInput
          placeholder="Search GIFs..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor={'gray'}
        />
      </View>
      {searchText.length > 3 ? (
        <>
          <GiphyGridView
            content={GiphyContent.search({
              searchQuery: searchText,
            })}
            cellPadding={4}
            style={{flex: 1}}
            onMediaSelect={e => setMedia(e.nativeEvent.media)}
          />
        </>
      ) : (
        <GiphyGridView
          content={GiphyContent.trendingGifs()}
          cellPadding={4}
          style={{flex: 1}}
          onMediaSelect={e => setMedia(e.nativeEvent.media)}
        />
      )}
      {media ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={media.data.images.original.url ? true : false}
          statusBarTranslucent={true}
          onRequestClose={() => setMedia(null)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setMedia(null)}>
                <Image
                  source={require('../assets/images/cross.png')}
                  style={styles.crossIcon}
                />
              </TouchableOpacity>
              <View style={styles.imageNbtn}>
                <Image
                  source={{uri: media.data.images.original.url}}
                  style={styles.modalImage}
                />
                <View style={styles.btnsContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      throttledShare(media.data.images.original.url)
                    }
                    style={styles.shareBtnView}>
                    <Text style={styles.shareBtnText}>
                      {'Share to WhatsApp'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      checkPermission(media.data.images.original.url)
                    }
                    style={styles.btnView}>
                    <Text style={styles.btnText}>{'Download'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

// Function to initiate sharing
const shareImage = (imgUrl: string) => {
  RNFetchBlob.fetch('GET', imgUrl)
    .then(resp => {
      console.log('response : ', resp);
      console.log(resp.data);
      let base64image = resp.data;
      share('data:image/gif;base64,' + base64image);
    })
    .catch(err => console.log('err =>', err));
};

// Function to share an image to WhatsApp
const share = (base64image: string) => {
  let shareOptions = {
    title: 'Share via',
    url: base64image,
    subject: 'Subject',
    social: Share.Social.WHATSAPP,
  } as ShareSingleOptions;

  Share.shareSingle(shareOptions)
    .then(res => {
      // console.log('Share success =>', res);
      Alert.alert('Image Shared Successfully.');
      // Showing alert after successful sharing
    })
    .catch(err => {
      err && console.log(err);
    });
};

const checkPermission = async (imgUrl: string) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to download Photos',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Once user grant the permission start downloading
      console.log('Storage Permission Granted.');
      downloadImage(imgUrl);
    } else {
      // If permission denied then show alert
      Alert.alert('Storage Permission Not Granted', '', [
        {
          text: 'OK',
          onPress: () =>
            ToastAndroid.show(
              'Permission denied. Go to settings and give location access.',
              ToastAndroid.SHORT,
            ),
        },
      ]);
    }
  } catch (err) {
    console.log(err);
  }
};

const downloadImage = (imgUrl: string) => {
  let date = new Date(); // To add the time suffix in filename

  let ext: any = getExtention(imgUrl); // Getting the extention of the file
  ext = '.' + ext[0];

  // Get config and fs from RN Fetch Blob
  // config: To pass the downloading related options
  // fs: Directory path where we want our image to download
  const {config, fs} = RNFetchBlob;
  let PictureDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      // Related to the Android only
      useDownloadManager: true,
      notification: true,
      path:
        PictureDir +
        '/image_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      description: 'Image',
    },
  };
  config(options)
    .fetch('GET', imgUrl)
    .then(res => {
      // console.log('res -> ', JSON.stringify(res));
      Alert.alert('Image Downloaded Successfully.');
      // Showing alert after successful downloading
    })
    .catch(err => {
      err && console.log(err);
    });
};

// Function to get the file extension
const getExtention = (filename: string) => {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
};

export default Home;

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
  searchBox: {
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  searchImg: {width: 20, height: 20, tintColor: 'gray', marginLeft: 10},
  searchInput: {
    paddingHorizontal: 10,
    width: '90%',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // flex:1,
    height: '110%',
    width: '100%',
    backgroundColor: '#00000080', //'rgb(255,255,255,0.8)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 350,
    height: 380,
    alignSelf: 'center',
    borderRadius: 20,
  },
  crossIcon: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 5,
  },
  imageNbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalImage: {width: 290, height: 265, resizeMode: 'stretch'},
  btnsContainer: {
    marginTop: 10,
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareBtnView: {
    width: 150,
    height: 50,
    backgroundColor: '#5ABB58',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  shareBtnText: {textAlign: 'center'},
  btnView: {
    width: 100,
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnText: {textAlign: 'center', color: 'white', top: -1},
});
