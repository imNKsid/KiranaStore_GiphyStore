import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
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

  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? 'black' : 'white'}
      />
      <Text
        style={[
          styles.headingText,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {'Welcome to The Giphy Store'}
      </Text>
      <View
        style={[
          styles.searchBox,
          isDarkTheme ? styles.lightBorder : styles.darkBorder,
        ]}>
        <Image
          source={require('../assets/images/search.png')}
          style={[
            styles.searchImg,
            isDarkTheme ? styles.lightSearchImg : styles.darkSearchImg,
          ]}
        />
        <TextInput
          placeholder="Search your favourite GIFs..."
          value={searchText}
          onChangeText={setSearchText}
          style={[
            styles.searchInput,
            isDarkTheme ? styles.lightSearchInput : styles.darkSearchInput,
          ]}
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
      <GifDescModal
        media={media}
        onClose={() => setMedia(null)}
        isDarkTheme={isDarkTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {backgroundColor: 'black'},
  lightBackground: {backgroundColor: 'white'},
  headingText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  darkText: {color: '#CBC3E3'},
  lightText: {color: 'purple'},
  searchBox: {
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  darkBorder: {borderColor: 'gray'},
  lightBorder: {borderColor: 'white'},
  searchImg: {width: 20, height: 20, marginLeft: 10},
  darkSearchImg: {tintColor: 'gray'},
  lightSearchImg: {tintColor: 'white'},
  searchInput: {
    paddingHorizontal: 10,
    width: '90%',
  },
  darkSearchInput: {color: 'black'},
  lightSearchInput: {color: 'white'},
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
