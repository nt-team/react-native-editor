import 'draft-js/dist/Draft.css'
import * as React from 'react'
import { Editor, EditorState } from 'draft-js'
import invoke from 'react-native-webview-invoke/browser'
import Native from './native'

const styles = require('./index.scss')

export interface RNEditorBrowserProperties {

}

export interface RNEditorBrowserStates {
    editorState?: EditorState
}

export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    state = {
        editorState: EditorState.createEmpty()
    }
    onEditorStateChange = (editorState: EditorState) => {
        this.setState({ editorState })
    }
    componentDidMount() {
        Native.editorMounted()
    }
    render() {
        return (
            <Editor editorState={this.state.editorState}
                onChange={this.onEditorStateChange}
                placeholder="test"
            />
        )
    }
}