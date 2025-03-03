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
            chrome.storage.sync.set({ list: data_list }, function () {});

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
    return await result;
}

window.popup.SetUserForm = function(custom, inner) {
    async function onSubmit(e) {
        e.preventDefault();
        var username = document.getElementById("fasthku-username").value;
        var password = document.getElementById("fasthku-password").value;
        if (username.includes("@connect.hku.hk")){
            username = username.split("@")[0];
        }

        let saved = await saveUser(username, password);
        if (saved) {
            window.utils.setPopup(await window.popup.UserPopup());
        } else {
            alert("Username or password is empty.");
        }
    }

    let textInputStyle = {
        border: "1px solid #ccc",
        borderRadius: "3px",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.075) inset",
        color: "#555",
        display: "block",
        fontSize: "14px",
        height: "34px",
        lineHeight: "1.42857",
        padding: "6px 12px",
        transition: "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
        width: "90%",
        margin: "auto",
        marginBottom: "10px",
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
                    style : textInputStyle
                }),
                window.elements.Input({
                    type: "password",
                    id: "fasthku-password",
                    placeholder: "Password",
                    style : textInputStyle
                }),
                window.elements.Button({
                    id: "fasthku-submit",
                    type: "submit",
                    innerText: "Save",
                    style: {
                        width: "90%",
                        margin: "auto",
                        display: "block",
                        color: "white",
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                        padding: "6px 12px",
                        fontSize: "14px",
                        lineHeight: "1.42857",
                        borderRadius: "3px",
                        cursor: "pointer",
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
            margin: "auto",
            display: "block",
            color: "white",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            padding: "6px 12px",
            fontSize: "14px",
            lineHeight: "1.42857",
            borderRadius: "3px",
            cursor: "pointer",
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


function SettingBlock(name, element) {
    return window.elements.Div({
        className: "ez-setting-block",
        style: {
            margin: "10px 0",
        },
    }, [
        window.elements.H3({
            innerText: name,
        }),
        element,
    ]);
}



window.popup.SettingPopup = async function SettingPopup(custom, inner) {
    return (
        window.elements.Div({
            id: "ez-SettingPopup-container"
        },[
            SettingBlock("Set User", window.popup.SetUserForm()),
            SettingBlock("Quick Logout", LogoutButton()),
        ]
        )
    )
}