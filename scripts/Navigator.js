
// window.ezReact
// window.elements
// window.popup
// window.utils
// navigator.css

function NavigatorBtn(btn, custom, inner) {
    return window.ezReact.createElement(custom, inner, () =>
        window.elements.Div(
            {
                className: "ez-inner",
                onClick: btn.onClick,
				innerText: btn.content,
            }
        )
    );
}

function Navigator(btns, custom, inner) {
	if (!document.querySelector("#ez-navigator")) {
		document.body.appendChild(window.elements.Div({ id: "ez-navigator" }));
	}
	var container = document.querySelector("#ez-navigator");
    const radius = 90;
    const containerWidth = container.offsetWidth;

	document.body.removeChild(container);
    return window.elements.Div(
        {
            id: "ez-navigator",
        },
        [
            window.elements.Div({
                className: "ez-navigator-center"
            }),
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

function init(){
	var btns = [
		{
			content: "🏠",
			onClick: async function () {
                window.utils.setPopup(await window.popup.FastHKUPopup());
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
			content: "📝",
			onClick: function () {
				window.location.href = "/assignment";
			},
		}
	];
	var navigator = Navigator(btns);
	document.body.appendChild(navigator);
}

init();