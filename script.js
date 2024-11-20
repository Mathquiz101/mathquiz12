const questions = [
    {
        question: "What is the sum of the interior angles of a hexagon?",
        options: ["720°", "540°", "360°", "1080°"],
        correct: 0
    },
    {
        question: "What is the formula for the sum of the interior angles of an n-sided polygon?",
        options: ["(n - 2) × 180°", "(n × 180°) / 2", "(n - 1) × 180°", "(n - 2) × 360°"],
        correct: 0
    },
    {
        question: "What is the measure of each exterior angle of a regular pentagon?",
        options: ["72°", "108°", "60°", "90°"],
        correct: 0
    },
    {
        question: "The opposite angles of a cyclic quadrilateral sum up to:",
        options: ["180°", "90°", "360°", "120°"],
        correct: 0
    },
    {
        question: "What is the relationship between the angle subtended by an arc at the center of a circle and at any point on the circumference?",
        options: [
            "The angle at the center is twice the angle at the circumference",
            "The angles are equal",
            "The angle at the center is half the angle at the circumference",
            "The angle at the circumference is always 90°"
        ],
        correct: 0
    },
    {
        question: "A tangent to a circle is:",
        options: [
            "A line that touches the circle at exactly one point",
            "A line that passes through the circle",
            "A line that intersects the circle at two points",
            "A line that is parallel to the radius"
        ],
        correct: 0
    },
    {
        question: "What is the sum of the exterior angles of any polygon?",
        options: ["360°", "180°", "540°", "720°"],
        correct: 0
    },
    {
        question: "In a circle, the angle in a semicircle is always:",
        options: ["90°", "180°", "60°", "120°"],
        correct: 0
    },
    {
        question: "If two chords in a circle are equal, what can be said about their corresponding arcs?",
        options: [
            "The arcs are equal",
            "The arcs are different",
            "One arc is twice the other",
            "The arcs subtend different angles at the center"
        ],
        correct: 0
    },
    {
        question: "What is the relationship between a radius and a tangent at the point of contact?",
        options: [
            "The radius is perpendicular to the tangent",
            "The radius is parallel to the tangent",
            "The radius is equal in length to the tangent",
            "The radius and tangent do not intersect"
        ],
        correct: 0
    }
];


let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let quizEnded = false;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timerEl = document.querySelector('.timer');
const progressBar = document.querySelector('.progress');
const questionNumber = document.querySelector('.question-number');

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);

function startQuiz() {
    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    showQuestion();
    startTimer();
}

function startTimer() {
    timeLeft = 60;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    timerEl.classList.remove('warning');
    
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}s`;
        progressBar.style.width = `${(timeLeft/60) * 100}%`;
        
        if (timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSelectIncorrect();
        }
    }, 1000);
}

function autoSelectIncorrect() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.style.pointerEvents = 'none');
    options[questions[currentQuestion].correct].classList.add('correct');
    nextBtn.classList.remove('hide');
}

function showQuestion() {
    const question = questions[currentQuestion];
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionEl.textContent = question.question;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(index));
        optionsEl.appendChild(button);
    });

    progressBar.style.width = '100%';
}

function selectOption(index) {
    clearInterval(timer);
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    if (index === questions[currentQuestion].correct) {
        options[index].classList.add('correct');
        score++;
    } else {
        options[index].classList.add('incorrect');
        options[questions[currentQuestion].correct].classList.add('correct');
    }
    
    nextBtn.classList.remove('hide');
    options.forEach(option => option.style.pointerEvents = 'none');
}

function nextQuestion() {
    currentQuestion++;
    nextBtn.classList.add('hide');
    
    if (currentQuestion < questions.length) {
        showQuestion();
        startTimer();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timer);
    quizEnded = true;
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    
    const resultEl = document.querySelector('.result');
    const percentage = (score / questions.length) * 100;
    
    resultEl.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your score: ${score} out of ${questions.length}</p>
        <p>Percentage: ${percentage}%</p>
        <p>Performance Rating: ${getPerformanceRating(percentage)}</p>
    `;

    // Show next level link if score is above 50%
    if (percentage > 50) {
        const nextLevelContainer = document.getElementById('next-level-container');
        const nextLevelLink = document.getElementById('next-level-link');
        const link = 'https://waecmathsuccess.github.io/mathlevel2/';
        
        nextLevelLink.href = link;
        nextLevelLink.textContent = link;
        nextLevelContainer.classList.remove('hide');
        
        // Add celebration animation
        nextLevelContainer.classList.add('celebration');
        setTimeout(() => {
            nextLevelContainer.classList.remove('celebration');
        }, 1000);
    }
}

function getPerformanceRating(percentage) {
    if (percentage >= 90) return "Outstanding! 🏆";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 70) return "Good Job! 👍";
    if (percentage >= 60) return "Keep Practicing! 📚";
    return "Need More Practice 💪";
}

function copyLink() {
    const link = document.getElementById('next-level-link').href;
    navigator.clipboard.writeText(link).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
            copyBtn.style.backgroundColor = '#2ecc71';
        }, 2000);
    });
}
