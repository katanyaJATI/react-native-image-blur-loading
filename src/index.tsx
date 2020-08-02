import React, { useState } from 'react';
import {
  View,
  Animated,
  ActivityIndicator, 
  ImageSourcePropType, 
  AccessibilityProps,
  StyleProp,
  ImageStyle,
  StyleSheet,
  ImagePropsBase,
  ImagePropsIOS,
  ImagePropsAndroid
} from 'react-native';

import styles from './style';

export interface ImageBlurLoadingProps extends ImagePropsBase, ImagePropsIOS, ImagePropsAndroid, AccessibilityProps {
  onLoad?(): void
  withIndicator?: boolean;
  thumbnailSource?: ImageSourcePropType;
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle> & any;
}

function ImageBlurLoading(
  { onLoad, withIndicator=true, thumbnailSource, source, style, ...props }: 
  ImageBlurLoadingProps
) {
  const [imgAnim, setImgAnim] = useState<any>(new Animated.Value(0))
  const [thumbnailAnim, setThumbnailAnim] = useState<any>(new Animated.Value(0))
  const [loading, setLoading] = useState<boolean>(true)

  const handleThumbnailLoad = () => {
    setLoading(false)
    Animated.timing(thumbnailAnim, {
      toValue: 1,
      useNativeDriver: false
    }).start()
  }
  const onImageLoad = () => {
    setLoading(false)
    Animated.timing(imgAnim, {
      toValue: 1,
      useNativeDriver: false
    }).start()
    onLoad && onLoad()
  }

  const styleBorder: {
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
  } = {}
  if (style.borderBottomLeftRadius!=undefined) styleBorder.borderBottomLeftRadius = style.borderBottomLeftRadius
  if (style.borderBottomRightRadius!=undefined) styleBorder.borderBottomRightRadius = style.borderBottomRightRadius
  if (style.borderColor!=undefined) styleBorder.borderColor = style.borderColor
  if (style.borderWidth!=undefined) styleBorder.borderWidth = style.borderWidth
  if (style.borderRadius!=undefined) styleBorder.borderRadius = style.borderRadius
  if (style.borderTopLeftRadius!=undefined) styleBorder.borderTopLeftRadius = style.borderTopLeftRadius
  if (style.borderTopRightRadius!=undefined) styleBorder.borderTopRightRadius = style.borderTopRightRadius

  console.log({styleBorder})
  return (
    <View style={[ loading && styles.container, styleBorder ]}>
      {
        thumbnailSource &&
          <Animated.Image
            { ...props }
            source={thumbnailSource}
            style={[ style, { opacity: thumbnailAnim } ]}
            onLoad={ handleThumbnailLoad }
            blurRadius={1}
          />
      }
      <Animated.Image
        { ...props }
        source={ source }
        style={[ style, { opacity: imgAnim } ]}
        onLoad={ onImageLoad }
      />
      { 
        withIndicator &&
          loading && 
            <View style={[ styles.imageOverlay, styles.centerSection ]}>
              <ActivityIndicator />
            </View>
      }
    </View>
  )
}

export default ImageBlurLoading;