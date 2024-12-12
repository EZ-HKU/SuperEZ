
let EZMoodleState = {
    openPopupOnStart: false,
};

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_OPEN_POPUP_ON_START') {
        sendResponse(EZMoodleState.openPopupOnStart);
        EZMoodleState.openPopupOnStart = false;
    } else if (message.type === 'SET_OPEN_POPUP_ON_START') {
        EZMoodleState.openPopupOnStart = true;
    } 
    return true;
});