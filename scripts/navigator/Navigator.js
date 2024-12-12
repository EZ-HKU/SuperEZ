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
    if (!document.querySelector("#ez-navigator")) {
        document.documentElement.appendChild(
            window.elements.Div({ id: "ez-navigator" })
        );
    }
    var container = document.querySelector("#ez-navigator");
    const radius = 90;
    const containerWidth = 90;

    document.documentElement.removeChild(container);
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
                        if (container) {
                            container.style.visibility = "hidden";
                            container.style.opacity = 0;
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
                window.utils.setPopup(await window.popup.MoodlePopup(), {
                    container: {
                        style: {
                            width: "350px",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                        },
                    },
                });
            },
        },
        {
            content: "📅",
            onClick: function () {
                window.location.href = "/calendar";
            },
        },
        {
            content: "⚙️",
            onClick: async function () {
                window.utils.setPopup(await window.popup.SettingPopup());
            },
        },
    ];

    var navigator = Navigator(btns, { innerText: "🚀" });
    document.documentElement.appendChild(navigator);
}

init();
