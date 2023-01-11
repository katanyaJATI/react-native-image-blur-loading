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
  StyleSheet,
  ImageURISource,
} from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';

import styles from './style';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export interface ImageBlurLoadingProps
  extends ImagePropsBase,
    ImagePropsIOS,
    ImagePropsAndroid,
    AccessibilityProps {
  onLoad?(): void;
  withIndicator?: boolean;
  thumbnailSource?: ImageSourcePropType;
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle> & any;
  fastImage?: boolean;
  resizeMode?: ResizeMode;
}

function ImageBlurLoading({
  onLoad,
  withIndicator = true,
  thumbnailSource,
  source,
  style = {},
  fastImage,
  resizeMode,
  ...props
}: ImageBlurLoadingProps) {
  const [imgAnim] = useState<any>(new Animated.Value(0));
  const [thumbnailAnim] = useState<any>(new Animated.Value(0));
  const [loading, setLoading] = useState<boolean>(true);

  const [helper, setHelper] = useState<boolean>(false);

  useEffect(() => {
    thumbnailSource && setHelper(true);
    const timer = setTimeout(() => setLoading(false), 20000); // fetch image timeout 20s
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const handleThumbnailLoad = () => {
    setLoading(false);
    Animated.timing(thumbnailAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };
  const onImageLoad = () => {
    setLoading(false);
    helper && setHelper(false);
    Animated.timing(imgAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    onLoad && onLoad();
  };

  const styleBorder: {
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
  } = {
    borderBottomLeftRadius: style?.borderBottomLeftRadius || undefined,
    borderBottomRightRadius: style?.borderBottomRightRadius || undefined,
    borderColor: style?.borderColor || undefined,
    borderWidth: style?.borderWidth || undefined,
    borderRadius: style?.borderRadius || undefined,
    borderTopLeftRadius: style?.borderTopLeftRadius || undefined,
    borderTopRightRadius: style?.borderTopRightRadius || undefined,
  };
  const sizeLoading: any = {
    width: style?.width || undefined,
    height: style?.height || undefined,
  };

  if (style.length) {
    //
    for (let i = 0; i < style.length; i++) {
      // find width & height for loading frame indicators
      if (style[i].width != undefined) sizeLoading.width = style[i].width;
      if (style[i].height != undefined) sizeLoading.height = style[i].height;
      // find border radius for loading frame indicators
      if (style[i].borderBottomLeftRadius != undefined)
        styleBorder.borderBottomLeftRadius = style[i].borderBottomLeftRadius;
      if (style[i].borderBottomRightRadius != undefined)
        styleBorder.borderBottomRightRadius = style[i].borderBottomRightRadius;
      if (style[i].borderColor != undefined)
        styleBorder.borderColor = style[i].borderColor;
      if (style[i].borderWidth != undefined)
        styleBorder.borderWidth = style[i].borderWidth;
      if (style[i].borderRadius != undefined)
        styleBorder.borderRadius = style[i].borderRadius;
      if (style[i].borderTopLeftRadius != undefined)
        styleBorder.borderTopLeftRadius = style[i].borderTopLeftRadius;
      if (style[i].borderTopRightRadius != undefined)
        styleBorder.borderTopRightRadius = style[i].borderTopRightRadius;
    }
  }

  const sourceUri = source as ImageURISource;

  return (
    <>
      {thumbnailSource && helper && (
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={[
            style,
            { opacity: thumbnailAnim },
            { ...StyleSheet.absoluteFillObject },
          ]}
          onLoad={handleThumbnailLoad}
          blurRadius={1}
        />
      )}

      {!fastImage || (!fastImage && sourceUri.uri) ? (
        <Animated.Image
          {...props}
          source={source}
          style={[style, { opacity: imgAnim }]}
          onLoad={onImageLoad}
        />
      ) : (
        // @ts-ignore
        <AnimatedFastImage
          {...props}
          source={{
            uri: sourceUri.uri,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={[style, { opacity: imgAnim }]}
          onLoad={onImageLoad}
          resizeMode={resizeMode}
        />
      )}

      {withIndicator && loading && (
        <View
          style={[
            styles.imageOverlay,
            styles.centerSection,
            styleBorder,
            sizeLoading,
          ]}
        >
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}

export default ImageBlurLoading;
