// window.elements
// window.utils

if (!window) {
    var window = {};
}

if (!window.popup) {
    window.popup = {};
}

async function updateLinkList() {
    let linkListElement = document.getElementById('linkList');

    if (!linkListElement) {
        return;
    }

    let linkList = await LinkList();
    linkListElement.parentNode.replaceChild(linkList, linkListElement);
}

async function LinkList(custom, inner) {
    let data = await window.utils.getStorage(['list', 'username', 'password']);
    if (!data.list) {
        return (
            window.elements.Div({
                id: "linkList"
            })
        )
    }
    let linkList = data.list;
    let username = data.username;


    return (
        window.elements.Div({
            id: "linkList"
        },
            linkList.map(link => {
                let div = document.createElement('div');
                div.classList.add('linkWithImage');
                let text = document.createTextNode('😄 ' + link.username);
                if (link.username === username) {
                    div.classList.add('ezhku-active');
                    text = document.createTextNode('😀 ' + link.username);
                    div.addEventListener('mouseover', function () {
                        text.nodeValue = '😵 ' + link.username;
                    });
                    div.addEventListener('mouseout', function () {
                        text.nodeValue = '😀 ' + link.username;
                    });
                    div.addEventListener('click', function () {
                        linkList.splice(linkList.indexOf(link), 1);
                        chrome.storage.sync.set({
                            list: linkList
                        });
                        // clear username and password
                        chrome.storage.sync.remove(['username', 'password']);
                        
                        // refresh 
                        updateLinkList();
                    });
                } else {
                    div.addEventListener('click', function () {
                        // save data to storage
                        chrome.storage.sync.set({
                            username: link.username,
                            password: link.password
                        });
                        
                        // refresh
                        updateLinkList();
                    });
                }
                div.appendChild(text);
                return div;
            })
        )
    )
}


window.popup.UserPopup = async function UserPopup(custom, inner) {
    return (
        window.elements.Div({
            id: "FastHKUPopup-container"
        },[
            await LinkList(),
            window.elements.A({
                style: {
                    float: "right",
                },
                onClick: async function () {
                    window.utils.setPopup(await window.popup.SettingPopup());
                },
            },[
                window.elements.Img({
                    src: chrome.runtime.getURL("images/setting.svg"),
                    alt: "setting",
                    width: "20",
                    height: "20",
                    style: {
                        cursor: "pointer",
                    }
                })
            ])
        ]
        )
    )
}
