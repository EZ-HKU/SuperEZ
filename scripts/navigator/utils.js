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
    window.ezReact.addCustom(center, custom);
}