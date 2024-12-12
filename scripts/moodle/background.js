
let EZMoodleState = {
    openPopupOnMoodleStart: false,
};

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_OPEN_POPUP_ON_MOODLE_START') {
        sendResponse(EZMoodleState.openPopupOnMoodleStart);
        EZMoodleState.openPopupOnMoodleStart = false;
    } else if (message.type === 'SET_OPEN_POPUP_ON_MOODLE_START') {
        EZMoodleState.openPopupOnMoodleStart = true;
    } 
    return true;
});