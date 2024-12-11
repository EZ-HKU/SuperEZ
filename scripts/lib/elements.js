if (!window) {
    var window = {};
}

const ezReactElements = window.ezReact;

window.elements = {};

window.elements.Text = function (text, custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let textElement = document.createElement("div");
        textElement.textContent = text;
        return textElement;
    });
};

window.elements.Overlay = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        // create overlay
        let overlay = document.createElement("div");

        // predefined styles
        overlay = ezReactElements.addStyles(overlay, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
        });

        return overlay;
    });
};

window.elements.Container = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        // create container
        let container = document.createElement("div");

        // predefined styles
        container = ezReactElements.addStyles(container, {
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            zIndex: "10000",
            width: "30%",
        });

        return container;
    });
};

window.elements.ContainerWithOverlay = function (containerCustom,custom, inner) {
    return ezReactElements.createElement({
        id: "ez-overlay-container",
    }, null, () => {
        return window.elements.Div({
            style: {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999",
                transition: "all 0.4s ease",
                visibility: "hidden",
            }
        }, [
            window.elements.Overlay(custom),
            window.elements.Container(containerCustom, inner),
        ]);
    });
};

window.elements.Spinner = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        // create spinner
        let spinner = document.createElement("div");

        // predefined styles
        spinner = ezReactElements.addStyles(spinner, {
            width: "40px",
            height: "40px",
            margin: "10px auto",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "ez-spin 1s linear infinite",
        });
        // animation "spin" should be defined in CSS !!!

        return spinner;
    });
};

window.elements.Div = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let divContainer = document.createElement("div");
        return divContainer;
    });
};

window.elements.P = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let pContainer = document.createElement("p");
        return pContainer;
    });
};

window.elements.H1 = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let h1Container = document.createElement("h1");
        return h1Container;
    });
};

window.elements.H2 = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let h2Container = document.createElement("h2");
        return h2Container;
    });
};

window.elements.A = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let aContainer = document.createElement("a");
        return aContainer;
    });
};

window.elements.Br = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let brContainer = document.createElement("br");
        return brContainer;
    });
};

window.elements.Img = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let imgContainer = document.createElement("img");
        return imgContainer;
    });
};

window.elements.Input = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let inputContainer = document.createElement("input");
        return inputContainer;
    });
};

window.elements.Button = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let buttonContainer = document.createElement("button");
        return buttonContainer;
    });
};

window.elements.Form = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let formContainer = document.createElement("form");
        return formContainer;
    });
};
