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
    }
});