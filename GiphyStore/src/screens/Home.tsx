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
import axios from 'axios';
import {throttle} from 'lodash';
import GifDescModal from '../components/GifDescModal';

const {width} = Dimensions.get('screen');

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';
const limit = 26;

let debounceSearch: any;

const Home = () => {
  const [gifs, setGifs] = useState<{imageUrl: string}[]>([]);
  const [searchText, setSearchText] = useState('');
  const [media, setMedia] = useState('');
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
          // Concept of debouncing used here. Just making a delay of 250 ms.
          if (!debounceSearch) {
            debounceSearch = setTimeout(() => {
              debounceSearch = null;
            }, 250);
          }

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
            // const extendedArr: any = [...gifs, ...tempArr];
            // setGifs(extendedArr);
            setGifs(prevGifs => [...prevGifs, ...tempArr]);
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
        onEndReachedThreshold={0.7}
        onEndReached={fetchMoreGifsThrottled}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={8}
        ListEmptyComponent={
          <>
            <View
              style={{
                marginTop: 250,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{'No Data Found'}</Text>
            </View>
          </>
        }
      />
    ),
    [gifs, renderGif, refreshPage, onRefreshing, fetchMoreGifs],
  );

  const fetchMoreGifsThrottled = throttle(fetchMoreGifs, 1000);

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
    marginBottom: 5,
  },
});

export default Home;
