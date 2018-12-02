window.onload = init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [{
                    nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'Sun City Café',
                    cuisine: 'Américaine'
                }
            ],
            nom: '',
            cuisine: '',
            nbRestaurants:0,
            page:0,
            pagesize:10,
            name:"",
            lastPage: 0,
            percent: 0,
        },
        mounted() {
            Vue.use(VueMaterial.default)

            console.log('Oui');
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                if (this.page < 0) {
                    this.page = 0;
                } else if (this.page > this.lastPage) {
                    this.page = this.lastPage;
                }

                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page + "&pagesize=" +
                    this.pagesize + "&name=" +
                    this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                this.restaurants = reponseJS.data;
                                this.nbRestaurants = reponseJS.count;
                                this.lastPage = Math.floor(this.nbRestaurants / this.pagesize);
                                this.percent = (this.page / this.lastPage) * 100;
                                console.log(reponseJS.msg);
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            supprimerRestaurant(index) {
                this.restaurants.splice(index, 1);
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // 2 - on récupère le contenu du formulaire
                let dataFormulaire = new FormData();
                dataFormulaire.append('nom', this.nom);
                dataFormulaire.append('cuisine', this.cuisine);

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                
                this.nom = "";
                this.cuisine = "";
            },
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            },
            premierePage() {
                this.page =  0;
                this.getRestaurantsFromServer();
            },
            dernierePage() {
                this.page = this.nbRestaurants / this.pagesize;
                this.getRestaurantsFromServer();
            },
            pageSuivante() {
                this.page++;
                this.getRestaurantsFromServer();
            },
            pagePrecedente() {
                this.page--;
                this.getRestaurantsFromServer();
            },
            chercherRestaurants: _.debounce(function () {
                this.getRestaurantsFromServer();
            }, 300)
        }
    })
}