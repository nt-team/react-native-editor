# react-native-editor

`react-native-editor`是一个React Native的富文本编辑器组件，基于`draft-js`和`react-native-webview-invoke`的Hybrid方案实现。

![image](https://cloud.githubusercontent.com/assets/5719833/22633863/e2ccf80a-ec5f-11e6-92b9-509e9420f70f.png)

## 基本用法

首先在React Native项目中安装：

```
npm install github:pinqy520/react-native-editor --save
```

引入`RNEditor`组件

``` javascript
import RNEditor from 'react-native'
```

使用组件

``` javascript
class RNETest
  extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        contentContainerStyle={{ flex: 1 }}
        keyboardVerticalOffset={0}>
        <RNEditor
          style={styles.editor}
          placeholder="here is placeholder" />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  editor: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    flex: 1
  }
});
```

### 备注

> 如果是在iOS项目中，需要先引入native模块

将`node_modules/react-native-editor/lib/ios/`中的四个文件，引入到你的iOS工程中。

``` javascript
node_modules/react-native-editor/lib/ios/
|-- RNEditorWebView.h
|-- RNEditorWebView.m
|-- RNEditorWebViewManager.h
|-- RNEditorWebViewManager.m
```

## APIs

## 自定义编辑器



## TODO

- [ ] 支持React Native Camara Roll选择离线图片、视频