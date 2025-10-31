const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {},
            games: [],
            newGame: {
                name: '',
                price: ''
            }
        }
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame(id) {
    this.gameInModal = this.games.find(g => g.id === id);
    let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'));
    gameInfoModal.show();
},

        async addGame() {
            try {
                const response = await fetch('http://localhost:8080/games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newGame)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert('Error: ' + errorData.message);
                    return;
                }

                const addedGame = await response.json();
                this.games.push(addedGame); 

                this.newGame.name = '';
                this.newGame.price = '';
            } catch (error) {
                alert('Failed to add game: ' + error.message);
            }
        },
        async deleteGame(id) {
            try {
                const res = await fetch(`http://localhost:8080/games/${id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }
                this.games = this.games.filter(game => game.id !== id);
            } 
            catch (error) {
                alert(error.message);
            }
        }
    }
}).mount('#app');