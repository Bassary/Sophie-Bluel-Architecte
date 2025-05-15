// ajout d'un ecouteur d'événement au chargement du DOM. Récupération du localStorage
// récupération des éléments nécéssaire au different préparation de la page selon l'authentification
document.addEventListener("DOMContentLoaded", () => {
  const userAuthentifier = window.localStorage.getItem("user");
  const status = document.querySelector(".status");
  let modifElement = document.querySelectorAll(".user-authentifier");
  const pageContaine = document.getElementById("body-section-max-width");

  if (userAuthentifier) {
    // condition, si le localStrorage est enregistrer, ajout du CSS corespondant
    status.textContent = "logout";
    status.addEventListener("click", () => {
      window.localStorage.removeItem("user"); // suppression du localStorage depuis le bouton "logout"
    });

    document.querySelector("body").style.maxWidth = "100vw";
    document.querySelector(".btn-filtre-container").style.opacity = "0";
    pageContaine.style.maxWidth = "1140px";
    pageContaine.style.margin = "auto";
  } else {
    // condition si le localeStorage n'est pas enregistrer
    status.textContent = "login";
    modifElement.forEach((element) => {
      element.style.display = "none";
    });
  }
});

// recupération de l'API correspondant au donner dont nous avons besoin "works"
const apiWork = await fetch(`http://localhost:5678/api/works`);
const works = await apiWork.json();

// traduction des information compris dans la "charge utile" dit body pour pouvoir récupérer nos inforamtion se trouvant dans des objet écrit en json
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
// Fonction générique pour gérer les filtres
function setupFilterButton(buttonId, categoryName) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", (event) => {
    btnClear();
    btnSelected(button, event);
    const filteredWorks = categoryName
      ? works.filter((work) => work.category.name === categoryName)
      : works;

    document.querySelector(".gallery").innerHTML = "";
    generImages(filteredWorks);
  });
}

// Initialisation des boutons de filtre
setupFilterButton("btn-tous", null);
setupFilterButton("btn-objets", "Objets");
setupFilterButton("btn-appartements", "Appartements");
setupFilterButton("btn-hotels-restaurants", "Hotels & restaurants");

generImages(works); // Appel de la fonction pour récupérer toutes les images
