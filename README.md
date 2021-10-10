# React Native Image Blur Loading

React Native component for progressive image loading.

![](image-blur-loading.gif)

## Installation

Run in your root project directory

```bash
$ npm install react-native-image-blur-loading --save
```

## Usage

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import ImageBlurLoading from 'react-native-image-blur-loading'

// ...
const MyComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBlurLoading
        thumbnailSource={{ uri: 'https://picsum.photos/id/1/50/50' }}
        source={{ uri: 'https://picsum.photos/id/1/1000/1000' }}
        style={{ flex: 1, width: undefined, height: undefined, resizeMode: 'contain' }}
      />
    </View>
  )
}
```

## Properties
| Props | Description | Type | Required |
| --- | --- | --- | --- |
| [Image props ...](https://facebook.github.io/react-native/docs/image#props) | It accepts all the [Image props](https://facebook.github.io/react-native/docs/image#props) | - | - |
| `thumbnailSource` | The source of the thumbnail image. Should be a low resolution version of the image used in `source`. | ImageSourcePropType | No |
| `withIndicator` | Displaying `ActivityIndicator` component while the image is still loading. | boolean | No |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)