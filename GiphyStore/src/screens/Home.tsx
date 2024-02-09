import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {GiphyContent, GiphyGridView, GiphySDK} from '@giphy/react-native-sdk';

const key = 'HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD';

GiphySDK.configure({apiKey: key});

const Home = () => {
  const [gif, setGif] = useState({});

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    const res = await axios.get(
      'https://api.giphy.com/v1/gifs/random?api_key=HG3g4GJ0BLvcXTFzmRM4Z5I8D9H35vKD&tag=&rating=g',
    );

    // console.log('res =>', JSON.stringify(res));
    setGif({imageUrl: res.data.data.images.downsized_large.url});
  };
  console.log('gif =>', gif);

  return (
    <View style={{backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <GiphyGridView
        content={GiphyContent.trendingGifs()}
        cellPadding={3}
        style={{height: '100%'}}
        onMediaSelect={e => {
          console.log('e =>', JSON.stringify(e));
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
