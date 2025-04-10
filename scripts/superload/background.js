// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadFile') {
        chrome.downloads.download({
            url: message.url,
            filename: `SuperLoad/${message.address}/${message.filename}.pdf`,
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

            chrome.downloads.download({
                url: file.url,
                filename: `SuperLoad/${file.address}/${file.filename}.pdf`,
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

