import React, { Component } from 'react';
import {
  View,
  Animated,
  ActivityIndicator
} from 'react-native';

import styles from './style';

export default class ImageBlurLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgAnim: new Animated.Value(0),
      thumbnailAnim: new Animated.Value(0),
      isLoading: true
    }
  }

  handleThumbnailLoad = async () => {
    let { thumbnailAnim } = this.state
    await this.setState({ isLoading: false })
    Animated.timing(thumbnailAnim, {
      toValue: 1,
    }).start()
  }
  onImageLoad = () => {
    let { imgAnim } = this.state
    Animated.timing(imgAnim, {
      toValue: 1,
    }).start()
    this.props.onLoad()
  }


  render() {
    let { imgAnim, thumbnailAnim, isLoading } = this.state
    let {
      thumbnailSource,
      source,
      style,
      ...props
    } = this.props
    return (
      <View style={[ styles.container, style ]}>
        <Animated.Image
          { ...props }
          source={thumbnailSource}
          style={[style, { opacity: thumbnailAnim }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <Animated.Image
          { ...props }
          source={ source }
          style={[ styles.imageOverlay, style, { opacity: imgAnim } ]}
          onLoad={ this.onImageLoad }
        />
        { 
          isLoading && 
            <View style={[ styles.imageOverlay, styles.centerSection ]}>
              <ActivityIndicator style={ styles.loadingIndicator } />
            </View>
        }
      </View>
    );
  }
}

ImageBlurLoading.defaultProps = {
  onLoad: Function.prototype
}