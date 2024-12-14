
function fastHKULoginFailed(text) {
    window.navigatorUtils.customizeCenter({
        style: {
            // red
            backgroundColor: "#ff0000",
            visibility: "visible",
            opacity: "1",
        },
        // emoji warning
        innerText: "⚠️",
    });
    window.utils.setPopup(
        window.elements.Div(null, [
            window.elements.H3({
                innerText: "Login failed",
            }),
            window.elements.Div({
                innerText: text || "Please check your username and password",
            }),
        ])
    );
}


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
            fastHKULoginFailed(`Login failed! Please check your account and try to login after ${remainingSeconds} seconds.`);
            console.log(error);
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
            fastHKULoginFailed('No user found');
            console.log(error);
        });
    });
}


