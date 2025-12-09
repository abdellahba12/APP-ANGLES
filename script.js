// Global Variables
let totalPoints = 0;
let currentFlashcardSet = [];
let currentCardIndex = 0;
let cardsStudied = 0;
let flashcardPoints = 0;

let quizQuestions = [];
let currentQuizQuestion = 0;
let quizScore = 0;
let userAnswers = [];

let treasures = [];
let currentRiddle = null;
let treasuresFound = 0;

let matchingPairs = [];
let selectedMatching = [];
let matchingScore = 0;
let matchingTimer = null;
let matchingSeconds = 0;

let timelineEvents = [];
let currentLevel = 1;
let droppedEvents = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    updateTotalPoints();
});

// Navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTotalPoints() {
    totalPoints = flashcardPoints + (quizScore * 20) + (treasuresFound * 50) + matchingScore;
    document.getElementById('total-points').textContent = `Total Points: ${totalPoints}`;
    document.getElementById('footer-points').textContent = `${totalPoints} points`;
}

// ============ FLASHCARDS ============
const flashcardSets = {
    republic: [
        { front: 'When was the Second Spanish Republic proclaimed?', back: 'April 14, 1931' },
        { front: 'Who was the first president of the Second Republic?', back: 'Niceto Alcalá-Zamora' },
        { front: 'What major reform did the Second Republic implement?', back: 'Land reform, education expansion, and regional autonomy' },
        { front: 'What was the "bienio negro" (black biennium)?', back: 'Period 1933-1935 when right-wing parties reversed reforms' },
        { front: 'What coalition won the 1936 elections?', back: 'The Popular Front (Frente Popular)' },
        { front: 'Who led the military uprising in 1936?', back: 'General Francisco Franco and other military leaders' },
        { front: 'What was the Constitution of 1931?', back: 'Democratic constitution establishing Spain as a republic' },
        { front: 'What happened to the monarchy in 1931?', back: 'King Alfonso XIII went into exile' }
    ],
    civilwar: [
        { front: 'When did the Spanish Civil War begin?', back: 'July 17, 1936' },
        { front: 'When did the Spanish Civil War end?', back: 'April 1, 1939' },
        { front: 'What were the two sides called?', back: 'Republicans (loyalists) vs. Nationalists (rebels)' },
        { front: 'Which countries supported the Nationalists?', back: 'Nazi Germany and Fascist Italy' },
        { front: 'Which countries supported the Republicans?', back: 'Soviet Union and International Brigades' },
        { front: 'What was Guernica?', back: 'Basque town bombed by German planes in 1937' },
        { front: 'What was the Battle of the Ebro?', back: 'Last major Republican offensive (July-November 1938)' },
        { front: 'How many people died in the Civil War?', back: 'Estimates range from 500,000 to 1 million' }
    ],
    francoism: [
        { front: 'When did Franco\'s dictatorship begin?', back: '1939' },
        { front: 'When did Franco die?', back: 'November 20, 1975' },
        { front: 'What was "autarky"?', back: 'Economic policy of self-sufficiency in the 1940s-50s' },
        { front: 'What were the "years of hunger"?', back: '1940s period of severe economic hardship and repression' },
        { front: 'What was the "Spanish Miracle"?', back: 'Economic boom of the 1960s' },
        { front: 'What was the role of the Catholic Church?', back: 'Major supporter of Franco\'s regime, controlled education' },
        { front: 'What was ETA?', back: 'Basque separatist armed group founded in 1959' },
        { front: 'What was the "Law of Succession" (1947)?', back: 'Made Spain a kingdom with Franco as regent for life' }
    ],
    transition: [
        { front: 'When did the democratic transition begin?', back: '1975, after Franco\'s death' },
        { front: 'Who became king after Franco?', back: 'Juan Carlos I' },
        { front: 'Who was the first prime minister of democracy?', back: 'Adolfo Suárez' },
        { front: 'When was the Spanish Constitution approved?', back: 'December 6, 1978' },
        { front: 'What was the "Pact of Forgetting"?', back: 'Informal agreement to avoid discussing Civil War and dictatorship' },
        { front: 'What was the coup attempt of 1981?', back: '23-F: Failed military coup led by Antonio Tejero' },
        { front: 'When did Spain join the European Union?', back: '1986' },
        { front: 'What political system was established?', back: 'Parliamentary monarchy with autonomous communities' }
    ]
};

function loadFlashcardSet(setName) {
    currentFlashcardSet = flashcardSets[setName];
    currentCardIndex = 0;
    displayFlashcard();
    updateCardCounter();
}

function displayFlashcard() {
    if (currentFlashcardSet.length === 0) return;
    
    const flashcard = document.getElementById('flashcard');
    const card = currentFlashcardSet[currentCardIndex];
    
    flashcard.classList.remove('flipped');
    
    const front = flashcard.querySelector('.flashcard-front p');
    const back = flashcard.querySelector('.flashcard-back p');
    
    front.textContent = card.front;
    back.textContent = card.back;
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

function nextCard() {
    if (currentFlashcardSet.length === 0) return;
    
    currentCardIndex = (currentCardIndex + 1) % currentFlashcardSet.length;
    displayFlashcard();
    updateCardCounter();
}

function previousCard() {
    if (currentFlashcardSet.length === 0) return;
    
    currentCardIndex = currentCardIndex - 1;
    if (currentCardIndex < 0) {
        currentCardIndex = currentFlashcardSet.length - 1;
    }
    displayFlashcard();
    updateCardCounter();
}

function updateCardCounter() {
    const counter = document.getElementById('card-counter');
    if (currentFlashcardSet.length > 0) {
        counter.textContent = `${currentCardIndex + 1} / ${currentFlashcardSet.length}`;
    } else {
        counter.textContent = '0 / 0';
    }
}

function markAsLearned() {
    if (currentFlashcardSet.length === 0) {
        alert('Please select a topic first!');
        return;
    }
    
    cardsStudied++;
    flashcardPoints += 10;
    
    document.getElementById('cards-studied').textContent = cardsStudied;
    document.getElementById('flashcard-points').textContent = flashcardPoints;
    updateTotalPoints();
    
    // Show celebration
    const btn = document.querySelector('.learned-btn');
    btn.textContent = '✓ Great! +10 pts';
    setTimeout(() => {
        btn.textContent = '✓ I know this! (+10 pts)';
    }, 1000);
    
    // Move to next card
    nextCard();
}

// ============ QUIZ ============
const allQuizQuestions = {
    easy: [
        {
            question: 'When was the Second Spanish Republic proclaimed?',
            options: ['1929', '1931', '1936', '1939'],
            correct: 1
        },
        {
            question: 'When did the Spanish Civil War begin?',
            options: ['1931', '1934', '1936', '1939'],
            correct: 2
        },
        {
            question: 'Who was the dictator of Spain from 1939-1975?',
            options: ['Franco', 'Primo de Rivera', 'Alfonso XIII', 'Juan Carlos'],
            correct: 0
        },
        {
            question: 'When did Franco die?',
            options: ['1970', '1973', '1975', '1978'],
            correct: 2
        },
        {
            question: 'When was the Spanish Constitution approved?',
            options: ['1975', '1976', '1977', '1978'],
            correct: 3
        }
    ],
    medium: [
        {
            question: 'What was the "Popular Front"?',
            options: ['A fascist organization', 'A left-wing electoral coalition', 'A military alliance', 'A labor union'],
            correct: 1
        },
        {
            question: 'Which town was bombed in 1937, inspiring Picasso\'s famous painting?',
            options: ['Madrid', 'Barcelona', 'Guernica', 'Valencia'],
            correct: 2
        },
        {
            question: 'What was Franco\'s economic policy in the 1940s-50s?',
            options: ['Free market', 'Autarky', 'Communism', 'Mixed economy'],
            correct: 1
        },
        {
            question: 'What was the failed coup attempt in 1981 called?',
            options: ['18-J', '23-F', '14-A', '20-N'],
            correct: 1
        },
        {
            question: 'Who was the first democratic Prime Minister after Franco?',
            options: ['Felipe González', 'Adolfo Suárez', 'Santiago Carrillo', 'Leopoldo Calvo-Sotelo'],
            correct: 1
        },
        {
            question: 'When did Spain join the European Union?',
            options: ['1981', '1986', '1992', '1995'],
            correct: 1
        },
        {
            question: 'What was the "bienio negro"?',
            options: ['1933-1935 right-wing period', '1936-1939 Civil War', '1940-1942 hunger years', '1975-1977 transition'],
            correct: 0
        },
        {
            question: 'Who was the first president of the Second Republic?',
            options: ['Manuel Azaña', 'Niceto Alcalá-Zamora', 'Alejandro Lerroux', 'Francisco Largo Caballero'],
            correct: 1
        },
        {
            question: 'What countries supported Franco during the Civil War?',
            options: ['France and Britain', 'USA and USSR', 'Germany and Italy', 'Portugal and Morocco'],
            correct: 2
        },
        {
            question: 'What was ETA?',
            options: ['A political party', 'A labor union', 'A Basque separatist group', 'An economic plan'],
            correct: 2
        }
    ],
    hard: [
        {
            question: 'What was the "Law of Political Responsibilities" (1939)?',
            options: ['Granted amnesty to Republicans', 'Punished anti-Franco activities since 1934', 'Established local governments', 'Reformed the education system'],
            correct: 1
        },
        {
            question: 'What was the "Spanish Miracle"?',
            options: ['Military victory', 'Religious event', 'Economic boom of 1960s', 'Political reform'],
            correct: 2
        },
        {
            question: 'Who were the "maquis"?',
            options: ['Pro-Franco militia', 'Anti-Franco guerrillas', 'Foreign diplomats', 'Religious leaders'],
            correct: 1
        },
        {
            question: 'What was the "Pact of Moncloa" (1977)?',
            options: ['Peace treaty with ETA', 'Economic and political agreements', 'Regional autonomy law', 'Education reform'],
            correct: 1
        },
        {
            question: 'What was the last major battle of the Civil War?',
            options: ['Battle of Madrid', 'Battle of the Ebro', 'Battle of Barcelona', 'Battle of Valencia'],
            correct: 1
        },
        {
            question: 'What was the "Stabilization Plan" of 1959?',
            options: ['Military reform', 'Economic liberalization', 'Political transition', 'Educational change'],
            correct: 1
        },
        {
            question: 'Who led the coup attempt on February 23, 1981?',
            options: ['Antonio Tejero', 'Alfonso Armada', 'Jaime Milans del Bosch', 'All of the above'],
            correct: 3
        },
        {
            question: 'What was the "Law of Succession" (1947)?',
            options: ['Established democracy', 'Made Spain a kingdom with Franco as regent', 'Gave power to parliament', 'Ended the monarchy'],
            correct: 1
        },
        {
            question: 'What was the "May Days" (1937)?',
            options: ['Nationalist offensive', 'Republican infighting in Barcelona', 'International aid arrival', 'Peace negotiations'],
            correct: 1
        },
        {
            question: 'Who was Manuel Azaña?',
            options: ['Nationalist general', 'Republican president', 'Monarchist leader', 'Communist organizer'],
            correct: 1
        },
        {
            question: 'What was the "National Movement"?',
            options: ['Republican coalition', 'Franco\'s single party', 'Labor organization', 'Student group'],
            correct: 1
        },
        {
            question: 'What was the role of the International Brigades?',
            options: ['Supported Franco', 'Supported Republicans', 'Stayed neutral', 'Mediated peace'],
            correct: 1
        },
        {
            question: 'What was the "Organic Law of the State" (1967)?',
            options: ['Established democracy', 'Modified Franco\'s dictatorship', 'Created autonomous regions', 'Ended censorship'],
            correct: 1
        },
        {
            question: 'Who was Dolores Ibárruri "La Pasionaria"?',
            options: ['Monarchist leader', 'Communist Republican leader', 'Nationalist organizer', 'Neutral diplomat'],
            correct: 1
        },
        {
            question: 'What was the "Pact of Forgetting"?',
            options: ['Amnesty law', 'Informal agreement to avoid discussing past', 'Education reform', 'Economic policy'],
            correct: 1
        }
    ]
};

function startQuiz(difficulty) {
    quizQuestions = [...allQuizQuestions[difficulty]];
    currentQuizQuestion = 0;
    quizScore = 0;
    userAnswers = [];
    
    displayQuizQuestion();
}

function displayQuizQuestion() {
    const container = document.getElementById('quiz-container');
    const question = quizQuestions[currentQuizQuestion];
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <div class="quiz-option" onclick="selectAnswer(${index})">
                ${option}
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="quiz-question">
            <h3>Question ${currentQuizQuestion + 1} of ${quizQuestions.length}</h3>
            <p>${question.question}</p>
        </div>
        <div class="quiz-options">
            ${optionsHTML}
        </div>
        <div class="quiz-navigation">
            <button class="quiz-nav-btn" onclick="previousQuestion()" ${currentQuizQuestion === 0 ? 'disabled' : ''}>
                ⬅️ Previous
            </button>
            <button class="quiz-nav-btn" onclick="checkAnswer()">
                ${currentQuizQuestion === quizQuestions.length - 1 ? 'Finish Quiz ✓' : 'Next Question ➡️'}
            </button>
        </div>
    `;
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    options[index].classList.add('selected');
    userAnswers[currentQuizQuestion] = index;
}

function checkAnswer() {
    const selectedAnswer = userAnswers[currentQuizQuestion];
    
    if (selectedAnswer === undefined) {
        alert('Please select an answer!');
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach((opt, index) => {
        if (index === question.correct) {
            opt.classList.add('correct');
        }
        if (index === selectedAnswer && selectedAnswer !== question.correct) {
            opt.classList.add('incorrect');
        }
    });
    
    if (selectedAnswer === question.correct) {
        quizScore++;
    }
    
    setTimeout(() => {
        if (currentQuizQuestion < quizQuestions.length - 1) {
            currentQuizQuestion++;
            displayQuizQuestion();
        } else {
            showQuizResults();
        }
    }, 1500);
}

function previousQuestion() {
    if (currentQuizQuestion > 0) {
        currentQuizQuestion--;
        displayQuizQuestion();
        
        if (userAnswers[currentQuizQuestion] !== undefined) {
            const options = document.querySelectorAll('.quiz-option');
            options[userAnswers[currentQuizQuestion]].classList.add('selected');
        }
    }
}

function showQuizResults() {
    const container = document.getElementById('quiz-container');
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    let feedback = '';
    let emoji = '';
    if (percentage >= 90) {
        feedback = 'Outstanding! You\'re a Spanish history expert!';
        emoji = '🏆';
    } else if (percentage >= 70) {
        feedback = 'Great job! You know your Spanish history well!';
        emoji = '🌟';
    } else if (percentage >= 50) {
        feedback = 'Good effort! Keep studying to improve!';
        emoji = '📚';
    } else {
        feedback = 'Keep learning! Review the materials and try again!';
        emoji = '💪';
    }
    
    updateTotalPoints();
    
    container.innerHTML = `
        <div class="quiz-results">
            <h3>${emoji} Quiz Complete! ${emoji}</h3>
            <div class="quiz-score">${quizScore} / ${quizQuestions.length}</div>
            <div class="quiz-feedback">
                <p><strong>Score:</strong> ${percentage}%</p>
                <p><strong>Points Earned:</strong> ${quizScore * 20}</p>
                <p>${feedback}</p>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                <button class="difficulty-btn easy" onclick="startQuiz('easy')">Try Easy</button>
                <button class="difficulty-btn medium" onclick="startQuiz('medium')">Try Medium</button>
                <button class="difficulty-btn hard" onclick="startQuiz('hard')">Try Hard</button>
            </div>
        </div>
    `;
}

// ============ TREASURE HUNT ============
const riddleData = [
    {
        riddle: 'In what year did the Republic begin? (Enter the year)',
        answer: '1931',
        treasure: '🗳️ Second Republic Proclamation'
    },
    {
        riddle: 'What city was bombed by Germans in 1937? (Hint: famous Picasso painting)',
        answer: 'guernica',
        treasure: '🎨 Guernica Memory'
    },
    {
        riddle: 'What was the dictator\'s last name? (1939-1975)',
        answer: 'franco',
        treasure: '⚔️ Dictatorship Era'
    },
    {
        riddle: 'In what year was the Constitution approved? (Four digits)',
        answer: '1978',
        treasure: '📜 Democratic Constitution'
    },
    {
        riddle: 'What failed coup happened on 23-F? (Year)',
        answer: '1981',
        treasure: '🎭 Democracy Saved'
    },
    {
        riddle: 'When did Spain join the EU? (Year)',
        answer: '1986',
        treasure: '🇪🇺 European Integration'
    }
];

function startTreasureHunt() {
    treasuresFound = 0;
    treasures = [...riddleData];
    currentRiddle = null;
    
    document.getElementById('treasures-count').textContent = '0/6';
    document.getElementById('treasure-list').innerHTML = '';
    document.getElementById('riddle-answer').value = '';
    
    // Create map
    const mapContainer = document.getElementById('treasure-map');
    mapContainer.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const spot = document.createElement('div');
        spot.className = 'treasure-spot';
        spot.textContent = '❓';
        spot.onclick = () => revealRiddle(i);
        spot.dataset.index = i;
        mapContainer.appendChild(spot);
    }
    
    // Distribute treasures randomly
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    shuffleArray(positions);
    
    treasures.forEach((treasure, index) => {
        treasure.position = positions[index];
    });
}

function revealRiddle(position) {
    const treasure = treasures.find(t => t.position === position && !t.found);
    
    if (treasure) {
        currentRiddle = treasure;
        document.getElementById('riddle-text').textContent = treasure.riddle;
        document.getElementById('riddle-answer').value = '';
        document.getElementById('riddle-answer').focus();
    } else {
        const spot = document.querySelector(`[data-index="${position}"]`);
        if (!spot.classList.contains('found')) {
            spot.classList.add('empty');
            spot.textContent = '❌';
            setTimeout(() => {
                spot.classList.remove('empty');
                spot.textContent = '❓';
            }, 1500);
        }
    }
}

function checkRiddleAnswer() {
    if (!currentRiddle) {
        alert('Click on a treasure spot first!');
        return;
    }
    
    const userAnswer = document.getElementById('riddle-answer').value.trim().toLowerCase();
    const correctAnswer = currentRiddle.answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        // Correct!
        currentRiddle.found = true;
        treasuresFound++;
        
        // Update map
        const spot = document.querySelector(`[data-index="${currentRiddle.position}"]`);
        spot.classList.add('found');
        spot.textContent = '💎';
        spot.onclick = null;
        
        // Add to treasure list
        const treasureList = document.getElementById('treasure-list');
        const treasureItem = document.createElement('div');
        treasureItem.className = 'treasure-item fade-in';
        treasureItem.textContent = currentRiddle.treasure;
        treasureList.appendChild(treasureItem);
        
        // Update counter
        document.getElementById('treasures-count').textContent = `${treasuresFound}/6`;
        
        // Update points
        updateTotalPoints();
        
        // Reset riddle
        document.getElementById('riddle-text').textContent = treasuresFound === 6 ? '🎉 All treasures found! You\'re a history master!' : 'Great! Find the next treasure!';
        document.getElementById('riddle-answer').value = '';
        currentRiddle = null;
        
        if (treasuresFound === 6) {
            alert(`🏆 Congratulations! You found all treasures and earned ${treasuresFound * 50} points!`);
        }
    } else {
        alert('❌ Incorrect! Try again!');
        document.getElementById('riddle-answer').value = '';
    }
}

// ============ MATCHING GAME ============
const matchingData = {
    dates: {
        left: ['1931', '1936', '1939', '1975', '1978', '1986'],
        right: ['Second Republic', 'Civil War begins', 'Franco\'s victory', 'Franco dies', 'Constitution', 'EU membership'],
        pairs: [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5]]
    },
    people: {
        left: ['Franco', 'Manuel Azaña', 'Dolores Ibárruri', 'Adolfo Suárez', 'Juan Carlos I', 'Antonio Tejero'],
        right: ['Dictator 1939-75', 'Republican President', '"La Pasionaria"', 'First PM of democracy', 'King after Franco', '23-F coup leader'],
        pairs: [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5]]
    },
    causes: {
        left: ['Economic crisis', 'Military coup 1936', 'Franco\'s death', 'Constitution 1978', 'Failed coup 23-F', 'Economic boom 1960s'],
        right: ['Second Republic', 'Civil War', 'Democratic transition', 'Consolidated democracy', 'Strengthened democracy', '"Spanish Miracle"'],
        pairs: [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5]]
    }
};

function startMatching(type) {
    const data = matchingData[type];
    matchingPairs = [];
    selectedMatching = [];
    matchingScore = 0;
    matchingSeconds = 0;
    
    // Start timer
    if (matchingTimer) clearInterval(matchingTimer);
    matchingTimer = setInterval(() => {
        matchingSeconds++;
        const minutes = Math.floor(matchingSeconds / 60);
        const seconds = matchingSeconds % 60;
        document.getElementById('matching-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Shuffle right column
    const leftItems = [...data.left];
    const rightItems = [...data.right];
    shuffleArray(rightItems);
    
    // Create game
    const container = document.getElementById('matching-game');
    container.innerHTML = `
        <div class="matching-grid">
            <div class="matching-column">
                <h4>Match these...</h4>
                <div id="left-items"></div>
            </div>
            <div class="matching-column">
                <h4>...with these</h4>
                <div id="right-items"></div>
            </div>
        </div>
    `;
    
    const leftContainer = document.getElementById('left-items');
    const rightContainer = document.getElementById('right-items');
    
    leftItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'matching-item';
        div.textContent = item;
        div.dataset.side = 'left';
        div.dataset.value = item;
        div.dataset.originalIndex = index;
        div.onclick = () => selectMatching(div, 'left', item, index);
        leftContainer.appendChild(div);
    });
    
    rightItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'matching-item';
        div.textContent = item;
        div.dataset.side = 'right';
        div.dataset.value = item;
        // Find original index
        const originalIndex = data.right.indexOf(item);
        div.dataset.originalIndex = originalIndex;
        div.onclick = () => selectMatching(div, 'right', item, originalIndex);
        rightContainer.appendChild(div);
    });
    
    document.getElementById('matches-made').textContent = '0';
    document.getElementById('matching-points').textContent = '0';
}

function selectMatching(element, side, value, originalIndex) {
    if (element.classList.contains('matched')) return;
    
    // If same side already selected, deselect
    if (selectedMatching.length > 0 && selectedMatching[0].side === side) {
        selectedMatching[0].element.classList.remove('selected');
        selectedMatching = [];
    }
    
    // Select
    if (selectedMatching.length === 0) {
        element.classList.add('selected');
        selectedMatching.push({ side, value, originalIndex, element });
    } else {
        // Check match
        const first = selectedMatching[0];
        
        if (first.originalIndex === originalIndex && first.side !== side) {
            // Correct match!
            element.classList.add('matched');
            first.element.classList.remove('selected');
            first.element.classList.add('matched');
            
            matchingScore += 15;
            const matchesMade = parseInt(document.getElementById('matches-made').textContent) + 1;
            document.getElementById('matches-made').textContent = matchesMade;
            document.getElementById('matching-points').textContent = matchingScore;
            updateTotalPoints();
            
            selectedMatching = [];
            
            // Check if all matched
            if (document.querySelectorAll('.matching-item.matched').length === 12) {
                clearInterval(matchingTimer);
                setTimeout(() => {
                    alert(`🎉 Perfect! You matched everything in ${formatTime(matchingSeconds)}!\nYou earned ${matchingScore} points!`);
                }, 500);
            }
        } else {
            // Wrong match
            element.classList.add('selected');
            setTimeout(() => {
                element.classList.remove('selected');
                first.element.classList.remove('selected');
                selectedMatching = [];
            }, 800);
        }
    }
}

// ============ TIMELINE CHALLENGE ============
const timelineData = {
    1: [
        { year: 1931, event: 'Second Republic proclaimed', order: 0 },
        { year: 1936, event: 'Civil War begins', order: 1 },
        { year: 1939, event: 'Franco\'s victory', order: 2 },
        { year: 1975, event: 'Franco dies', order: 3 }
    ],
    2: [
        { year: 1931, event: 'Second Republic', order: 0 },
        { year: 1933, event: 'Right-wing victory', order: 1 },
        { year: 1936, event: 'Popular Front wins', order: 2 },
        { year: 1936, event: 'Civil War starts', order: 3 },
        { year: 1939, event: 'War ends', order: 4 },
        { year: 1975, event: 'Franco dies', order: 5 }
    ],
    3: [
        { year: 1931, event: 'Republic proclaimed', order: 0 },
        { year: 1936, event: 'Civil War begins', order: 1 },
        { year: 1939, event: 'Nationalist victory', order: 2 },
        { year: 1959, event: 'Stabilization Plan', order: 3 },
        { year: 1975, event: 'Franco dies', order: 4 },
        { year: 1978, event: 'Constitution approved', order: 5 },
        { year: 1981, event: 'Coup attempt 23-F', order: 6 },
        { year: 1986, event: 'Spain joins EU', order: 7 }
    ]
};

function startTimeline(level) {
    currentLevel = level;
    timelineEvents = [...timelineData[level]];
    droppedEvents = [];
    
    // Shuffle events
    shuffleArray(timelineEvents);
    
    // Show play area
    document.querySelector('.level-selector').style.display = 'none';
    document.getElementById('timeline-container').classList.remove('hidden');
    
    // Create event cards
    const eventsContainer = document.getElementById('timeline-events');
    eventsContainer.innerHTML = '';
    
    timelineEvents.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'timeline-event-card';
        card.textContent = `${event.year}: ${event.event}`;
        card.draggable = true;
        card.dataset.order = event.order;
        card.dataset.index = index;
        
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
        
        eventsContainer.appendChild(card);
    });
    
    // Setup dropzone
    const dropzone = document.getElementById('timeline-dropzone');
    dropzone.innerHTML = '<div class="drop-placeholder">Drop events here in order</div>';
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const index = e.dataTransfer.getData('text/plain');
        const card = document.querySelector(`[data-index="${index}"]`);
        
        if (card) {
            // Remove placeholder if exists
            const placeholder = dropzone.querySelector('.drop-placeholder');
            if (placeholder) placeholder.remove();
            
            dropzone.appendChild(card);
            droppedEvents.push(timelineEvents[index]);
        }
    });
}

function checkTimelineOrder() {
    if (droppedEvents.length !== timelineEvents.length) {
        alert('Please arrange all events first!');
        return;
    }
    
    let correct = true;
    droppedEvents.forEach((event, index) => {
        if (event.order !== index) {
            correct = false;
        }
    });
    
    if (correct) {
        alert(`🎉 Perfect! You got the timeline right!\n+30 points!`);
        matchingScore += 30;
        updateTotalPoints();
        resetTimeline();
        document.querySelector('.level-selector').style.display = 'block';
        document.getElementById('timeline-container').classList.add('hidden');
    } else {
        alert('❌ Not quite right. Try again!');
    }
}

function resetTimeline() {
    droppedEvents = [];
    startTimeline(currentLevel);
}

// ============ UTILITY FUNCTIONS ============
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Make functions global
window.showSection = showSection;
window.loadFlashcardSet = loadFlashcardSet;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.previousCard = previousCard;
window.markAsLearned = markAsLearned;
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.checkAnswer = checkAnswer;
window.previousQuestion = previousQuestion;
window.startTreasureHunt = startTreasureHunt;
window.checkRiddleAnswer = checkRiddleAnswer;
window.startMatching = startMatching;
window.startTimeline = startTimeline;
window.checkTimelineOrder = checkTimelineOrder;
window.resetTimeline = resetTimeline;
