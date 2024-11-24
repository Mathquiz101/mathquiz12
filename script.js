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
    const premiumProduct = document.getElementById('premium-product');
    const congratsMessage = document.getElementById('congrats-message');
    
    // Basic result display
    resultEl.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your score: ${score} out of ${questions.length}</p>
        <p>Percentage: ${percentage}%</p>
        <p>Performance Rating: ${getPerformanceRating(percentage)}</p>
    `;

    // Show premium content only if score is above 50%
    if (percentage >= 50) {
        congratsMessage.classList.remove('hide');
        congratsMessage.innerHTML = `
            <div class="success-message">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You've successfully passed the quiz and unlocked access to our Premium Mathematics Learning Package!</p>
                <div class="special-offer">
                    <h3>🌟 Special Limited Time Offer 🌟</h3>
                    <p>Get lifetime access to our Premium Package for just</p>
                    <div class="price-display">
                        <span class="original-price">$149.99</span>
                        <span class="current-price">$99.99</span>
                    </div>
                    <p class="urgency-message">⚡ Hurry! This offer expires in 6 days ⚡</p>
                </div>
            </div>
        `;
        premiumProduct.classList.remove('hide');
    } else {
        congratsMessage.innerHTML = `
            <div class="retry-message">
                <h2>Keep Going!</h2>
                <p>Score 50% or higher to unlock our Premium Mathematics Learning Package.</p>
                <p>Feel free to try again!</p>
            </div>
        `;
        congratsMessage.classList.remove('hide');
        premiumProduct.classList.add('hide');
    }
}

function getPerformanceRating(percentage) {
    if (percentage >= 90) return "Outstanding! 🏆";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 70) return "Good Job! 👍";
    if (percentage >= 60) return "Keep Practicing! 📚";
    return "Need More Practice 💪";
}

// Button click handlers for premium product
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const message = 'Welcome to Premium Mathematics Learning! Complete your purchase to unlock all advanced features for $99.99';
        
        // Add click animation
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.transformOrigin = 'center';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = `${e.offsetX}px`;
        ripple.style.top = `${e.offsetY}px`;
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        alert(message);
    });
});

// Add hover effects to pricing cards
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});
