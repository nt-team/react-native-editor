import invoke from 'react-native-webview-invoke/browser'

console.log(invoke)
console.log(require('react-native-webview-invoke/browser'))

const RN = {
    editorMounted: invoke.bind('editorMounted'),
    getClipboardText: invoke.bind('getClipboardText')
}

export default RN