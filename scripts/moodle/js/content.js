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
            startYear = year - 1;
            endYear = year;
        } else {
            startYear = year;
            endYear = year + 1;
        }
        let yearRange = `${startYear}-${endYear.toString().slice(-2)}`;
        console.log({ yearRange });
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
                        .textContent.substring(19);
                    console.log(i.parentNode.querySelector(".sr-only"));
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

function jumpToExamBase() {
    const className = document.querySelector(".h2.mb-0").textContent.substring(0, 8);

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const jumpTabFixed = document.createElement("li");
    jumpTabFixed.classList.add("nav-item");
    jumpTabFixed.id = "jump-to-exam-base-fixed";
    
    const jumpTabFixedInner = document.createElement("a");
    jumpTabFixedInner.innerText = "Exam Base";
    jumpTabFixedInner.classList.add("nav-link");
    jumpTabFixed.appendChild(jumpTabFixedInner);

    jumpTabFixed.addEventListener("click", () => {
        window.open(
            "https://exambase-lib-hku-hk.eproxy.lib.hku.hk/exhibits/show/exam/home?the_key=" + className + "&the_field=crs&fromYear=" + (year - 10).toString() + "&toYear=" + year.toString() + "&the_sem1=on&the_sem2=on&the_ptype1=on&the_ptype2=on&the_no_result=20&the_sort=t",
            "_blank");
    });

    const navTabs = document.querySelectorAll("[id*='nav-tabs']")[0];
    navTabs.appendChild(jumpTabFixed);

    const jumpTab = document.createElement("div");
    jumpTab.id = "jump-to-exam-base";
    jumpTab.style.display = "none";
    jumpTab.style.position = "fixed";
    jumpTab.style.left = "50vw";
    jumpTab.style.top = "30vh";
    jumpTab.style.cursor = "pointer";
    jumpTab.style.transition = "all 0.2s, filter 0.2s";
    jumpTab.style.zIndex = 9999;
    jumpTab.innerText = "✨ Exam Base ✨";

    let fly = true;
    jumpTab.addEventListener("click", () => {
        const fixedRect = jumpTabFixed.getBoundingClientRect();
        const jumpTabRect = jumpTab.getBoundingClientRect();
        fly = false;
        jumpTab.style.left = `${fixedRect.left + fixedRect.width / 2 - jumpTabRect.width / 2}px`;
        jumpTab.style.top = `${fixedRect.top + fixedRect.height / 2 - jumpTabRect.height / 2}px`;
        jumpTab.style.transition = "all 1s ease-in-out";
        setTimeout(() => {
            jumpTab.style.opacity = "0";
            jumpTabFixed.style.opacity = "1";
        }, 1000);
        setTimeout(() => {
        jumpTab.style.display = "none";
        window.open(
            "https://exambase-lib-hku-hk.eproxy.lib.hku.hk/exhibits/show/exam/home?the_key=" + className + "&the_field=crs&fromYear=" + (year - 10).toString() + "&toYear=" + year.toString() + "&the_sem1=on&the_sem2=on&the_ptype1=on&the_ptype2=on&the_no_result=20&the_sort=t",
            "_blank");
        }, 2000);
        chrome.storage.sync.set({ ExamBaseFly: false });
    });

    const style = document.createElement('style');
    style.textContent = `
            #jump-to-exam-base {
                position: relative;
                font-weight: bold !important;
                background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
                background-size: 400% 400%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: rainbow 3s ease infinite, pulse 1.5s infinite alternate;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            }
            #jump-to-exam-base::before {
                content: "";
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border-radius: 5px;
                background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
                background-size: 400% 400%;
                z-index: -1;
                filter: blur(8px);
                animation: rainbow 3s ease infinite;
                opacity: 0.7;
            }
            #jump-to-exam-base {
                position: fixed !important;
                transform: scale(1.1);
                z-index: 9999;
                margin: 0 5px;
                pointer-events: auto;
            }
            @keyframes rainbow {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
        `;
    document.head.appendChild(style);
    document.body.appendChild(jumpTab);

    // 随机飘动动画
    let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let pos = { x: vw / 2, y: vh / 3 };
    let dx = (0.5 + 0.5 * Math.random()) * 10;
    let dy = (0.5 + 0.5 * Math.random()) * 10;
    let benchmark = { x: dx, y: dy };
    console.log({ benchmark });

    window.addEventListener('resize', () => {
        vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    });

    setInterval(() => {
        if (fly) {
            var rect = jumpTab.getBoundingClientRect();
            pos.x += dx;
            pos.y += dy;
            if (pos.x < 0 || pos.x > vw - rect.width) {
                dx = -dx;
                pos.x = Math.max(0, Math.min(pos.x, vw - rect.width));
            }
            if (pos.y < 0 || pos.y > vh - rect.height) {
                dy = -dy;
                pos.y = Math.max(0, Math.min(pos.y, vh - rect.height));
            }
            dx = Math.abs(dx) > Math.abs(benchmark.x) ? dx * 0.8 : dx;
            dy = Math.abs(dy) > Math.abs(benchmark.y) ? dy * 0.8 : dy;

            jumpTab.style.left = pos.x + "px";
            jumpTab.style.top = pos.y + "px";
        }
    }, 50);

    var maxSpeed = 30;
    document.addEventListener('mousemove', (e) => {
        var rect = jumpTab.getBoundingClientRect();
        if (Math.abs(e.clientX - (rect.left + rect.width / 2)) + Math.abs(e.clientY - (rect.top + rect.height / 2)) < 150) {
            let deltaX = e.clientX - (rect.left + rect.width / 2);
            let deltaY = e.clientY - (rect.top + rect.height / 2);
            if (deltaX !== 0) {
                dx = dx + -1 / deltaX * 150;
            }
            if (deltaY !== 0) {
                dy = dy + -1 / deltaY * 150;
            }
            dx = Math.max(-maxSpeed, Math.min(dx, maxSpeed));
            dy = Math.max(-maxSpeed, Math.min(dy, maxSpeed));
        }
    });


    // 悬停时变大旋转
    jumpTab.addEventListener('mouseenter', () => {
        jumpTab.style.transform = 'scale(1.3) rotate(-10deg)';
        jumpTab.style.filter = 'brightness(1.5)';
    });
    jumpTab.addEventListener('mouseleave', () => {
        jumpTab.style.transform = 'scale(1.1)';
        jumpTab.style.filter = '';
    });

    chrome.storage.sync.get(["ExamBaseFly"], (data) => {
        if (data.ExamBaseFly) {
            jumpTabFixed.style.opacity = "0";
            jumpTab.style.display = "block";
            fly = true;
        } else {
            jumpTabFixed.style.opacity = "1";
            jumpTab.style.display = "none";
            fly = false;
        }
    });
}

function popupOnStart() {
    chrome.runtime
        .sendMessage({
            type: "GET_OPEN_POPUP_ON_MOODLE_START",
        })
        .then(async (response) => {
            if (response) {
                window.utils.setPopup(await window.popup.MoodlePopup());
            }
        });
}

// route
const currentURL = window.location.href;
const route = () => {
    if (currentURL.includes("moodle.hku.hk/course/view.php") || (currentURL.includes("https://moodle.hku.hk/mod/") && currentURL.includes("view.php"))) {
        // 课程页面
        CourePage_handler();
        jumpToExamBase();
    } else if (currentURL.includes("moodle.hku.hk/my/courses.php")) {
        // my courses
        CourseList_handler();
    } else if (currentURL == "https://moodle.hku.hk/") {
        // 主页
        // check if login
        const login = document.getElementById("frontpage-course-list");
        if (!login) {
            return;
        }
        get_psb();
        initialize();
        popupOnStart();
    };

    if (currentURL.includes("https://moodle.hku.hk/course/view.php?id=")) {
        window.navigatorUtils.customizeCenter({
            style: {
                // backgroundColor: "#87CEEB",
                visibility: "visible",
                opacity: "1 ",
            },
            // save file emoji
            innerText: "📥",
            onClick: async function () {
                window.utils.setPopup(await window.popup.SuperLoadPopup(),
                    {
                        container: {
                            style: {
                                width: "500px",
                                flexDirection: "column",
                                maxHeight: "80%",
                                justifyContent: "none",
                                alignItems: "none",
                                textAlign: "left",
                                position: "relative",
                            },
                        },
                    }
                );
            },
        });
    }
};

route();

window.utils.setMoodleNotification();