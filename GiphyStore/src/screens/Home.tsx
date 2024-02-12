import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import GifDescModal from '../components/GifDescModal';
import axios from 'axios';

const {width} = Dimensions.get('screen');

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';
const limit = 26;

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [media, setMedia] = useState('');
  const [gifs, setGifs] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        let apiUrl;
        let params;

        // Common parameters for both trending and search API calls
        const commonParams = {
          api_key: key,
          limit,
          offset,
          rating: 'g',
          bundle: 'messaging_non_clips',
        };

        if (searchText.length > 3) {
          apiUrl = `${BASE_URL}/search`;
          params = {
            ...commonParams,
            q: searchText,
            lang: 'en',
          };
        } else {
          apiUrl = `${BASE_URL}/trending`;
          params = commonParams;
        }

        const res = await axios.get(apiUrl, {
          cancelToken: source.token,
          params,
        });

        if (
          res?.data?.data &&
          Array.isArray(res.data.data) &&
          res.data.data?.length > 0
        ) {
          const tempArr = res.data.data.map((item: any) => ({
            imageUrl: item.images.original.url,
          }));
          if (offset === 0) {
            setGifs(tempArr);
          } else {
            const extendedArr: any = [...gifs, ...tempArr];
            setGifs(extendedArr);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('API call failed:', error);
        }
      }
    };

    fetchData();

    return () => {
      source.cancel('Component unmounted');
    };
  }, [offset, searchText]);

  // console.log('gifs =>', gifs);

  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const renderGif = useCallback(
    ({item, index}: any) => {
      return (
        <TouchableOpacity onPress={() => setMedia(item.imageUrl)}>
          <Image
            resizeMode="stretch"
            style={[styles.image, index % 2 === 0 ? {marginRight: 5} : {}]}
            source={{uri: item.imageUrl}}
          />
        </TouchableOpacity>
      );
    },
    [setMedia],
  );

  const fetchMoreGifs = () => {
    setOffset(offset + 1);
  };

  const onRefreshing = useCallback(() => {
    setRefreshPage(true);
    setTimeout(() => {
      setRefreshPage(false);
    }, 2000);
  }, []);

  const renderAllGifsCallback = useCallback(
    () => (
      <FlatList
        data={gifs}
        numColumns={2}
        columnWrapperStyle={styles.container}
        renderItem={renderGif}
        extraData={gifs}
        scrollEventThrottle={20}
        refreshControl={
          <RefreshControl refreshing={refreshPage} onRefresh={onRefreshing} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={fetchMoreGifs}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={8}
      />
    ),
    [gifs, renderGif, refreshPage, onRefreshing, fetchMoreGifs],
  );

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

      {renderAllGifsCallback()}

      <GifDescModal
        media={media}
        onClose={() => setMedia('')}
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
  image: {
    width: width / 2,
    height: width / 2,
    borderWidth: 3,
    marginBottom: 5,
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
