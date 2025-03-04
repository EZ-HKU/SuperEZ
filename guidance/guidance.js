const steps = document.querySelectorAll('.step-card');
const nextButtons = document.querySelectorAll('.next-btn');
let currentStep = 0;
const totalSteps = steps.length;

nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        steps[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        // if (index + 1 === totalSteps - 1) {
            
        // }
    });
});

const navigator = document.getElementById('ez-navigator');
navigator.addEventListener("mouseover", () => {
    steps[1].scrollIntoView({ behavior: 'smooth', block: 'center' });
}, { once: true });

const jumpBtns = document.querySelectorAll('.jump-btn');
jumpBtns[0].addEventListener('click', () => {
    window.open('https://moodle.hku.hk/', '_blank');
});

jumpBtns[1].addEventListener('click', () => {
    window.open('https://sis-eportal.hku.hk/psp/ptlprod/EMPLOYEE/EMPL/h/?tab=DEFAULT', '_blank');
});

