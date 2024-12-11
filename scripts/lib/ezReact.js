if (!window){
    var window = {};
}

window.ezReact = {};

window.ezReact.appendInnerElements = function(parent, inner) {
    for (let i = 0; i < inner.length; i++) {
        parent.appendChild(inner[i]);
    }
    return parent;
}

window.ezReact.mergeInnerElements = function(inner) {
    let merged = document.createElement('div');
    for (let i = 0; i < inner.length; i++) {
        merged.appendChild(inner[i]);
    }
    return merged;
}

window.ezReact.addStyles = function(element, styles) {
    for (let key in styles) {
        // if (element.style[key]) {
            element.style[key] = styles[key];
        // } else {
        //     element.style.setProperty(key, styles[key]);
        // }
    }
    return element;
}

window.ezReact.addClass = function(element, classes) {
    for (let i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);
    }
    return element;
}

window.ezReact.addListeners = function(element, listeners) {
    for (let key in listeners) {
        element.addEventListener(key, listeners[key]);
    }
    return element;
}

window.ezReact.addCustom = function(element, custom) {
    for (let key in custom) {
        if (key === 'style') {
            element = window.ezReact.addStyles(element, custom[key]);
            continue;
        }
        if (key === 'classList') {
            element = window.ezReact.addClass(element, custom[key]);
            continue;
        }
        if (key === 'listeners') {
            element = window.ezReact.addListeners(element, custom[key]);
            continue;
        }
        if (key === 'onClick' || key === 'OnClick') {
            element.addEventListener('click', custom[key]);
            continue;
        }
        element[key] = custom[key];
    }
    return element;
}

window.ezReact.createElement = function(custom, inner, func) {
    let element = func();

    if (custom) {
        element = window.ezReact.addCustom(element, custom);
    }

    if (inner) {
        element = window.ezReact.appendInnerElements(element, inner);
    }

    return element; 
}

window.ezReact.setElement = function(custom, inner, element) {
    if (custom) {
        element = window.ezReact.addCustom(element, custom);
    }

    if (inner) {
        element = window.ezReact.appendInnerElements(element, inner);
    }

    return element;
}
