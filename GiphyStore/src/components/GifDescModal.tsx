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
}

const GifDescModal = (props: ModalProps) => {
  const {media, onClose} = props;

  const throttledShare = throttle(shareImage, 1000);
  return media ? (
    <Modal
      transparent={true}
      animationType="slide"
      visible={media.data.images.original.url ? true : false}
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose}>
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
                onPress={() => throttledShare(media.data.images.original.url)}
                style={styles.shareBtnView}>
                <Text style={styles.shareBtnText}>{'Share to WhatsApp'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => downloadImage(media.data.images.original.url)}
                style={styles.btnView}>
                <Text style={styles.btnText}>{'Download'}</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
