// window.elements
// window.utils

if (!window) {
    var window = {};
}

if (!window.popup) {
    window.popup = {};
}

async function saveUser(username, password) {
    if (!username || !password) {
        return false;
    }

    var data = {
        username: username,
        password: password,
    };
    let result = new Promise((resolve, reject) => {
        chrome.storage.sync.get(["list"], function (items) {
            var data_list = items.list;
            if (data_list === undefined) {
                data_list = [];
            }
            // check if data is in list
            for (var i = 0; i < data_list.length; i++) {
                if (data_list[i].username === username) {
                    data_list.splice(i, 1);
                    break;
                }
            }
            // add data to list
            data_list.push(data);
            // save list to storage
            chrome.storage.sync.set({ list: data_list }, function () { });

            if (data_list.length === 1) {
                // save data to storage
                chrome.storage.sync.set({
                    username: username,
                    password: password,
                });
            }
            resolve(true);
        });
    });
    const steps = document.querySelectorAll('.step-card');
    if (steps.length > 2) {
        steps[2].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return await result;
}

window.popup.SetUserForm = function (custom, inner) {
    async function onSubmit(e) {
        e.preventDefault();
        var username = document.getElementById("fasthku-username").value;
        var password = document.getElementById("fasthku-password").value;
        if (username.includes("@connect.hku.hk")) {
            username = username.split("@")[0];
        }

        let saved = await saveUser(username, password);
        if (saved) {
            window.utils.setPopup(await window.popup.UserPopup());
        } else {
            alert("Username or password is empty.");
        }

        window.navigatorUtils.customizeCenter({
            style: {
                backgroundColor: "#fff",
            },
            // set to original icon
            innerText: "🚀",
            onClick: null,
        });

        window.utils.setMoodleNotification();
    }

    let textInputStyle = {
        // border: "1px solid #ccc",
        // borderRadius: "3px",
        // boxShadow: "0 1px 1px rgba(0, 0, 0, 0.075) inset",
        // color: "#555",
        display: "block",
        // fontSize: "14px",
        height: "40px",
        lineHeight: "1.42857",
        padding: "6px 12px",
        // transition: "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
        width: "90%",
        margin: "auto",
        marginBottom: "10px",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        fontSize: "1rem",
        background: "#f9f9f9",
    }

    return window.elements.Div(null, [
        window.elements.Form(
            {
                id: "fasthku-setUser",
                listeners: {
                    submit: onSubmit,
                },
            },
            [
                window.elements.Input({
                    type: "text",
                    id: "fasthku-username",
                    placeholder: "Username",
                    style: textInputStyle
                }),
                window.elements.Input({
                    type: "password",
                    id: "fasthku-password",
                    placeholder: "Password",
                    style: textInputStyle
                }),
                window.elements.Button({
                    id: "fasthku-submit",
                    type: "submit",
                    innerText: "Save",
                    style: {
                        width: "90%",
                        // margin: "auto",
                        // display: "block",
                        // color: "white",
                        // backgroundColor: "#007bff",
                        // borderColor: "#007bff",
                        // padding: "6px 12px",
                        // fontSize: "14px",
                        lineHeight: "1",
                        // borderRadius: "3px",
                        // cursor: "pointer",
                        padding: "0.75rem",
                        margin: "auto",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        // background: "#3b82f6",
                        border: "2px solid #3b82f6",
                        color: "#3b82f6",
                        background: "white",
                        fontWeight: "600",
                    },
                }),
            ]
        ),
    ]);
}

function LogoutButton(custom, inner) {
    return window.elements.Button({
        innerText: "Logout",
        style: {
            width: "90%",
            // margin: "auto",
            // display: "block",
            // color: "white",
            // backgroundColor: "#ff0000",
            // borderColor: "#ff0000",
            // padding: "6px 12px",
            // fontSize: "14px",
            lineHeight: "1",
            // borderRadius: "3px",
            // cursor: "pointer",
            padding: "0.75rem",
            margin: "auto",
            // border: "none",
            border: "2px solid #ef4444",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            // white background
            background: "white",
            color: "#ef4444",
        },
        onClick: async function () {
            await chrome.runtime.sendMessage({
                type: 'DELETE_ALL_HKU_COOKIES'
            }).then(() => {
                console.log('Cookies deleted');
            });
            window.utils.showNotification("Logout", "You have been logged out in all HKU websites. Please login again.");
        },
    });
}

async function ExamBaseButton(custom, inner) {
    return window.elements.Div({
        style: {
            textAlign: "left",
            marginLeft: "15px",
        },
    }, [
        window.elements.Input(
            {
                type: "checkbox",
                id: "ez-exam-base-checkbox",
                style: {
                    width: "20px",
                    height: "20px",
                    // marginRight: "10px",
                    // marginTop: "5px",
                    verticalAlign: "middle",
                },
                checked: (await window.utils.getStorage('ExamBaseFly')).ExamBaseFly || false,
                onClick: async function (e) {
                    let isChecked = e.target.checked;
                    await chrome.storage.sync.set({
                        ExamBaseFly: isChecked,
                    });
                    
                },
            }, []
        ),
        window.elements.Label({
            htmlFor: "ez-exam-base-checkbox",
            innerText: "Skyrocketing Exam Base",
            style: {
                fontSize: "15px",
                color: "#555555",
                verticalAlign: "middle",
                marginLeft: "10px",
                marginBottom: "0",
            },
        }),
    ])
}


function SettingBlock(name, element) {
    return window.elements.Div({
        className: "ez-setting-block",
        style: {
            margin: "10px 0",
        },
    }, [
        window.elements.H2({
            innerText: name,
            style: {
                // marginBottom: "10px",
                fontSize: "17px",
                // fontWeight: "bold",
                fontWeight: "500",
                color: "#666",
                marginBottom: "17px",
                marginLeft: "15px",
                height: "1.5rem",
                textAlign: "left",
            },
        }),
        element,
    ]);
}



window.popup.SettingPopup = async function SettingPopup(custom, inner) {
    return (
        window.elements.Div({
            id: "ez-SettingPopup-container",
            style: {
                width: "100%",
                margin: "auto",
            }
        }, [
            SettingBlock("Set User", window.popup.SetUserForm()),
            SettingBlock("Quick Logout", LogoutButton()),
            SettingBlock("Exam Base", await ExamBaseButton()),
        ]
        )
    )
}