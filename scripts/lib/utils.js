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
