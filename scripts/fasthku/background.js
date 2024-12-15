// 存储登录尝试次数和冷却状态
let loginState = {
    attempts: 0,
    lastAttemptTime: 0,
    inCooldown: false
};

function deleteCookie(targetDomain, targetCookies) {    
    chrome.cookies.getAll({ domain: targetDomain }, async function(cookies) {
        for (let cookie of cookies) {
            if (targetCookies.includes(cookie.name)) {
                await chrome.cookies.remove({ url: "https://" + targetDomain + cookie.path, name: cookie.name });
            }
        }
    });
};

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'LOGIN_FAILED') {
        handleLoginFailure(sender.tab.id);
    } else if (message.type === 'CHECK_LOGIN_STATE') {
        sendResponse({
            canTryLogin: canAttemptLogin(),
            remainingCooldown: getRemainingCooldown()
        });
    } else if (message.type === 'RESET_LOGIN_STATE') {
        resetLoginState();
        sendResponse({ success: true });
    } else if (message.type === 'DELETE_ALL_HKU_COOKIES') {
        deleteCookie("hkuportal.hku.hk", ["CAS.AAD.SESSION.COOKIE", "JSESSIONID"]);
        deleteCookie("moodle.hku.hk", ["MoodleSession"]);

        // TODO: booking.lib.hku.hk 中没有 ASP.NET_SessionId
        deleteCookie("booking.lib.hku.hk", ["ASP.NET_SessionId"]);

        sendResponse({ success: true });
    }
    return true;
});

function handleLoginFailure(tabId) {
    loginState.attempts++;
    loginState.lastAttemptTime = Date.now();
    
    if (loginState.attempts >= 8) {
        loginState.inCooldown = true;
        // 3秒后重置状态
        setTimeout(() => {
            resetLoginState();
        }, 3000);
    }

    // // 刷新页面
    // setTimeout(() => {
    //     chrome.tabs.reload(tabId);
    // }, 1000); // 延迟1秒刷新，确保消息能够显示
}

function canAttemptLogin() {
    if (loginState.inCooldown) {
        return false;
    }
    return loginState.attempts < 8;
}

function getRemainingCooldown() {
    if (!loginState.inCooldown) {
        return 0;
    }
    const elapsed = Date.now() - loginState.lastAttemptTime;
    return Math.max(0, 3000 - elapsed);
}

function resetLoginState() {
    loginState = {
        attempts: 0,
        lastAttemptTime: 0,
        inCooldown: false
    };
}