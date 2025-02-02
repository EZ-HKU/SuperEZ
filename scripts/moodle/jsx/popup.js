// window.ezReact
// window.elements
// window.utils
// window.courseType

if (!window) {
    var window = {};
}

if (!window.popup) {
    window.popup = {};
}

function CourseBtn(course, custom, inner) {
    return window.ezReact.createElement(custom, inner, function () {
        var tempDiv = window.elements.Div({
            className: "ez-class-div",
        }, [
            window.elements.Div({
                className: "ez-class-p",
                style: {
                    width: "240px",
                },
                innerText: course.title,
                title: course.title,
            }),
            window.elements.Div({
                innerText: "-",
                className: "ez-my-btn",
                onClick: function () {
                    var containers = document.getElementsByClassName("ez-moodle-container");
                    var course_list_div = containers[0];
                    var psb_list_div = containers[1];
                    chrome.storage.sync.get(
                        ["course_code_list", "psb_list"],
                        (data) => {
                            var course_code_list =
                                window.courseType.courseCodeListFromStorage(
                                    data.course_code_list
                                );
                            course_code_list.removeCourseByTitle(course.title);
                            course_list_div.removeChild(tempDiv);
                            if (data.psb_list) {
                                let psb_list =
                                    window.courseType.courseCodeListFromStorage(
                                        data.psb_list
                                    );
                                psb_list.addCourse(course);
                                let psb_course = CourseAddBtn(course, custom, inner);
                                psb_list_div.appendChild(psb_course);
                                chrome.storage.sync.set({ psb_list: psb_list });
                            }
                            chrome.storage.sync.set({ course_code_list: course_code_list });
                        }
                    );
                }
            })
        ]);
        return tempDiv;
    });
}

// async function updateCourseBtnList() {
//     var containers = document.getElementsByClassName("ez-moodle-container");
//     var course_list_div = containers[0];
//     if (!course_list_div) {
//         return;
//     }
//     let course_list = await CourseBtnList();
//     course_list_div.parentNode.replaceChild(course_list, course_list_div);
// }

async function CourseBtnList(custom, inner) {
    let data = await window.utils.getStorage(["course_code_list"]);

    if (!data.course_code_list) {
        return window.elements.Div({
        }, [window.elements.Div({
            innerText: "Current courses",
            className: "ez-annotation",
        }),
        window.elements.Div({ className: "ez-moodle-container" })
        ]);
    }

    let course_code_list = window.courseType.courseCodeListFromStorage(
        data.course_code_list
    );
    let courses = course_code_list.getAllCourses();
    return window.elements.Div({
    }, [
        window.elements.Div({
            innerText: "Current courses",
            className: "ez-annotation",
        }),
        window.elements.Div(
            {
                className: "ez-moodle-container",
            },
            courses.map((course) => CourseBtn(course, custom, inner))
        )
    ])
}

function CourseAddBtn(course, custom, inner) {
    return window.ezReact.createElement(custom, inner, function () {
        var psb_div = document.createElement("div");
        var pp = document.createElement("div");
        pp.classList.add("ez-class-p");
        pp.innerText = course.title;
        psb_div.appendChild(pp);
        psb_div.classList.add("psb-div");
        psb_div.setAttribute("title", course.title);
        psb_div.addEventListener("click", function () {
            var containers = document.getElementsByClassName("ez-moodle-container");
            var course_list_div = containers[0];
            var psb_list_div = containers[1];
            chrome.storage.sync.get(
                ["course_code_list", "psb_list"],
                (data) => {
                    var course_code_list =
                        window.courseType.courseCodeListFromStorage(
                            data.course_code_list
                        );
                    var psb_list = window.courseType.courseCodeListFromStorage(
                        data.psb_list
                    );
                    course_code_list.addCourse(course);
                    psb_list_div.removeChild(psb_div);
                    psb_list.removeCourseByTitle(course.title);
                    let course_btn = CourseBtn(course, custom, inner);
                    course_list_div.appendChild(course_btn);
                    chrome.storage.sync.set({
                        course_code_list: course_code_list,
                        change_flag: true,
                        psb_list: psb_list,
                    });
                }
            );
        });
        return psb_div;
    });
}

async function updateCourseAddBtnList() {
    let containers = document.getElementsByClassName("ez-moodle-container");
    let psb_list_div = containers[1];
    if (!psb_list_div) {
        return;
    }
    let psb_list = await CourseAddBtnList();
    psb_list_div.parentNode.replaceChild(psb_list, psb_list_div);
}

async function CourseAddBtnList(custom, inner) {
    let data = await window.utils.getStorage(["psb_list"]);
    async function sendOpenPopupOnStart() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "SET_OPEN_POPUP_ON_MOODLE_START",
            });
            resolve(true);
        });
    }

    if (data.psb_list) {
        let psb_list = window.courseType.courseCodeListFromStorage(
            data.psb_list
        );
        let courses = psb_list.getAllCourses();
        return window.elements.Div({
        }, [
            window.elements.Div({
                innerText: "Available courses",
                className: "ez-annotation",
            }),
            window.elements.Div(
                {
                    className: "ez-moodle-container"
                },
                courses.map((course) => CourseAddBtn(course, custom, inner))
            )
        ]
        );
    } else {
        return window.elements.Div(
            {
                className: "ez-moodle-container",
            },
            [
                window.elements.Div(
                    {
                        className: "psb-div",
                        style: {
                            margin: "5px 0",
                        },
                        OnClick: async function () {
                            await sendOpenPopupOnStart();
                            window.location.href = "https://moodle.hku.hk/";
                        },
                    },
                    [
                        window.elements.P({
                            className: "ez-class-p",
                            innerText: "Get my courses",
                        }),
                    ]
                ),
            ]
        );
    }
}

window.popup.MoodlePopup = async function () {
    return window.elements.Div(
        {
            id: "outer",
        },
        [
            window.elements.Div({
                style: {
                    fontSize: "30px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#454545",
                    margin: "7px 0 18px 0",
                },
                innerText: "mO.odle",
            }),
            await CourseBtnList(),
            window.elements.Div({ className: "dashed-line" }),
            await CourseAddBtnList(),
            window.elements.Div({
                title: "reset the possible course list",
                style: { padding: "5px 0", width: "15px", marginRight: "10px", float: "right" },
                innerHTML: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="reset">
                    <path
                        d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
                        fill="#454545" />
                </svg>`,
                OnClick: function () {
                    chrome.storage.sync.remove("psb_list", function () {
                        updateCourseAddBtnList();
                    });
                },
            }),
        ]
    );
};
