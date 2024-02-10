import {
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphySDK,
} from '@giphy/react-native-sdk';

const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';

GiphySDK.configure({apiKey: key});

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [media, setMedia] = useState<GiphyMedia | null>(null);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <TextInput
        placeholder="Search GIFs..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          paddingHorizontal: 10,
          borderColor: 'gray',
          borderWidth: 1,
          marginHorizontal: 10,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />
      {searchText.length > 3 ? (
        <>
          <GiphyGridView
            content={GiphyContent.search({
              searchQuery: searchText,
            })}
            cellPadding={3}
            style={{flex: 1}}
            onMediaSelect={e => {
              console.log('e =>', e.nativeEvent.media);
              setMedia(e.nativeEvent.media);
            }}
          />
        </>
      ) : (
        <GiphyGridView
          content={GiphyContent.trendingGifs()}
          cellPadding={3}
          style={{flex: 1}}
          onMediaSelect={e => {
            console.log('e =>', e.nativeEvent.media);
            setMedia(e.nativeEvent.media);
          }}
        />
      )}
      {media ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={media.data.images.original.url ? true : false}
          statusBarTranslucent={true}
          onRequestClose={() => setMedia(null)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: '#00000080', //'rgb(255,255,255,0.8)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 300,
                height: 360,
                alignSelf: 'center',
              }}>
              <TouchableOpacity onPress={() => setMedia(null)}>
                <Image
                  source={require('../assets/images/cross.png')}
                  style={{alignSelf: 'flex-end', width: 30, height: 30}}
                />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: media.data.images.original.url}}
                  style={{width: 290, height: 265}}
                />
                <TouchableOpacity
                  onPress={() =>
                    shareToWhatsapp(media.data.images.original.url)
                  }
                  style={{
                    marginTop: 10,
                    width: 150,
                    height: 50,
                    backgroundColor: '#5ABB58',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <Text style={{textAlign: 'center'}}>
                    {'Share to WhatsApp'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const shareToWhatsapp = async (base64image: string) => {
  const dynamicLink = `data:image/png;base64, ${base64image}`;

  const message = encodeURIComponent(`${dynamicLink}`);
  const supported = await Linking.canOpenURL(
    `whatsapp://send?text=${message}`,
  ).catch(e => console.log('URL err =>', JSON.stringify(e)));

  if (supported) {
    Linking.openURL(`whatsapp://send?text=${message}`);
  } else {
    if (Platform.OS === 'android') {
      Linking.openURL(`whatsapp://send?text=${message}`).catch(_ => {
        ToastAndroid.show(
          'Whatsapp not found in this device',
          ToastAndroid.SHORT,
        );
      });
    } else {
      ToastAndroid.show(
        'Whatsapp not found in this device',
        ToastAndroid.SHORT,
      );
    }
  }
};

export default Home;

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 150,
    borderWidth: 3,
    marginBottom: 5,
  },
});
