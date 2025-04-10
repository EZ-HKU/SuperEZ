async function downloadUndownloadedFiles() {
    let fileLinks = findPDFLinks();
    let downloadedFileIDs = (await window.utils.getStorageLocal('downloadedFileIDs')).downloadedFileIDs || [];
    let downloadFiles = [];
    let address = document.querySelector('.h2').textContent;
    fileLinks.forEach(file => {
        if (!downloadedFileIDs.includes(file.url.split("id=")[1])) {
            downloadFiles.push({ url: file.url, filename: file.text.replace(/[\\/?"*<>|:]|'/g, ''), address: address });
        }
    });
    chrome.runtime.sendMessage({
        action: 'downloadFiles',
        downloadFiles: downloadFiles,
        conflictAction: 'uniquify',
        saveAs: false
    });
    downloadedFileIDs = [...new Set([...downloadedFileIDs, ...fileLinks.map(file => file.url.split("id=")[1])])];
    chrome.storage.local.set({ downloadedFileIDs: downloadedFileIDs });
}

let course = document.querySelector('.h2').textContent;
chrome.storage.sync.get(['autoDownloadCourses'], function (items) {
    if (!items.autoDownloadCourses) {
        items.autoDownloadCourses = [];
    }
    if (items.autoDownloadCourses.includes(course)) {
        downloadUndownloadedFiles();
    }
});