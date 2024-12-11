if (!window){
    var window = {};
}

window.utils = {};

window.utils.getStorage = (keys) => new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (items) => {
        resolve(items);
    });
});

window.utils.setPopup = (popup, custom) => {
    if (!custom) {
        custom = {};
    }
    let overlayCustom = custom.overlay || {};
    let containerCustom = custom.container || {};
    let popupElement = window.elements.ContainerWithOverlay(containerCustom, {
        id: "ez-overlay",
        style: overlayCustom.style || {},
        onClick: function () {
            if (popupElement) {
                popupElement.style.visibility = "hidden";
                document.body.removeChild(popupElement);
            }
        },
    }, [
        popup,
    ]);
    let container = document.querySelector("#ez-overlay-container");
    if (container) {
        // first set invisible
        container.style.visibility = "hidden";
        document.body.removeChild(container);
    }
    document.body.appendChild(popupElement);
    container = document.querySelector("#ez-overlay-container");
    container.style.visibility = "visible";
};