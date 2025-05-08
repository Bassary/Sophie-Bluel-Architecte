const apiWork = await fetch(`http://localhost:5678/api/works`); // recupération de l'API correspondant au donner dont nous avons besoin "works"
const works = await apiWork.json(); // traduction des information compris dans la "charge utile" dit body pour pouvoir récupérer nos inforamtion se trouvant dans des objet écrit en json
// par la suite nous utiliserons la cariable "works" pour récupérer nos élément dans notre tableaux d'objet. Nous utilison cette variable car nous l'avons traduit en json depuis l'adresse de l'API

// Affichage des image et titre de la gallery ********************
function generImages(works) {
  for (let i = 0; i < works.length; i++) {
    // utilisation de la boucle for pour parcouris tous les élément du tabelaux d'objet "works"
    const figure = document.createElement("figure"); // création des éléments dons nous avons besoins pour insert nos images
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.src = works[i].imageUrl; // rattachement de la source "src" de la variable image qui est égale à l'élément "imageUrl" qui se trouve à l'incide "works"
    figcaption.innerText = works[i].title; // idem pour le texte

    document.querySelector(".gallery").appendChild(figure); // rattachement de l'élément enfant "figure" à son parent ".gallery"
    figure.appendChild(image); // rattachement de l'élément enfant "image" dans le parent "figure"
    figure.appendChild(figcaption);

    // en utilisant une boucle for en lien à l'API, tous nos élément se méttrons automatiquement dans l'ordre en respectant les imbrication apporter par la methode ".appendChild"
  }
}

// fonction gérant le style de la selection des boutons
function btnSelected(btnSelected, event) {
  btnSelected = event.target.classList.remove("btn-hover");
  btnSelected = event.target.classList.add("btn-selected");
}

// fonction enlevant le bouton précédemment sélectionné toute en rajoutant l'effet hover
function btnClear() {
  const allBtn = document.querySelectorAll(".btn-filtre");
  for (let i = 0; i < allBtn.length; i++) {
    allBtn[i].classList.remove("btn-selected");
    allBtn[i].classList.add("btn-hover");
  }
}

generImages(works); //Appel de la fonction pour récupérer toutes les images

// Bouton filtre de la gallery *******************

// Flitre: Tous
const btnFiltreTous = document.getElementById("btn-tous");
btnFiltreTous.addEventListener("click", (event) => {
  btnClear();
  btnSelected(btnFiltreTous, event);
  const filtreTous = works.filter(function (works) {
    return works.category.name;
  });

  document.querySelector(".gallery").innerHTML = "";
  generImages(filtreTous);
});

// Flitre: Objets
const btnFiltreObjet = document.getElementById("btn-objets");
btnFiltreObjet.addEventListener("click", (event) => {
  btnClear();
  btnSelected(btnFiltreObjet, event);
  const filtreObjet = works.filter(function (works) {
    return works.category.name === "Objets";
  });

  document.querySelector(".gallery").innerHTML = "";
  generImages(filtreObjet);
});

// Filtre : Appartement
const btnFiltreAppartement = document.getElementById("btn-appartements");
btnFiltreAppartement.addEventListener("click", (event) => {
  btnClear();
  btnSelected(btnFiltreAppartement, event);
  const filtreAppartemtent = works.filter(function (works) {
    return works.category.name === "Appartements";
  });

  document.querySelector(".gallery").innerHTML = "";
  generImages(filtreAppartemtent);
});

// Filtre : Hôtels & restaurants
const btnFiltreHotelResto = document.getElementById("btn-hotels-restaurants");
btnFiltreHotelResto.addEventListener("click", (event) => {
  btnClear();
  btnSelected(btnFiltreHotelResto, event);
  const filtreHotelResto = works.filter(function (works) {
    return works.category.name === "Hotels & restaurants";
  });

  document.querySelector(".gallery").innerHTML = "";
  generImages(filtreHotelResto);
});
