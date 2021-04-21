import React, { useEffect, useState } from 'react';
import {
  View,
  Animated,
  ActivityIndicator, 
  ImageSourcePropType, 
  AccessibilityProps,
  StyleProp,
  ImageStyle,
  ImagePropsBase,
  ImagePropsIOS,
  ImagePropsAndroid, 
  StyleSheet
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
  { onLoad, withIndicator=true, thumbnailSource, source, style={}, ...props }: 
  ImageBlurLoadingProps
) {
  const [imgAnim] = useState<any>(new Animated.Value(0))
  const [thumbnailAnim] = useState<any>(new Animated.Value(0))
  const [loading, setLoading] = useState<boolean>(true)
  
  const [helper, setHelper] = useState<boolean>(false)

  useEffect(() => {
    thumbnailSource && setHelper(true)
    const timer = setTimeout(() => setLoading(false), 20000) // fetch image timeout 20s
    return () => {
      if (timer){
        clearTimeout(timer)
      }
    }
  }, [])

  const handleThumbnailLoad = () => {
    setLoading(false)
    Animated.timing(thumbnailAnim, {
      toValue: 1,
      useNativeDriver: false
    }).start()
  }
  const onImageLoad = () => {
    setLoading(false)
    helper && setHelper(false)
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
  } = {
    borderBottomLeftRadius: style?.borderBottomLeftRadius || 0,
    borderBottomRightRadius: style?.borderBottomRightRadius || 0,
    borderColor: style?.borderColor || 0,
    borderWidth: style?.borderWidth || 0,
    borderRadius: style?.borderRadius || 0,
    borderTopLeftRadius: style?.borderTopLeftRadius || 0,
    borderTopRightRadius: style?.borderTopRightRadius || 0,
  }
  const sizeLoading: any = {
    width: style?.width || 0,
    height: style?.height || 0,
  }

  if (style.length) { // 
    for (let i=0; i<style.length; i++) {
      // find width & height for loading frame indicators
      if (style[i].width!=undefined) sizeLoading.width = style[i].width
      if (style[i].height!=undefined) sizeLoading.height = style[i].height
      // find border radius for loading frame indicators
      if (style[i].borderBottomLeftRadius!=undefined) styleBorder.borderBottomLeftRadius = style[i].borderBottomLeftRadius
      if (style[i].borderBottomRightRadius!=undefined) styleBorder.borderBottomRightRadius = style[i].borderBottomRightRadius
      if (style[i].borderColor!=undefined) styleBorder.borderColor = style[i].borderColor
      if (style[i].borderWidth!=undefined) styleBorder.borderWidth = style[i].borderWidth
      if (style[i].borderRadius!=undefined) styleBorder.borderRadius = style[i].borderRadius
      if (style[i].borderTopLeftRadius!=undefined) styleBorder.borderTopLeftRadius = style[i].borderTopLeftRadius
      if (style[i].borderTopRightRadius!=undefined) styleBorder.borderTopRightRadius = style[i].borderTopRightRadius
    }
  }
  return (
    <>
      {
        (thumbnailSource && helper) &&
          <Animated.Image
            { ...props }
            source={thumbnailSource}
            style={[ style, { opacity: thumbnailAnim }, { ...StyleSheet.absoluteFillObject } ]}
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
            <View style={[ styles.imageOverlay, styles.centerSection, styleBorder, sizeLoading ]}>
              <ActivityIndicator />
            </View>
      }
    </>
  )
}

export default ImageBlurLoading;