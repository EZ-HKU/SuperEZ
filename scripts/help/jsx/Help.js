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
            id: "ez-HelpPopup-container",
            style: {
                width: "100%",
                margin: "auto",
            },
        },[
            window.elements.H3({
                innerText: "Help",
            }),
            window.elements.Div({
                innerText: "Powered by EZ-HKU with ❤️",
            }),
            window.elements.Div({
                innerText: "v0.3.1",
            }),
            window.elements.A({
                href: "https://github.com/EZ-HKU/SuperEZ",
                innerText: "GitHub",
            }),
        ]
        )
    )
}