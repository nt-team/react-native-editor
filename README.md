# react-native-editor

`react-native-editor`是一个React Native的富文本编辑器组件，基于[`draft-js`](https://github.com/facebook/draft-js)和[`react-native-webview-invoke`](https://github.com/pinqy520/react-native-webview-invoke)的Hybrid方案实现。

![image](https://cloud.githubusercontent.com/assets/5719833/22633863/e2ccf80a-ec5f-11e6-92b9-509e9420f70f.png)

## 基本用法

首先在React Native项目中安装：

```
npm install github:pinqy520/react-native-editor --save
```

引入`RNEditor`组件

``` javascript
import RNEditor from 'react-native-editor'
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

将`node_modules/react-native-editor/lib/ios/`中的六个文件，引入到你的iOS工程中。

``` javascript
node_modules/react-native-editor/lib/ios/
|-- RNEditorProxy.h
|-- RNEditorProxy.m
|-- RNEditorWebView.h
|-- RNEditorWebView.m
|-- RNEditorWebViewManager.h
|-- RNEditorWebViewManager.m
```

## 自定义编辑器

## APIs

### React Native 组件

#### 属性：placeholder

``` javascript
<RNEditor placeholder="here is placeholder" />
```

- 类型：string
- 说明：placeholder

#### 属性：autoHeight

``` javascript
<RNEditor autoHeight />
```

- 类型：boolean
- 说明：是否自动适应高度

#### 属性：initialContent

``` javascript
<RNEditor initialContent={initialContent} />
```

- 类型：Draft.RawContentBlock
- 说明：初始内容


#### 属性：style

``` javascript
<RNEditor style={{flex: 1}} />
```

- 类型：React.ViewStyle
- 说明：编辑器容器样式

#### 方法：insertImage(url: string)

- 说明：插入图片

#### 方法：insertVideo(url: string)

- 说明：插入视频

#### 方法：insertText(text: string)

- 说明：插入内容

#### 方法：setContent(content: Draft.RawContentBlock)

- 说明：设置内容

#### 方法：getContent(): Promise<Draft.RawContentBlock>

- 说明：获取当前内容

#### 方法：focus()

- 说明：设置聚焦

#### 方法：blur()

- 说明：设置不聚焦



## TODO

- [ ] 安卓支持React Native Camara Roll选择离线图片、视频