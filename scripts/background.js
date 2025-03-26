// FastHKU background script
importScripts("fasthku/background.js");

// Moodle background script
importScripts("moodle/background.js");

// SuperLoad background script
importScripts("superload/background.js");

// omnibox
importScripts("omnibox.js");

// on first install
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.runtime.openOptionsPage();
    }
});
