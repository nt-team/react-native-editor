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
  View, ScrollView
} from 'react-native'
import RNEditor from './component'

export default class RNEditorDev extends React.Component<any, any> {
  render() {
    return (
      <RNEditor style={styles.editor} placeholder="这里是placeholder" />
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
