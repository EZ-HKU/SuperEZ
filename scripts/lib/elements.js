if (!window) {
    var window = {};
}

const ezReactElements = window.ezReact;

window.elements = {};

window.elements.Text = function (text, custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let textElement = document.createElement("span");
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
            // backdropFilter: "blur(5px)",
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
            minWidth: "300px",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            fontFamily: "sans-serif",
            fontSize: "14px",
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
                opacity: 0,
            }
        }, [
            window.elements.Overlay(custom),
            window.elements.Container(containerCustom, inner),
        ]);
    });
};

window.elements.LoadingOverlay = function(custom, inner) {
    // create overlay
    return (
        window.elements.Overlay({id: 'ezhku-loading-overlay'}, [
            window.elements.Container({id: 'ezhku-loading-container'},[
                window.elements.Text('FastHKU', {
                    style: {
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '10px'
                    }
                }),
                window.elements.Text('Please waiting...', {
                    id: 'ezhku-loading-message',
                    style: {
                        fontSize: '18px',
                        marginBottom: '10px'
                    }
                }),
                window.elements.Spinner({id: 'ezhku-loading-spinner'}, null)
            ])
        ])
    );
}

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
        divContainer.style.boxSizing = "border-box";
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

window.elements.H3 = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let h3Container = document.createElement("h3");
        return h3Container;
    });
};

window.elements.A = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let aContainer = document.createElement("a");
        return aContainer;
    });
};

window.elements.Span = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let spanContainer = document.createElement("span");
        return spanContainer;
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

window.elements.Tbody = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let tbodyContainer = document.createElement("tbody");
        return tbodyContainer;
    });
}

window.elements.Table = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let tableContainer = document.createElement("table");
        tableContainer.style.width = "100%";
        tableContainer.style.borderCollapse = "collapse";
        return tableContainer;
    });
}

window.elements.Tr = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let trContainer = document.createElement("tr");
        return trContainer;
    });
};

window.elements.Td = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let tdContainer = document.createElement("td");
        return tdContainer;
    });
};

window.elements.Thead = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let theadContainer = document.createElement("thead");
        return theadContainer;
    });
}

window.elements.Th = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let thContainer = document.createElement("th");
        return thContainer;
    });
};

window.elements.Image = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let imgContainer = document.createElement("img");
        return imgContainer;
    });
}

window.elements.Link = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let linkContainer = document.createElement("link");
        return linkContainer;
    });
}

window.elements.Label = function (custom, inner) {
    return ezReactElements.createElement(custom, inner, () => {
        let labelContainer = document.createElement("label");
        return labelContainer;
    });
};