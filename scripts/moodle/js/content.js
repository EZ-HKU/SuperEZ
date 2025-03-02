// window.courseType

// 获取psb课程列表，并存入storage
function get_psb() {
    chrome.storage.sync.get(["psb_list", "course_code_list"], (data) => {
        if (data.psb_list) {
            if (data.psb_list.courseCodes.length > 0) {
                return;
            }
        }
        var psb_list = new window.courseType.CourseCodeList();
            var dates = document.querySelectorAll(".categoryname");
            if (data.course_code_list) {
                var course_code_list =
                    window.courseType.courseCodeListFromStorage(
                        data.course_code_list
                    );
            } else {
                var course_code_list = new window.courseType.CourseCodeList();
            }
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            let startYear, endYear;
            if (month < 7) {
                startYear = year-1;
                endYear = year;
            } else {
                startYear = year;
                endYear = year + 1;
            }
            let yearRange = `${startYear}-${endYear.toString().slice(-2)}`;
            console.log({yearRange});
            for (let i = 0; i < dates.length; i++) {
                let date = dates[i];
                if (date.innerText == yearRange) {
                    var course_div =
                        date.parentNode.previousElementSibling
                            .firstElementChild;
                    var title = course_div.innerText;
                    if (course_code_list.findCourseByTitle(title)) {
                        console.log("already added:", title);
                        continue;
                    }
                    var code = title.substring(0, 8);
                    var detail = title.substring(9);
                    var url = course_div.href;
                    var course = new window.courseType.Course(
                        title,
                        code,
                        detail,
                        url
                    );
                    psb_list.addCourse(course);
                }
            }
            chrome.storage.sync.set({ psb_list: psb_list });
            console.log("psb:", psb_list);
    });
}

// 获取course code list，生成页面
var divHTML = `
<div class="card-class">
<a class="card2" href="{course_url}" target="_blank">
    <p class="course-code-class" style="font-weight: bold;">{course_code}</p>
    <p class="small">{course_name}</p>
</a>
</div>`;

function initialize() {
    var mainDiv = document.getElementById("frontpage-course-list");
    var add_div = document.createElement("div");
    add_div.classList.add("container-class");
    chrome.storage.sync.get(["course_code_list"], (data) => {
        if (data.course_code_list) {
            var courseCodeList = window.courseType.courseCodeListFromStorage(
                data.course_code_list
            );
            var courses = courseCodeList.getAllCourses();
            courses.forEach(function (course) {
                var newDiv = document.createElement("div");
                newDiv.innerHTML = divHTML
                    .replace("{course_code}", course.code)
                    .replace("{course_name}", course.detail)
                    .replace("{course_url}", course.url);
                add_div.appendChild(newDiv);
            });
            mainDiv.insertAdjacentElement("beforebegin", add_div);
        }
    });
}

// my courses 页面
function CourseList_handler() {
    const inputElement = document.querySelector('input[type="text"]');
    inputElement.addEventListener(
        "input",
        debounce(() => {
            generate();
        }, 600)
    );
    generate();
}

function generate() {
    const observer = new MutationObserver((mutations) => {
        const targetElement = document.querySelector(".coursemenubtn");
        if (targetElement) {
            console.log("generate");
            observer.disconnect();
            var card_menu_btn = document.querySelectorAll(".coursemenubtn");
            card_menu_btn.forEach(function (i) {
                var my_card_btn = document.createElement("button");
                my_card_btn.textContent = "+";
                my_card_btn.classList.add(
                    "btn",
                    "btn-link",
                    "btn-icon",
                    "icon-size-3",
                    "coursemenubtn"
                );
                my_card_btn.style.fontWeight = "bold";
                my_card_btn.style.userSelect = "none";
                my_card_btn.style.fontSize = "20px";
                my_card_btn.addEventListener("click", () => {
                    var parent_node =
                        i.parentNode.parentNode.parentNode.parentNode;
                    var url = parent_node.querySelector("a").href;
                    var title = i.parentNode
                        .querySelector(".sr-only")
                        .textContent.substring(27);
                    var code = title.substring(0, 8);
                    var detail = title.substring(9);
                    chrome.storage.sync.get(["course_code_list"], (data) => {
                        if (!data.course_code_list) {
                            var course_code_list =
                                new window.courseType.CourseCodeList();
                        } else {
                            var course_code_list =
                                window.courseType.courseCodeListFromStorage(
                                    data.course_code_list
                                );
                            if (course_code_list.findCourseByTitle(title)) {
                                alert(
                                    "You have already added this course to your mO.odle Courses"
                                );
                                return;
                            }
                        }
                        course_code_list.addCourse(
                            new window.courseType.Course(
                                title,
                                code,
                                detail,
                                url
                            )
                        );
                        alert("Course added successfully!");
                        chrome.storage.sync.set({
                            course_code_list: course_code_list,
                        }); // , change_flag: true
                    });
                });
                i.parentNode.style.display = "flex";
                i.parentNode.insertBefore(my_card_btn, i);
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        // 清除之前的定时器
        clearTimeout(timeoutId);

        // 设置新的定时器
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// sidebar
function CourePage_handler() {
    var sidebar = document.getElementById("courseindex-content");
    chrome.storage.sync.get(["course_code_list"], (data) => {
        if (data.course_code_list) {
            var course_code_list = window.courseType.courseCodeListFromStorage(
                data.course_code_list
            );
        } else {
            return;
        }

        var container = document.createElement("div");
        container.className = "ez-moodle-container";
        var courses = course_code_list.getAllCourses();
        courses.forEach(function (course) {
            const div = document.createElement("div");
            div.style.margin = "3px 0";
            var text = document.createElement("div");
            text.textContent = course.title;
            text.setAttribute("title", course.title);
            text.className = "ez-class-p";
            div.appendChild(text);
            div.classList.add("psb-div");
            div.style.width = "90%";
            div.addEventListener("click", () => {
                window.location.href = course.url;
            });
            container.appendChild(div);
        });

        const div = document.createElement("div");
        div.classList.add("dashed-line");
        div.style.width = "calc(100% - 30px)";
        container.appendChild(div);

        const currentURL = window.location.href;
        const currentCourse = document.querySelector(".h2").textContent;
        if (!course_code_list.findCourseByTitle(currentCourse)) {
            var add_button = document.createElement("div");
            add_button.textContent = "Add this course";
            add_button.classList.add("psb-div", "ez-class-p");
            add_button.style.width = "90%";
            add_button.addEventListener("click", () => {
                course_code_list.addCourse(
                    new window.courseType.Course(
                        currentCourse,
                        currentCourse.substring(0, 8),
                        currentCourse.substring(9),
                        currentURL
                    )
                );
                chrome.storage.sync.set({ course_code_list: course_code_list });
                sidebar.parentNode.removeChild(container);
                CourePage_handler();
            });
            container.appendChild(add_button);
        } else {
            var remove_button = document.createElement("div");
            remove_button.textContent = "Remove this course";
            remove_button.classList.add("psb-div", "ez-class-p");
            remove_button.style.width = "90%";
            remove_button.addEventListener("click", () => {
                course_code_list.removeCourseByTitle(currentCourse);
                chrome.storage.sync.set({ course_code_list: course_code_list });
                sidebar.parentNode.removeChild(container);
                CourePage_handler();
            });
            container.appendChild(remove_button);
        }
        sidebar.parentNode.insertBefore(container, sidebar);
    });
}

function popupOnStart() {
    chrome.runtime
        .sendMessage({
            type: "GET_OPEN_POPUP_ON_MOODLE_START",
        })
        .then(async (response) => {
            if (response) {
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
            }
        });
}

// route
const currentURL = window.location.href;
const route = () => {
    if (currentURL.includes("moodle.hku.hk/course/view.php") || (currentURL.includes("https://moodle.hku.hk/mod/") && currentURL.includes("view.php"))) {
        // 课程页面
        CourePage_handler();
    } else if (currentURL.includes("moodle.hku.hk/my/courses.php")) {
        // my courses
        CourseList_handler();
    } else if (currentURL == "https://moodle.hku.hk/") {
        // 主页
        get_psb();
        initialize();
        popupOnStart();
    }
};

route();

chrome.storage.sync.get(["course_code_list"], (data) => {
    var pop = false
    if (!data.course_code_list) {
        pop = true
    }
    var courseCodeList = window.courseType.courseCodeListFromStorage(
        data.course_code_list
    );
    var courses = courseCodeList.getAllCourses();
    if (courses.length == 0) {
        pop = true
    }
    if (pop) {
        window.navigatorUtils.customizeCenter({
            style: {
                visibility: "visible",
                opacity: "1",
            },
            // emoji warning
            innerText: "📚",
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
        });
    }
});