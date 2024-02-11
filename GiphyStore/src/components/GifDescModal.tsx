import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {GiphyMedia} from '@giphy/react-native-sdk';
import {throttle} from 'lodash';
import {
  checkPermission,
  downloadImage,
  shareImage,
} from '../utils/general-utils';

interface ModalProps {
  media: GiphyMedia | null;
  onClose: () => void;
  isDarkTheme: boolean;
}

const GifDescModal = (props: ModalProps) => {
  const {media, onClose, isDarkTheme} = props;

  const throttledShare = throttle(shareImage, 1000);
  return media ? (
    <Modal
      transparent={true}
      animationType="slide"
      visible={media.data.images.original.url ? true : false}
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isDarkTheme ? styles.darkBackground : styles.lightBackground,
          ]}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../assets/images/cross.png')}
              style={[
                styles.crossIcon,
                isDarkTheme ? styles.lightCrossIcon : styles.darkCrossIcon,
              ]}
            />
          </TouchableOpacity>
          <View style={styles.imageNbtn}>
            <Image
              source={{uri: media.data.images.original.url}}
              style={styles.modalImage}
            />
            <View style={styles.btnsContainer}>
              <TouchableOpacity
                onPress={() => throttledShare(media.data.images.original.url)}
                style={styles.shareBtnView}>
                <Text
                  style={[
                    styles.btnText,
                    isDarkTheme ? styles.lightBtnText : styles.darkBtnText,
                  ]}>
                  {'Share to WhatsApp'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => downloadImage(media.data.images.original.url)}
                style={[
                  styles.btnView,
                  isDarkTheme ? styles.lightBtnView : styles.darkBtnView,
                ]}>
                <Text
                  style={[
                    styles.btnText,
                    isDarkTheme ? styles.darkBtnText : styles.lightBtnText,
                  ]}>
                  {'Download'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  ) : null;
};

export default GifDescModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '110%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080', //'rgb(255,255,255,0.8)',
  },
  modalContent: {
    width: 350,
    height: 380,
    alignSelf: 'center',
    borderRadius: 20,
  },
  darkBackground: {backgroundColor: '#2D2D2D'},
  lightBackground: {backgroundColor: 'white'},
  crossIcon: {
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    marginRight: 10,
    marginTop: 10,
  },
  darkCrossIcon: {tintColor: 'gray'},
  lightCrossIcon: {tintColor: '#FDFDFD'},
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
    height: 45,
    backgroundColor: '#5ABB58',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnText: {textAlign: 'center', top: -1},
  btnView: {
    width: 100,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  darkBtnView: {backgroundColor: 'black'},
  lightBtnView: {backgroundColor: '#E5E5E5'},
  darkBtnText: {color: 'black'},
  lightBtnText: {color: 'white'},
});
