import invoke from 'react-native-webview-invoke/browser'
import { IEditorBaseInfo } from './models'

const RN = {
    editorMounted: invoke.bind('editorMounted') as () => Promise<IEditorBaseInfo>,
    getClipboardText: invoke.bind('getClipboardText')
}

export default RN