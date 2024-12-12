// window.fastHKUshowLoading();


function fastHKUshowLoading() {
    window.navigatorUtils.customizeCenter({
        style: {
            backgroundColor: "#87CEEB",
            visibility: "visible",
            opacity: "1",
        },
        innerText: "🤖",
    })
}

let url = window.location.href;

if (
    url.includes("https://hkuportal.hku.hk/cas/login") ||
    url.includes("https://hkuportal.hku.hk/login.html")
) {
    fastHKUshowLoading();
    function setTimeStamp() {
        time_object = new Date();
        time =
            "" +
            time_object.getFullYear() +
            time_object.getMonth() +
            time_object.getDate() +
            time_object.getHours() +
            time_object.getMinutes() +
            time_object.getSeconds();
        var keyid = document.getElementsByName("keyid")[0];
        if (keyid) {
            keyid.value = time;
        }
    }

    window.fastHKUTryLogin(function (data) {
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        if (username && password) {
            setTimeStamp();
            username.value = data.username;
            password.value = data.password;
            var login_btn = document.getElementById("login_btn");
            if (login_btn) {
                login_btn.click();
            }
        }
    });
} else if (url.includes("https://lib.hku.hk/hkulauth")) {
    fastHKUshowLoading();

    window.fastHKUTryLogin(function (data) {
        var userid = document.getElementsByName("userid")[0];
        var password = document.getElementsByName("password")[0];

        if (userid && password) {
            userid.value = data.username;
            password.value = data.password;

            setTimeout(() => {
                document.getElementsByName("submit")[0].click();
            }, 200);
        }
    });
} else if (url.includes("https://moodle.hku.hk/login/index.php")) {
    fastHKUshowLoading();

    let button = document.getElementsByClassName(
        "btn login-identityprovider-btn btn-success"
    )[0];

    if (button) {
        button.click();
    }
} else if (url === "https://moodle.hku.hk/") {
    try {
        // check if user is logged in
        if (
            document.getElementsByClassName("lambda-login-button")[0] //.getElementsByTagName("a")[0].innerHTML == "Log in"
        ) {
            // user is not logged in
            // redirect to login page "https://moodle.hku.hk/login/index.php"
            fastHKUshowLoading();

            document.location.href = "https://moodle.hku.hk/login/index.php";
        }
    } catch (error) {
        // user is logged in
        // do nothing
        console.log("User is already logged in");
    }
} else if (url.includes("https://hkuportal.hku.hk/cas/aad")) {
    fastHKUshowLoading();

    window.fastHKUTryLogin(function (data) {
        let email = data.username + "@connect.hku.hk";
        let emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.value = email;
            document.getElementById("login_btn").click();
        }
    });
} else if (url.includes("https://adfs.connect.hku.hk/adfs/ls")) {
    fastHKUshowLoading();

    window.fastHKUTryLogin(function (data) {
        var userNameInput = document.getElementById("userNameInput");
        var passwordInput = document.getElementById("passwordInput");
        if (userNameInput && passwordInput) {
            userNameInput.value = data.username + "@connect.hku.hk";
            passwordInput.value = data.password;
            document.getElementById("submitButton").click();
        }
    });
}
