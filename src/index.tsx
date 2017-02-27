/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, ScrollView, KeyboardAvoidingView,
  CameraRoll
} from 'react-native'
import RNEditor from './component'

export default class RNEditorDev
  extends React.Component<any, any> {
  editor: RNEditor
  componentDidMount() {
    CameraRoll.getPhotos({
      // groupTypes: 'All',
      assetType: 'All',
      first: 50
    })
      .then((data: any) => {
        console.log(data)
        setTimeout(() => {
          data.edges.forEach((edge: any) => {
            this.editor.insertImage(edge.node.image.uri)
          })
        }, 3000);
      });
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        keyboardVerticalOffset={0}>
        <RNEditor
          ref={r => this.editor = r}
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
  } as React.ViewStyle
});

AppRegistry.registerComponent('RNEditorDev', () => RNEditorDev);
