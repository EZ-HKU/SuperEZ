importScripts("moodle/js/courseType.js");

chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.storage.sync.get(["course_code_list"], (data) => {
        if (data.course_code_list) {
            var course_code_list = window.courseType.courseCodeListFromStorage(data.course_code_list);
            var courses = course_code_list.getAllCourses();
            for (let course of courses) {
                var upper = course.title.toUpperCase();
                if (upper.includes(text.toUpperCase())) {
                    chrome.tabs.create({ url: course.url });
                    return;
                }
            }
        }
    });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    chrome.storage.sync.get(["course_code_list"], (data) => {
        if (data.course_code_list) {
            var course_code_list = window.courseType.courseCodeListFromStorage(data.course_code_list);
            var courses = course_code_list.getAllCourses();
            const suggestions = [];
            courses.forEach(function (course) {
                var upper = course.title.toUpperCase();
                if (upper.includes(text.toUpperCase())) {
                    suggestions.push({ content: course.code, description: course.title });
                }
            });
            suggest(suggestions);
        }
    });
});


// chrome.runtime.onInstalled.addListener(() => {
//     chrome.windows.create({
//       url: '../tip.html',
//       type: 'popup',
//       width: 800,
//       height: 600,
//       left: 400, 
//       top: 100
//     });
//   });

