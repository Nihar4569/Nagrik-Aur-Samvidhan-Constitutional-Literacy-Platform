const articles = [
    { number: "12", hint: "Definition of 'State' under the Constitution" },
    { number: "13", hint: "Laws inconsistent with or in derogation of Fundamental Rights" },
    { number: "14", hint: "Right to Equality before the law" },
    { number: "15", hint: "Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth" },
    { number: "16", hint: "Equality of opportunity in public employment" },
    { number: "17", hint: "Abolition of Untouchability" },
    { number: "18", hint: "Abolition of titles except military and academic distinctions" },
    { number: "19", hint: "Protection of certain rights regarding freedom of speech, etc." },
    { number: "20", hint: "Protection in respect of conviction for offenses" },
    { number: "21", hint: "Protection of life and personal liberty" },
    { number: "21A", hint: "Right to education for children aged 6-14 years" },
    { number: "22", hint: "Protection against arrest and detention in certain cases" },
    { number: "23", hint: "Prohibition of human trafficking and forced labor" },
    { number: "24", hint: "Prohibition of child labor in hazardous jobs" },
    { number: "25", hint: "Freedom of conscience and free profession, practice, and propagation of religion" },
    { number: "26", hint: "Freedom to manage religious affairs" },
    { number: "27", hint: "Freedom from payment of taxes for promotion of any religion" },
    { number: "28", hint: "Freedom from religious instruction in state-funded educational institutions" },
    { number: "29", hint: "Protection of interests of minorities" },
    { number: "30", hint: "Right of minorities to establish and administer educational institutions" },
    { number: "32", hint: "Right to Constitutional Remedies" },
    { number: "36", hint: "Definition of 'State' in the context of Directive Principles" },
    { number: "37", hint: "Application of the Directive Principles" },
    { number: "38", hint: "State to secure a social order for the promotion of welfare" },
    { number: "39", hint: "Certain principles of policy to be followed by the State" },
    { number: "39A", hint: "Equal justice and free legal aid" },
    { number: "40", hint: "Organization of village panchayats" },
    { number: "41", hint: "Right to work, education, and public assistance" },
    { number: "42", hint: "Provision for just and humane conditions of work and maternity relief" },
    { number: "43", hint: "Living wage, etc., for workers" },
    { number: "43A", hint: "Participation of workers in management of industries" },
    { number: "44", hint: "Uniform Civil Code for the citizens" },
    { number: "45", hint: "Provision for early childhood care and education" },
    { number: "46", hint: "Promotion of educational and economic interests of Scheduled Castes, Scheduled Tribes, and other weaker sections" },
    { number: "47", hint: "Duty of the State to raise the level of nutrition and standard of living and to improve public health" },
    { number: "48", hint: "Organization of agriculture and animal husbandry" },
    { number: "48A", hint: "Protection and improvement of environment and safeguarding of forests and wildlife" },
    { number: "49", hint: "Protection of monuments and places of national importance" },
    { number: "50", hint: "Separation of judiciary from executive in public services" },
    { number: "51", hint: "Promotion of international peace and security" },
    { number: "51A", hint: "Fundamental Duties of citizens" }
];


        let selectedArticle;
        let attempts = 0;
        let score = 0;
        let gameOver = false;
        const maxAttempts = 10;

        const hintElement = document.getElementById('hint');
        const guessInput = document.getElementById('guessInput');
        const guessButton = document.getElementById('guessButton');
        const gameInfoElement = document.getElementById('gameInfo');
        const messageElement = document.getElementById('message');
        const resetButton = document.getElementById('resetButton');

        function resetGame() {
            selectedArticle = articles[Math.floor(Math.random() * articles.length)];
            attempts = 0;
            score = 0;
            gameOver = false;
            hintElement.textContent = selectedArticle.hint;
            guessInput.value = '';
            guessInput.disabled = false;
            guessButton.disabled = false;
            updateGameInfo();
            messageElement.textContent = '';
        }

        function updateGameInfo() {
            gameInfoElement.textContent = `Attempts: ${attempts}/${maxAttempts} | Score: ${score}`;
        }

        function handleGuess() {
            const guess = parseInt(guessInput.value);
            const correctNum = parseInt(selectedArticle.number);

            if (isNaN(guess)) {
                messageElement.textContent = 'Please enter a valid number.';
                return;
            }

            attempts++;

            if (guess === correctNum) {
                score = Math.max(100 - (attempts * 10), 10);
                messageElement.textContent = `Congratulations! You've guessed correctly. Article ${selectedArticle.number}: ${selectedArticle.hint}`;
                gameOver = true;
                guessInput.disabled = true;
                guessButton.disabled = true;
                sendScoreToServer(score);
            } else {
                const article = articles.find(a => parseInt(a.number) === guess);
                let hint = guess < correctNum ? 'higher' : 'lower';
                messageElement.textContent = `Try a ${hint} number. ${article ? `Article ${article.number}: ${article.hint}` : 'No article found for this number.'}`;

                if (attempts >= maxAttempts) {
                    messageElement.textContent += ` Game over! The correct article was ${selectedArticle.number}: ${selectedArticle.hint}`;
                    gameOver = true;
                    guessInput.disabled = true;
                    guessButton.disabled = true;
                    sendScoreToServer(0);
                }
            }

            updateGameInfo();
        }
        function sendScoreToServer(score) {
    fetch('/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error saving score:', error);
    });
}

        guessButton.addEventListener('click', handleGuess);
        resetButton.addEventListener('click', resetGame);

        // Initialize the game
        resetGame();
