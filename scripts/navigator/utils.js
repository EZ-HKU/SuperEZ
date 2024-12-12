if (!window){
    var window = {};
}

window.navigatorUtils = {};

window.navigatorUtils.customizeCenter = function (custom) {
    let center = document.getElementById('ez-navigator-center');
    if (!center) {
        console.log('Center not found');
        return;
    }
    for (const key in custom) {
        if (key === 'style') {
            window.ezReact.addStyles(center, custom[key]);
            continue;
        }
        center[key] = custom[key];
    }
}