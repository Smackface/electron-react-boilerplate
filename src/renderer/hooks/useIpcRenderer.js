const useIpcRenderer = (message, arg) => {
  window.electron.ipcRenderer.sendMessage(message, arg)
}
export default useIpcRenderer
