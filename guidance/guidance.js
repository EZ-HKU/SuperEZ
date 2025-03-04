const steps = document.querySelectorAll('.step-card');
const nextButtons = document.querySelectorAll('.next-btn');
let currentStep = 0;
const totalSteps = steps.length;

nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (index >= totalSteps - 1) {
            // continue
        } else {
            steps[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

const navigator = document.getElementById('ez-navigator');
navigator.addEventListener("mouseover", () => {
    steps[1].scrollIntoView({ behavior: 'smooth', block: 'center' });
});