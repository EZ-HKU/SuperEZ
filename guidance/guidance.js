// 多语言支持：动态加载语言包
async function loadLocaleMessages() {
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    let locale = 'en';
    if (lang.startsWith('zh')) {
        locale = 'zh-CN';
    }
    let messages;
    try {
        const res = await fetch(`../langs/${locale}.json`);
        messages = await res.json();
    } catch (e) {
        // fallback to en
        const res = await fetch(`../langs/en.json`);
        messages = await res.json();
    }
    return messages;
}

async function renderGuidancePage() {
    const messages = await loadLocaleMessages();
    // step 1
    const step1 = window.elements.Div({ className: 'step-card' }, [
        window.elements.Div({ style: { textAlign: 'right', paddingRight: '40px' } }, [
            window.elements.Image({ src: '../images/ez.png', alt: '', style : {width: '100px' } })
        ]),
        window.elements.H1({}, [window.elements.Text(messages.guide_welcome_title)]),
        window.elements.P({}, [window.elements.Text(messages.guide_welcome_desc1)]),
        window.elements.P({}, [window.elements.Text(messages.guide_welcome_desc2)]),
    ]);

    // step 2
    const step2 = window.elements.Div({ className: 'step-card' }, [
        window.elements.H1({}, [window.elements.Text(messages.guide_login_title)]),
        window.elements.P({}, [window.elements.Text(messages.guide_login_desc1)]),
        window.elements.P({}, [window.elements.Text(messages.guide_login_desc2)]),
        window.elements.P({}, [window.elements.Text(messages.guide_login_desc3)]),
        window.elements.Div({ className: 'ez-guidance-tip' }, [window.elements.Text(messages.guide_login_tip1)]),
        window.elements.Div({ className: 'ez-guidance-tip' }, [window.elements.Text(messages.guide_login_tip2)]),
    ]);

    // step 3
    const step3 = window.elements.Div({ className: 'step-card' }, [
        window.elements.H1({}, [window.elements.Text(messages.guide_moodle_title)]),
        window.elements.P({}, [window.elements.Text(messages.guide_moodle_desc1)]),
        window.elements.P({}, [window.elements.Text(messages.guide_moodle_desc2)]),
        window.elements.P({}, [window.elements.Text(messages.guide_moodle_desc3)]),
        window.elements.Div({ className: 'ez-guidance-tip' }, [
            window.elements.Text(messages.guide_moodle_tip1)
        ]),
        window.elements.Div({ className: 'ez-guidance-tip' }, [
            window.elements.Text(messages.guide_moodle_tip2),
            window.elements.A({ href: 'https://github.com/EZ-HKU/SuperEZ/wiki', style: { marginLeft: '4px' } }, [window.elements.Text('GitHub Wiki')])
        ]),
        window.elements.Button({ className: 'next-btn', style: { opacity: 0 } }, [window.elements.Text(messages.guide_next_btn)]),
    ]);

    // guide-wrapper
    const wrapper = window.elements.Div({ className: 'guide-wrapper' }, [step1, step2, step3]);
    // guide-container
    const container = window.elements.Div({ className: 'guide-container' }, [wrapper]);

    // 清空 body 并插入
    document.body.innerHTML = '';
    document.body.appendChild(container);

    const steps = document.querySelectorAll('.step-card');
    const nextButtons = document.querySelectorAll('.next-btn');
    let currentStep = 0;
    const totalSteps = steps.length;

    nextButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            steps[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    const navigator = document.getElementById('ez-navigator');
    if (navigator) {
        navigator.addEventListener("mouseover", () => {
            steps[1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, { once: true });
    }
}

// 页面加载后渲染
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGuidancePage);
} else {
    renderGuidancePage();
}

