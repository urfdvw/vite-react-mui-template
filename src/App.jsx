import FolderView from "react-local-file-system/FolderView"; // the FolderView component
import useFileSystem from "react-local-file-system/useFileSystem"; // the hook handling connections to the directory
import { getFileText } from "react-local-file-system/fileSystemUtils"; // file system api wrappers for manipulating files

export default function App() {
    // get folder handler and status with useFileSystem hook
    const { openDirectory, directoryReady, statusText, rootDirHandle } = useFileSystem();
    console.log(statusText);
    // example onFileClick handler
    async function onFileClick(fileHandle) {
        console.log("file content of", fileHandle.name, ":", await getFileText(fileHandle));
    }
    // Show FolderView component only when its ready
    return directoryReady ? (
        <FolderView rootFolder={rootDirHandle} onFileClick={onFileClick} />
    ) : (
        <>
            <button onClick={openDirectory}>Open Dir</button>
            <p>{statusText}</p>
        </>
    );
}
