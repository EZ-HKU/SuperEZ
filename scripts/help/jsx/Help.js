// window.elements
// window.utils

if (!window) {
    var window = {};
}

if (!window.popup) {
    window.popup = {};
}



window.popup.HelpPopup = async function (custom, inner) {
    return (
        window.elements.Div({
            id: "ez-HelpPopup-container"
        },[
            window.elements.H3({
                innerText: "Help",
            }),
            window.elements.A({
                href: "https://github.com/EZ-HKU/SuperEZ",
                innerText: "GitHub",
            }),
        ]
        )
    )
}