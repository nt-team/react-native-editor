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
  View, ScrollView, KeyboardAvoidingView
} from 'react-native'
import RNEditor from './component'

export default class RNEditorDev
  extends React.Component<any, any> {
  render() {
    return (
      <KeyboardAvoidingView
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
  } as React.ViewStyle
});

AppRegistry.registerComponent('RNEditorDev', () => RNEditorDev);
