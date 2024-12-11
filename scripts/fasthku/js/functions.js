
window.fastHKUTryGetUser = new Promise((resolve, reject) => {
    chrome.storage.sync.get(['username', 'password'], function (items) {
        if (items.username && items.password) {
            resolve({
                username: items.username,
                password: items.password
            });
        }
        reject('No user found');
    });
});

window.fastHKUTryLogin = function (loginFunc) {
    chrome.runtime.sendMessage({
        type: 'CHECK_LOGIN_STATE'
    }).then(response => {
        if (!response.canTryLogin) {
            const remainingSeconds = Math.ceil(response.remainingCooldown / 1000);
            changeToNotification(`Login failed! Please check your account and try to login after ${remainingSeconds} seconds.`);
            console.log(error);
            setTimeout(() => {
                hideLoading();
            }, 3000);
            return;
        }
        window.fastHKUTryGetUser.then((data) => {
            chrome.runtime.sendMessage({
                type: 'LOGIN_FAILED'
            }).then(() => {
                console.log('Try login with user:', data);
            });
            loginFunc(data);
        }).catch((error) => {
            changeToNotification('No user found. Please add user first.');
            console.log(error);
            setTimeout(() => {
                hideLoading();
            }, 2000);
        });
    });
}


