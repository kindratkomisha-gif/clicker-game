
window.addEventListener('DOMContentLoaded', () => {

    // ELEMENTS
    const scoreText = document.getElementById('score-text');
    const btn = document.getElementById('component-button');
    const spaceComponent = document.getElementById('space-component');
    const spaceBackground = document.getElementById('space-component-back');
    const pick = document.getElementById('pickaxe-hit');
    const scoreDisplay = document.getElementById('score-value');
    const passiveValue = document.getElementById('passive-value-number');
    const scoreTotalDisplay = document.getElementById('score-total');
    const achievementsButton = document.getElementById('achievements-button');
    const achievementsModal = document.getElementById('achievements-modal');
    const shopModal = document.getElementById('shop-modal');
    const shopButton = document.getElementById('shop-button');
    const closeBtn = document.getElementById('close');
    const closeAchievementsBtn = document.getElementById('close2');
    const speedValue = document.getElementById('speed-value-number');
    const shopItemsContainer = document.getElementById('shop-items');
    const achievementListContainer = document.getElementById('achievements-item');
    const bonusElement = document.getElementById('bonus');

    const resetButton = document.getElementById('reset');

    // GAME VARIABLES
    let score = 0;                // en variabel hvor rekorder alle click og passive income
    let clickValue = 1;           // en variabel der klikkverdien registreres
    let passiveIncome = 0;        // en variabel der passiv inntekt registreres
    let currentPickaxeLevel = 0;  // en variabel som beregner hakkenivået som kreves for å oppgradere den.
    let currentSpaceLevel = 0;    // en variabel som beregner spacenivået som kreves for å oppgradere den.
    let purchasedItems = [];
    let tickStarted = false;      // variabelen slik at funksjonen ikke kan kjøres to ganger

    // matrise der det er skrevet bildene av hakkene
    const pickaxeLevel = ['image/pickaxe.svg', 'image/pickaxe1.png', 'image/pickaxe2.png', 'image/pickaxe3.png', 'image/pickaxe4.png', 'image/pickaxe5.png']

    // en matrise der objektene vi klikker på registreres
    const spaceLevel = ['image/Component 1.png', 'image/space1.png', 'image/space2.png', 'image/space3.png', 'image/space4.png', 'image/space5.png'];

    // matrise der det er skrevet bildene av space
    const spaceBackgrounds = ['image/e6284ebc74b281a1f99b9124984ca7fd457e5f94.jpg', 'image/spaceBack1.png', 'image/spaceBack2.png', 'image/spaceBack3.png', 'image/spaceBack4.png', 'image/spaceBack5.png']

    // matrise der det skrevet navn av spallevalut
    const materials = ['Stardust:', 'Meteorite titanium:', 'Red crystal:', 'Thermal protection:', 'Plutonium:', 'Galaxy dust:']

    // en matrise som inneholder informasjon om butikkens produktobjekter

    const items = [
        { id: 'mega_pickaxe',    name: 'Mega Pickaxe',    cost: 15,     baseCost: 15,       effect: 1,  type: 'click',   reqLevel: 0 },
        { id: 'upgrade_pickaxe', name: 'Upgrade Pickaxe', cost: 100,    baseCost: 100,      effect: 5,  type: 'click',   reqLevel: 0 },
        { id: 'auto_mining',     name: 'Auto Mining',     cost: 1200,   baseCost: 1200,     effect: 2,  type: 'passive', reqLevel: 0 },
        { id: 'ultra_pickaxe',   name: 'Ultra Pickaxe',   cost: 10000,  baseCost: 10000,    effect: 20, type: 'click',   reqLevel: 0 },
        { id: 'mining_drone',    name: 'Mining Drone',    cost: 50000,  baseCost: 50000,    effect: 50, type: 'passive', reqLevel: 0 },
        { id: 'upgrade_space',   name: 'Upgrade Space',   cost: 1,      baseCost: 250000,   effect: 0,  type: 'space',   reqLevel: 0 },

        { id: 'quantum_excavator',   name: 'Quantum Excavator',   cost: 200000,     baseCost: 200000,    effect: 200,   type: 'passive', reqLevel: 1 },
        { id: 'dark_matter_pickaxe', name: 'Dark Matter Pickaxe', cost: 1000000,    baseCost: 1000000,   effect: 500,   type: 'click',   reqLevel: 2 },
        { id: 'nano_mining_bot',     name: 'Nano Mining Bot',     cost: 5000000,    baseCost: 5000000,   effect: 1000,  type: 'passive', reqLevel: 3 },
        { id: 'antimatter_drill',    name: 'Antimatter Drill',    cost: 20000000,   baseCost: 20000000,  effect: 5000,  type: 'click',   reqLevel: 4 },
        { id: 'galactic_harvester',  name: 'Galactic Harvester',  cost: 100000000,  baseCost: 100000000, effect: 20000, type: 'passive', reqLevel: 5 },

        { id: 'new game',            name: 'New Game',            cost: 10000000,   baseCost: 10000000,  effect: 0,     type: 'special', reqLevel: 0 },
    ];

    // en matrise som inneholder informasjon om prestasjoner

    const achievements = [
        { id: 'first_click',     name: 'First Click',          description: 'Make your first click.',                     condition: () => score > 0,                                      achieved: false },
        { id: 'score_100',       name: 'Score 100',            description: 'Reach a score of 100.',                      condition: () => score >= 100,                                   achieved: false },
        { id: 'score_1000',      name: 'Score 1,000',          description: 'Reach a score of 1,000.',                    condition: () => score >= 1000,                                  achieved: false },
        { id: 'score_10000',     name: 'Score 10,000',         description: 'Reach a score of 10,000.',                   condition: () => score >= 10000,                                 achieved: false },
        { id: 'score_100000',    name: 'Score 100,000',        description: 'Reach a score of 100,000.',                  condition: () => score >= 100000,                                achieved: false },
        { id: 'score_1_million', name: 'Score 1 Million',      description: 'Reach a score of 1,000,000.',                condition: () => score >= 1000000,                               achieved: false },
        { id: 'first_passive',   name: 'First Passive Income', description: 'Purchase your first passive income item.',   condition: () => passiveIncome > 0,                              achieved: false },
        { id: 'pickaxe_master',  name: 'Pickaxe Master',       description: 'Upgrade your pickaxe to the maximum level.', condition: () => currentPickaxeLevel >= pickaxeLevel.length - 1, achieved: false },
        { id: 'alt_items',       name: 'Unlock All Items',     description: 'Purchase all items in the shop.',            condition: () => purchasedItems.length === items.length,         achieved: false },
        { id: 'space_explorer',  name: 'Space Explorer',       description: 'Upgrade your space to the maximum level.',   condition: () => currentSpaceLevel >= spaceLevel.length - 1,     achieved: false },
    ];
    loadGame();
    if (!btn || !pick) return;

    // SHOP ITEMS RENDERING AND LOGIC
    function renderShopItems() {
        if (!shopItemsContainer) return;                                                // Hvis sidene ikke finner informasjon om containeren, avsluttes funksjonen.
        shopItemsContainer.innerHTML = '';                                              // tømme listen
        const avalibleItems = items.filter(item => item.reqLevel <= currentSpaceLevel); // Hvis et element i items-arrayet er likt eller mindre enn det angitte romnivået, skriver vi det til en ny array slik at spilleren ikke ser elementer som ennå ikke er tilgjengelige for ham.
        avalibleItems.forEach(item => {                                                 // denne løkken lager et skall for hvert element i avaliblrItems
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            itemDiv.innerHTML = `                                                       
                <div class="item-info">
                    <strong>${item.name} + ${item.effect}</strong>
                    <span>Cost: ${item.cost}</span>
                </div>
                <button class="buy-button">Buy</button>
            `;
            shopItemsContainer.appendChild(itemDiv);             // appendChild tar et skall og legge til HTML

            const buyBtn = itemDiv.querySelector('.buy-button'); // vi finner kjøpsknappen i de opprettede elementene
            buyBtn.addEventListener('click', () => {             // bind en hendelseslytter til knappen
                if (score >= item.cost) {                        // La oss sjekke om vi har nok penger til å kjøpe noe.
                    score -= item.cost;                          // Vi trekker prisen fra beløpet i valutaen vår
                    saveGame();
                    checkAchievements();                         // sjekk om noen av leveransene er fullført
                    scoreDisplay.textContent = score;            // oppdatering av valutabeholderen 
                    if (!purchasedItems.includes(item.id)) {     // Hvis den kjøpte varen ikke er i tabellen purchasedItems, legger vi den til
                        purchasedItems.push(item.id);
                    }
                    if (item.type === 'passive') {               // Hvis elementtypen er passiv, legger vi til effekten til passiveIncome og lanser funksjonen for passiv inntekt
                        passiveIncome += item.effect;
                        startPassiveTick();
                    } if (item.type === 'special' && item.id === 'new game') {      // Hvis elementtypen er spesiell, blir alle variabler og grensesnitt nullstilt.
                        performReset(true);
                        score = 0;
                        clickValue = (clickValue * 0.1);                            // Increase click value by 10%
                        passiveIncome = 0;
                        currentPickaxeLevel = 0;
                        currentSpaceLevel = 0;
                        purchasedItems = [];
                        spaceComponent.src = spaceLevel[currentSpaceLevel];
                        spaceBackground.src = spaceBackgrounds[currentSpaceLevel];
                        pick.src = pickaxeLevel[currentPickaxeLevel];
                        scoreDisplay.textContent = '0';
                        scoreTotalDisplay.textContent = '0';
                        passiveValue.textContent = 'Now passive income: 0';
                        speedValue.textContent = clickValue;
                        score.textContent = materials[0];

                        renderShopItems();                                          // starte på nytt fynksjon 
                        checkAchievements();

                        alert("Universe Reset! Your click power has doubled.");
                        return;
                    }
                    else {
                        saveGame();
                        clickValue += item.effect;                                                          // legg til clickValue-effekten
                        if (currentSpaceLevel < spaceLevel.length - 1 && item.id === 'upgrade_space') {     // hvis currentSpaceLevel er minst lengde spaceLevel 
                            currentSpaceLevel++;                                                            // legge til currentSpaceLevel +1
                            item.cost = Math.floor(item.cost * 1.5);                                        // øker prisen * 1.5 
                            clickValue = Math.floor(Number(clickValue) * 2);                                // øker clickValue * 2
                            spaceComponent.src = spaceLevel[currentSpaceLevel];                             // bytter objektene vi klikker til det neste elementet i tabellen
                            spaceBackground.src = spaceBackgrounds[currentSpaceLevel];                      // bytter bakgrunnen til det neste elementet i tabellen
                            scoreText.textContent = materials[currentSpaceLevel]                            // erstatter teksten i materialet
                            if (currentSpaceLevel >= spaceLevel.length - 1) {                               // hvis vi har nådd maksnivået
                                buyBtn.textContent = "MAX LEVEL";
                                buyBtn.disabled = true;                                                     // blokkerer knappen
                                buyBtn.style.backgroundColor = "#222";
                                item.cost = Infinity;                                                       // endre prisen til uendelig
                                return;
                            }
                            renderShopItems();                                                              // starte på nytt fynksjon 
                            checkAchievements();
                            return;
                        }
                        if (currentPickaxeLevel < pickaxeLevel.length - 1 && item.id === 'upgrade_pickaxe') {   // hvis currentPickaxeLevel er minst lengde pickaxeLevel
                            currentPickaxeLevel++;                                                              // legge til currentPickaxeLevel +1
                            pick.src = pickaxeLevel[currentPickaxeLevel];                                       // bytter pick til det neste elementet i tabellen
                        }
                        if (speedValue) {
                            speedValue.textContent = clickValue;                                                // legg til i klikktelleren clickValue
                        }
                    }

                    // sstil for kjøpsknappen hvis vi foretar et kjøp

                    buyBtn.style.backgroundColor = '#565656';
                    buyBtn.style.color = '#ffffff';
                    buyBtn.textContent = 'Purchased';
                    buyBtn.disabled = true;

                    item.cost = Math.floor(item.cost * 1.5);    // endrer item prisen

                    setTimeout(() => {                          // Frys knappen i 1 sekund for å unngå dobbeltkjøp.
                        buyBtn.disabled = false;
                        buyBtn.style.backgroundColor = '';
                        buyBtn.style.color = '';
                        buyBtn.textContent = `Buy`;

                        itemDiv.querySelector('span').textContent = `Cost: ${item.cost}`;   // oppdatering prisen
                    }, 1000);

                    if (item.id === 'upgrade_space') {                                      // Start funksjonen på nytt hvis den ble kjøpt upgrade_space
                        renderShopItems();
                    }

                    itemDiv.querySelector('span').textContent = `Cost: ${item.cost}`;       // oppdatering prisen

                } else {
                    alert('Not enough score!');
                }
            });
        });
    }

    // ACHIEVEMENTS RENDERING AND CHECKING

    function renderAchievements() {
        if (!achievementListContainer) return;      // Hvis sidene ikke finner informasjon om containeren, avsluttes funksjonen.
        achievementListContainer.innerHTML = '';    // tømme listen 

        achievements.forEach(ach => {               // denne løkken lager et skall for hvert element i achievements
            const isDone = ach.condition();         // tilstandsfunksjonskall
            const itemDiv = document.createElement('div');
            itemDiv.className = `achievements-item ${isDone ? 'unlocked' : 'locked'}`;      // Om en prestasjon er fullført eller ikke, får den den tilsvarende klassen CSS

            itemDiv.innerHTML = `
            <div class="achievements-info">
                <strong>${ach.name}</strong>
                <p>${isDone ? ach.description : '???'}</p>
                <span class="status-badge">${isDone ? '✅ Completed' : '🔒 Locked'}</span>
            </div>
        `;
            achievementListContainer.appendChild(itemDiv);      // appendChild tar et skall og legge til HTML
        });
    }

    function checkAchievements() {                                                  // prestasjonssjekk
        achievements.forEach(ach => {                                               // Denne løkken sjekker alle prestasjoner
            if (!ach.achieved && ach.condition()) {                                 // kontroll av om en prestasjon er oppnådd og om betingelsene for å oppnå den er oppfylt
                ach.achieved = true;                                                // endre verdien achieved slik at kodeblokken for denne prestasjonen ikke lenger kjører
                alert(`Achievement Unlocked: ${ach.name} - ${ach.description}`);
                achievementsModal.classList.add('Unlocked');                        // legge til en ny klasse for prestasjoner 
            }
        });
    }



    // PASSIVE INCOME TICK
    function startPassiveTick() {
        if (tickStarted) return;
        tickStarted = true;
        setInterval(() => {         // en syklus som gjentar seg hvert sekund
            if (passiveIncome > 0) {
                scoreTotalDisplay.textContent = parseInt(scoreTotalDisplay.textContent) + passiveIncome;    // Legge til passiv inntekt i grensesnittet
                score += passiveIncome;                                                                     // Legge til passiv inntekt i score
                checkAchievements();                                                                        // starte på nytt fynksjon
                scoreDisplay.textContent = score;
                passiveValue.textContent = ' Now passive income: ' + passiveIncome;
            }
        }, 1000);
    }

    // CLICK EVENT
    btn.addEventListener('click', (e) => {      //legg til en hendelseslytter til knappen
        let randonNUmber = Math.random();       //Vi lager et tilfeldig tall fra 0 til 1 for critical hit
        if (randonNUmber < 0.15) {              // hvis tilfeldig tall er minst enn 0.15 clickValue blir * 2
            score += clickValue * 2;
            scoreTotalDisplay.textContent = parseInt(scoreTotalDisplay.textContent) + clickValue * 2;
            createFloatingNumber(e.clientX, e.clientY, `Critical Hit! + ${clickValue * 2}`);        // starter på nytt fynksjon for å skape flytende tall og vi overfører koordinatene til klikket vårt
            setTimeout(() => {
                scoreDisplay.textContent = score;
            }, 1000);

        }
        scoreTotalDisplay.textContent = parseInt(scoreTotalDisplay.textContent) + clickValue;
        score += clickValue;
        scoreDisplay.textContent = score;

        const x = e.clientX;                            // Vi skriver ned koordinatene til klikket
        const y = e.clientY;
        pick.style.display = 'block';                   //vis frem hakken slik at den kan sees
        pick.style.left = (x - 50) + 'px';
        pick.style.top = (y - 50) + 'px';

        pick.classList.remove('active-hit');            //Fjern klassen med hakke-animasjonen.
        void pick.offsetWidth;                      //Vi tvinger nettleseren til faktisk å legge merke til at klassen ble fjernet.
        pick.classList.add('active-hit');           //legge til animasjon tilbake

        createFloatingNumber(x, y, `+${clickValue}`);       // starte på nytt funksjon for å skape flytende tall
        checkAchievements();                                // starte på nytt funksjon
        saveGame();
    });

    // BONUS CLICK EVENT

    function spavnBonus() {
        let randomDelay = Math.random() * 30000 + 30000;
        setTimeout(() => {
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 100);
            bonusElement.style.left = x + 'px';
            bonusElement.style.top = y + 'px';
            bonusElement.style.display = 'block';

            const autoHide = setTimeout(() => {
                bonusElement.style.display = 'none';
                bonusElement.onclick = null;
                spavnBonus();
            }, 3000);

            bonusElement.onclick = () => {
                clearTimeout(autoHide);
                bonusElement.style.display = 'none';
                bonusElement.onclick = null;

                const bonusAmount = clickValue * 10;
                score += bonusAmount;
                scoreDisplay.textContent = score;
                createFloatingNumber(x, y, `Bonus! +${bonusAmount}`);

                checkAchievements();
                spavnBonus();
            }
        }, randomDelay);
    }

    // FUNCTION TO CREATE FLOATING NUMBER
    function createFloatingNumber(x, y, text) {
        const num = document.createElement('div');
        num.className = 'floating-number';
        num.textContent = text;
        num.style.left = x + 'px';
        num.style.top = y + 'px';
        document.body.appendChild(num);
        setTimeout(() => num.remove(), 800);
    }

    //MODAL LOGIC
    if (shopButton) {
        shopButton.onclick = () => {
            shopModal.classList.add('show');
            achievementsButton.disabled = true;
            renderShopItems();
        }
    }
    if (closeBtn) {
        closeBtn.onclick = () => {
            shopModal.classList.remove('show');
            achievementsButton.disabled = false;
        }
    }
    if (achievementsButton) {
        achievementsButton.onclick = () => {
            renderAchievements();
            checkAchievements();
            achievementsModal.classList.add('show2');
            shopButton.disabled = true;
        };
    }
    if (closeAchievementsBtn) {
        closeAchievementsBtn.onclick = () => {
            achievementsModal.classList.remove('show2');
            shopButton.disabled = false;
        }
    }

    // RESET GAME
    function reset(isUniverseReset = false) {
        score = 0;
        clickValue = 1;
        passiveIncome = 0;
        currentPickaxeLevel = 0;
        currentSpaceLevel = 0;
        purchasedItems = [];

        if (isUniverseReset) {
            clickValue = Math.floor(clickValue * 1.2);
        } else {
            clickValue = 1;
        }

        for (let i = 0; i < items.length; i++) {
            items[i].cost = items[i].baseCost;
        }

        spaceComponent.src = spaceLevel[currentSpaceLevel];
        spaceBackground.src = spaceBackgrounds[currentSpaceLevel];
        pick.src = pickaxeLevel[currentPickaxeLevel];
        scoreDisplay.textContent = '0';
        scoreTotalDisplay.textContent = '0';
        passiveValue.textContent = 'Now passive income: 0';
        speedValue.textContent = clickValue;
        if (scoreText) {
            scoreText.textContent = materials[0];
        }
        renderShopItems();
        saveGame();
    }

    resetButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all progress?")) {
            reset(false);
        }
    });


    // SAVING LOGIC

    function saveGame() {
        const gameData = {
            score: score,
            clickValue: clickValue,
            passiveIncome: passiveIncome,
            currentPickaxeLevel: currentPickaxeLevel,
            currentSpaceLevel: currentSpaceLevel,
            purchasedItems: purchasedItems,
            itemCosts: items.map(item => ({ id: item.id, cost: item.cost }))
        };
        localStorage.setItem('MySave', JSON.stringify(gameData));
        console.log('save');
    }

    setInterval(saveGame, 1000);

    function loadGame() {
        const rawdata = localStorage.getItem('MySave');
        if (rawdata) {
            const data = JSON.parse(rawdata);

            score = data.score || 0;
            clickValue = data.clickValue || 1;
            passiveIncome = data.passiveIncome || 0;
            currentPickaxeLevel = data.currentPickaxeLevel || 0;
            currentSpaceLevel = data.currentSpaceLevel || 0;
            purchasedItems = data.purchasedItems || [];

            if (data.itemCosts) {
                data.itemCosts.forEach(savedItem => {
                    const item = items.find(i => i.id === savedItem.id);
                    if (item) {
                        item.cost = savedItem.cost;
                    }
                });
            };
        }

        scoreDisplay.textContent = score;
        spaceComponent.src = spaceLevel[currentSpaceLevel];
        spaceBackground.src = spaceBackgrounds[currentSpaceLevel];
        pick.src = pickaxeLevel[currentPickaxeLevel];
        speedValue.textContent = clickValue;
        passiveValue.textContent = ' Now passive income: ' + passiveIncome;
        scoreText.textContent = materials[currentSpaceLevel];

        if (passiveIncome > 0) {
            startPassiveTick();
        }
        renderShopItems();
        checkAchievements();
    }
    renderShopItems();
    spavnBonus();
});



