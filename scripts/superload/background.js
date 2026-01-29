// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadFile') {
        // https://moodle.hku.hk/mod/folder/download_folder.php?id=3764675
        // https://moodle.hku.hk/mod/folder/view.php?id=3764676
        if (message.url.includes('/mod/folder/')) {
            message.url = message.url.replace('/view.php?id=', '/download_folder.php?id=');
        }
        chrome.downloads.download({
            url: message.url,
            filename: `SuperLoad/${message.address}/${message.filename}.zip`,
            saveAs: message.saveAs,
            conflictAction: message.conflictAction
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download error:', chrome.runtime.lastError);
            } else {
                console.log('Download started with ID:', downloadId);
            }
        });
    } else if (message.action === 'downloadFiles') {
        message.downloadFiles.forEach(file => {
            if (file.url.includes('/mod/folder/')) {
                file.url = file.url.replace('/view.php?id=', '/download_folder.php?id=');
            }
            chrome.downloads.download({
                url: file.url,
                filename: `SuperLoad/${file.address}/${file.filename}.zip`,
                saveAs: message.saveAs,
                conflictAction: message.conflictAction
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download error:', chrome.runtime.lastError);
                } else {
                    console.log('Download started with ID:', downloadId);
                }
            });
        }
        );
    }
});

