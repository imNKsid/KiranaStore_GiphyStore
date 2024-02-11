import {Alert, PermissionsAndroid, ToastAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share, {ShareSingleOptions} from 'react-native-share';

// Function to initiate sharing
export const shareImage = (imgUrl: string) => {
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

export const checkPermission = async (imgUrl: string) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to download Photos',
        buttonPositive: 'OK',
      },
    );

    console.log('granted =>', granted);

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

export const downloadImage = (imgUrl: string) => {
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
