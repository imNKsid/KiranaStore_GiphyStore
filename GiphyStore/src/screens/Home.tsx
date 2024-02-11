import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphySDK,
} from '@giphy/react-native-sdk';
import GifDescModal from '../components/GifDescModal';

const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';

GiphySDK.configure({apiKey: key});

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [media, setMedia] = useState<GiphyMedia | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Text style={styles.headingText}>{'Welcome to The Giphy Store'}</Text>
      <View style={styles.searchBox}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.searchImg}
        />
        <TextInput
          placeholder="Search your favourite GIFs..."
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
      <GifDescModal media={media} onClose={() => setMedia(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
  headingText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: 'purple',
  },
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

export default Home;
