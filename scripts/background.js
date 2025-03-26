// FastHKU background script
importScripts("fasthku/background.js");

// Moodle background script
importScripts("moodle/background.js");

// SuperLoad background script
importScripts("superload/background.js");

// omnibox
importScripts("omnibox.js");

chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.openOptionsPage();
  });