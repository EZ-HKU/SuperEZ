if (!window) {
    var window = {};
}

window.courseType = {};

window.courseType.Course = function(title, code, detail, url) {
    this.title = title;
    this.code = code;
    this.detail = detail;
    this.url = url;
}


window.courseType.CourseList = function() {
    this.courses = [];
}

window.courseType.CourseList.prototype.addCourse = function(course) {
    this.courses.push(course);
};

window.courseType.CourseList.prototype.findCourseByCode = function (code) {
    return this.courses.find(function (course) {
        return course.code === code;
    });
};

window.courseType.CourseList.prototype.findCourseByTitle = function (title) {
    return this.courses.find(function (course) {
        return course.title === title;
    });
};

window.courseType.CourseList.prototype.deleteCourseByCode = function (code) {
    this.courses = this.courses.filter(function (course) {
        return course.code !== code;
    });
};

window.courseType.CourseList.prototype.deleteCourseByTitle = function (title) {
    this.courses = this.courses.filter(function (course) {
        return course.title !== title;
    });
};

window.courseType.CoursesWithSameCode = function(code, courses) {
    this.code = code;
    this.courses = courses;
}

window.courseType.CourseCodeList = function() {
    this.courseCodes = [];
}

window.courseType.CourseCodeList.prototype.addCourse = function (course) {
    var tempList = this.findCoursesByCode(course.code);
    if (tempList) {
        this.courseCodes.forEach(function (courseCode) {
            if (courseCode.code === course.code) {
                courseCode.courses.addCourse(course);
            }
        });

    } else {
        var newCourseList = new window.courseType.CourseList();
        newCourseList.addCourse(course);
        var newCourseCode = new window.courseType.CoursesWithSameCode(course.code, newCourseList);
        this.courseCodes.push(newCourseCode);
    }
};

window.courseType.CourseCodeList.prototype.getAllCourses = function () {
    var courses = [];
    this.courseCodes.forEach(function (courseCode) {
        courses = courses.concat(courseCode.courses.courses);
    });
    return courses;
}

window.courseType.CourseCodeList.prototype.findCoursesByCode = function (code) {
    var courseCode = this.findCourseByCode(code);
    return courseCode ? courseCode.courses.courses : null;
};

window.courseType.CourseCodeList.prototype.findCourseByTitle = function (title) {
    for (var i = 0; i < this.courseCodes.length; i++) {
        var course = this.courseCodes[i].courses.findCourseByTitle(title);
        if (course) {
            return course;
        }
    }
    return null;
};

window.courseType.CourseCodeList.prototype.findCourseByCode = function (code) {
    return this.courseCodes.find(function (courseCode) {
        return courseCode.code === code;
    });
};

window.courseType.CourseCodeList.prototype.removeCourseByTitle = function (title) {
    for (var i = 0; i < this.courseCodes.length; i++) {
        this.courseCodes[i].courses.deleteCourseByTitle(title);
    }
}

window.courseType.courseCodeListFromStorage = function (courseCodeList) {
    if (!courseCodeList) {
        return new window.courseType.CourseCodeList();
    }
    var newCourseCodeList = new window.courseType.CourseCodeList();
    courseCodeList.courseCodes.forEach(function (courseCode) {
        var newCourseList = new window.courseType.CourseList();
        courseCode.courses.courses.forEach(function (course) {
            newCourseList.addCourse(new window.courseType.Course(course.title, course.code, course.detail, course.url));
        });
        newCourseCodeList.courseCodes.push(new window.courseType.CoursesWithSameCode(courseCode.code, newCourseList));
    });
    return newCourseCodeList;
}