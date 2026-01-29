// window.ezReact
// window.elements
// window.popup
// window.utils
// navigator.css

function NavigatorBtn(btn, custom, inner) {
    return window.ezReact.createElement(custom, inner, () =>
        window.elements.Div({
            className: "ez-inner",
            onClick: btn.onClick,
            innerText: btn.content,
        })
    );
}

function Navigator(btns, centerCustom, custom, inner) {
    // if (!document.querySelector("#ez-navigator")) {
    //     document.documentElement.appendChild(
    //         window.elements.Div({ 
    //             id: "ez-navigator",
    //             style: {
    //                 userSelect: "none",
    //             }
    //          })
    //     );
    // }
    // var container = document.querySelector("#ez-navigator");
    const radius = 90;
    const containerWidth = 90;

    // document.documentElement.removeChild(container);
    if (centerCustom) {
        centerCustom.id = "ez-navigator-center";
    } else {
        centerCustom = { id: "ez-navigator-center" };
    }

    return window.elements.Div(
        {
            id: "ez-navigator",
        },
        [
            window.elements.Div(centerCustom),
            window.elements.Div(
                {
                    className: "ez-inner-list",
                },
                btns.map((btn, index) => {
                    const angle = (1 - index / 9) * (Math.PI * 2) - Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return NavigatorBtn(btn, {
                        style: {
                            left: `${containerWidth / 2 + x}px`,
                            top: `${containerWidth / 2 + 2 + y}px`,
                        },
                    });
                })
            ),
            window.elements.Div({
                innerHTML: `
                    <svg style="position:absolute;width:0;height:0">
                        <filter id="frosted" primitiveUnits="objectBoundingBox">
                        <feImage id="feImg" href="" x="0" y="0" width="1" height="1" result="map" /> 
                            <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
                            <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G">
                                <animate attributeName="scale" to="1.4" dur="0.3s" begin="btn.mouseover" fill="freeze" />
                                <animate attributeName="scale" to="1" dur="0.3s" begin="btn.mouseout" fill="freeze" />
                            </feDisplacementMap>
                        </filter>
                    </svg>
                `
            })
        ]
    );
}

function init() {
    document.documentElement.appendChild(
        window.elements.Div(
            {
                id: "ez-overlay-container",
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
                    transition: "all 0.3s ease-in-out",
                    visibility: "hidden",
                    opacity: 0,
                },
            },
            [
                window.elements.Overlay({
                    id: "ez-overlay",
                    onClick: function () {
                        let container = document.querySelector(
                            "#ez-overlay-container"
                        );
                        let pupupContainer = document.querySelector(
                            "#ez-popup-container"
                        );
                        if (container) {
                            container.style.visibility = "hidden";
                            container.style.opacity = 0;
                        }
                        if (pupupContainer) {
                            pupupContainer.style.visibility = "hidden";
                            pupupContainer.style.opacity = 0;
                        }
                    },
                })
            ]
        )
    );

    var btns = [
        {
            content: "👤",
            onClick: async function () {
                window.utils.setPopup(await window.popup.UserPopup());
            },
        },
        {
            content: "📚",
            onClick: async function () {
                window.utils.setPopup(await window.popup.MoodlePopup());
            },
        },
        {
            content: "⚙️",
            onClick: async function () {
                window.utils.setPopup(await window.popup.SettingPopup());
            },
        },
        {
            content: "❓",
            onClick: async function () {
                window.utils.setPopup(await window.popup.HelpPopup());
            },
        },
    ];

    var navigator = Navigator(btns, { innerText: "🚀" });
    document.documentElement.appendChild(navigator);

    chrome.storage.sync.get("LiquidGlass", function (i) {
        if (i.LiquidGlass) {
            document.getElementById("feImg").setAttribute("href", chrome.runtime.getURL("images/noise.png"));
            document.getElementById("ez-navigator-center").classList.add("liquid-glass");
            document.querySelectorAll(".ez-inner").forEach(function (el) {
                el.classList.add("liquid-glass");
            });
        } else {
            document.getElementById("ez-navigator-center").classList.remove("liquid-glass");
            document.querySelectorAll(".ez-inner").forEach(function (el) {
                el.classList.remove("liquid-glass");
            });
        }
    });

}

init();

chrome.storage.sync.get(["username", "password"], function (items) {
    if (!items.username || !items.password) {
        if (window.location.href.includes("chrome-extension")) {
            return;
        }
        window.navigatorUtils.customizeCenter({
            style: {
                // red
                backgroundColor: "#ff0000",
                visibility: "visible",
                opacity: "1",
            },
            // emoji warning
            innerText: "⚠️",
            onClick: async function () {
                window.utils.setPopup(
                    window.elements.Div(null, [
                        window.elements.Div({
                            innerText: "Please set your UID and password",
                        }),
                        window.popup.SetUserForm()
                    ])
                );
            },
        });
    }
});