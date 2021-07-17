function generateValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            currentRound: 0,
            gameOver: false,
            winner: '',
            loggMessages: []
        };
    },
    methods: {
        attackMonster() {
            const value = generateValue(5, 12);
            this.currentRound++;
            this.monsterHealth -= value;
            this.addLoggMessage('player', 'attack', value);
            this.attackPlayer();
        },
        attackPlayer() {
            const value = generateValue(8, 15);
            this.playerHealth -= value;
            this.addLoggMessage('monster', 'attack', value);
        },
        specialAttackMonster() {
            const value = generateValue(10, 25);
            this.currentRound++;
            this.monsterHealth -= value;
            this.addLoggMessage('player', 'attack', value);
            this.attackPlayer();
        },
        healPlayer() {
            const healValue = generateValue(8, 20);
            this.currentRound++;
            if (this.playerHealth + healValue > 100) {
                this.addLoggMessage('player', 'heal', 100 - this.playerHealth);
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
                this.addLoggMessage('player', 'heal', healValue);
            }
            this.attackPlayer();
        },
        restartGame() {
            this.gameOver = false;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = '';
            this.currentRound = 0;
            this.loggMessages = [];
        },
        surrender() {
            this.gameOver = true;
            this.winner = 'MONSTER';
            this.addLoggMessage('player', 'surrender');
        },
        addLoggMessage(who, what, value) {
            this.loggMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    },
    computed: {
        monsterHealthCss() {
            return {width: this.monsterHealth > 0 ? this.monsterHealth + '%' : 0};
        },
        playerHealthCss() {
            return {width: this.playerHealth > 0 ? this.playerHealth + '%' : 0};
        },
        specialAttackDisabled() {
            return this.currentRound % 3 !== 0;
        }
    },
    watch: {
        monsterHealth(value) {
            if (value <= 0) {
                this.gameOver = true;
                if (this.playerHealth <= 0) {
                    this.winner = 'DRAW';
                } else {
                    this.winner = 'PLAYER';
                }
            }
        },
        playerHealth(value) {
            if (value <= 0) {
                this.gameOver = true;
                if (this.monsterHealth <= 0) {
                    this.winner = 'DRAW';
                } else {
                    this.winner = 'MONSTER';
                }
            }
        }
    }
});
app.mount('#game');
