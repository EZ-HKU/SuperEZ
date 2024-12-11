// window.elements



function LoadingOverlay(custom, inner) {
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

function createLoadingOverlay() {
    return LoadingOverlay(null, null);
}

function showLoading() {
    const overlay = createLoadingOverlay();
    document.body.appendChild(overlay);
    console.log('Loading overlay created');
    return overlay;
}

function hideLoading() {
    var overlay = document.querySelector('#ezhku-loading-overlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

function changeToNotification(message) {
    var overlay = document.querySelector('#ezhku-loading-overlay');
    if (overlay) {
        overlay.querySelector('#ezhku-loading-container').removeChild(overlay.querySelector('#ezhku-loading-spinner'));
        overlay.querySelector('#ezhku-loading-message').textContent = message;
    }
}

window.fastHKUshowLoading = showLoading;
window.fastHKUhideLoading = hideLoading;