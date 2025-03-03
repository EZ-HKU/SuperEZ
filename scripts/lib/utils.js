if (!window) {
    var window = {};
}

window.utils = {};

window.utils.getStorage = (keys) =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            resolve(items);
        });
    });

window.utils.setPopup = (popup, custom) => {
    if (!custom) {
        custom = {};
    }
    var container = document.querySelector("#ez-overlay-container");

    let containerCustom = custom.container || {};

    containerCustom.id = "ez-popup-container";

    let popupContainer = window.elements.Container(containerCustom, [popup]);

    let currentPopup = document.querySelector("#ez-popup-container");

    if (container.style.visibility === "visible") {
        currentPopup.style.visibility = "hidden";
        currentPopup.style.opacity = 0;
        popupContainer.style.visibility = "hidden";
        popupContainer.style.opacity = 0;
        // append overlay and popupContainer to container
        setTimeout(() => {
            if (currentPopup) {
                container.removeChild(currentPopup);
            }
            container.appendChild(popupContainer);
            setTimeout(() => {
                popupContainer.style.visibility = "visible";
                popupContainer.style.opacity = 1;
            }, 10);
        }, 200);
    } else {
        if (currentPopup) {
            container.removeChild(currentPopup);
        }
        container.appendChild(popupContainer);
        container.style.visibility = "visible";
        container.style.opacity = 1;
    }

};

window.utils.showNotification = (title, text, custom) => {
    window.utils.setPopup(
        window.elements.Div(null, [
            window.elements.H3({
                innerText: title || "Notification",
            }),
            window.elements.Div({
                innerText: text || "Notification",
            }),
        ])
    );
};

window.utils.switchUserChangeMoodle = (oldUser, newUser) => {
    chrome.storage.sync.get(["moodle_user_database", "psb_list", "course_code_list"], (data) => {
        let moodle_user_database = data.moodle_user_database;
        if (!moodle_user_database) {
            moodle_user_database = {};
        }
        let psb_list = data.psb_list;
        let course_code_list = data.course_code_list;
        if (!psb_list && !course_code_list) {
            psb_list = [];
            course_code_list = [];
        }
        moodle_user_database[oldUser] = [psb_list, course_code_list];

        if (moodle_user_database[newUser]) {
            [psb_list, course_code_list] = moodle_user_database[newUser];
        } else {
            psb_list = {"courseCodes":[]};
            course_code_list = {"courseCodes":[]};
        }
        chrome.storage.sync.set({
            moodle_user_database: moodle_user_database,
            psb_list: psb_list,
            course_code_list: course_code_list
        });
    });
}

window.utils.setMoodleNotification = () => {
    chrome.storage.sync.get(["course_code_list", "username"], (data) => {
        var pop = false
        if (!data.course_code_list) {
            pop = true
        }
        var courseCodeList = window.courseType.courseCodeListFromStorage(
            data.course_code_list
        );
        var courses = courseCodeList.getAllCourses();
        if (courses.length == 0) {
            pop = true
        }
        if (pop && data.username) {
            window.navigatorUtils.customizeCenter({
                style: {
                    visibility: "visible",
                    opacity: "1",
                    // orange
                    backgroundColor: "#FFA500",
                },
                // emoji warning
                innerText: "📚",
                onClick: async function () {
                    async function sendOpenPopupOnStart() {
                        return new Promise((resolve, reject) => {
                            chrome.runtime.sendMessage({
                                type: "SET_OPEN_POPUP_ON_MOODLE_START",
                            });
                            resolve(true);
                        });
                    }
                    await sendOpenPopupOnStart();
                    window.location.href = "https://moodle.hku.hk/";
                },
            });
        }
    });
}