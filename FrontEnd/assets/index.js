// ajout d'un ecouteur d'événement au chargement du DOM. Récupération du localStorage
// récupération des éléments nécéssaire au different préparation de la page selon l'authentification
const userAuthentifier = window.localStorage.getItem("user");

document.addEventListener("DOMContentLoaded", () => {
  const status = document.querySelector(".status");
  const modifElement = document.querySelectorAll(".user-authentifier");
  const pageContaine = document.getElementById("body-section-max-width");

  if (userAuthentifier) {
    // condition, si le localStrorage est enregistrer, ajout du CSS corespondant
    status.textContent = "logout";
    status.addEventListener("click", () => {
      window.localStorage.removeItem("user"); // suppression du localStorage depuis le bouton "logout"
    });

    // gestion de l'affichage corresonpondant
    document.querySelector("body").style.maxWidth = "100vw";
    document.querySelector(".btn-filtre-container").style.display = "none";
    document.querySelector(".container-modif").style.marginBottom = "50px";
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

// Code principale ********************

let works = []; // Variable globale pour conserver tous les travaux

// appel à la fonction pour afficher les images à chaque chargement de la page
window.addEventListener("DOMContentLoaded", async () => {
  works = await fetchWorks();
  generImages(works);
});

// fonction fetchWorks qui récupère les traveaux depuis l'API
async function fetchWorks() {
  try {
    const response = await fetch(`http://localhost:5678/api/works`);
    const data = await response.json(); // traduction des donner en format JSON
    return data;
  } catch (error) {
    //gestion des erreur et renvois d'un message correspondant dans la console
    console.error("Erreur lors du fetch des works :", error);
    return [];
  }
}

// Fonction pour afficher les image dans le DOM ******

async function generImages(worksToDisplay = null) {
  // condition de base, soit il n'y a pas de donner soit ont les récupère depuis l'API avec la fonction correspondante fetchWorks
  const data = worksToDisplay || (await fetchWorks()); // les donner sont stocker dans une variable data qui recupère les traveaux depuis l'API
  if (!works.length) works = data; // condition qui vérifie si le tableaux d'élément works (déclare au début comme let works = []) alors il le met à jour avec les donner récupérées

  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  data.forEach((work) => {
    // parcour chaque élément "work" du tableaux "data" en créant à chaque fois les élément correspondant (figure, img, figcaption)
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.src = work.imageUrl;
    figcaption.innerText = work.title;
    figure.id = `work-${work.id}`;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Bouton filtre de la gallery ***********************

// Fonction pour gérer

function setupFilterButton(buttonId, categoryName) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", (event) => {
    btnClear();
    btnSelected(button, event);

    const filteredWorks = categoryName
      ? works.filter((work) => work.category.name === categoryName)
      : works;

    generImages(filteredWorks);
  });
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

// Initialisation des boutons de filtre
setupFilterButton("btn-tous", null);
setupFilterButton("btn-objets", "Objets");
setupFilterButton("btn-appartements", "Appartements");
setupFilterButton("btn-hotels-restaurants", "Hotels & restaurants"); // Appel de la fonction pour récupérer toutes les images

// BOITE MODAL************************************

function OpenModal() {
  const btnModifer = document.getElementById("btn-modif");
  const boitModal = document.getElementById("modal");
  btnModifer.addEventListener("click", () => {
    boitModal.style.display = "flex";
  });
  modal.addEventListener("click", CloseModal);
  modal
    .querySelector(".cross-close-modal")
    .addEventListener("click", CloseModal);
  modal
    .querySelector(".stop-propagation") // sellection du parent par la classe coresspondant ajouter dans le HTML
    .addEventListener("click", stopPropagation); // ajout de la fonction pour limiter la propagation au parent
}

OpenModal(); //Appel à de la fonction

// fonction pour fermer la boite modale ******
function CloseModal() {
  const boitModal = document.getElementById("modal");
  boitModal.style.display = "none";
  nettoyerForm(); // appel à la fonction pour nettoyer le formulaire à chauqe fois qu'on la ferme
}

// fonction pour restrindre la zone active de l'evenement au click qui ferme la modale
function stopPropagation(e) {
  e.stopPropagation();
}

// Fonction pour afficher les traveaux et les supprimer dans la boîte modale **********
async function BoitModal() {
  const works = await fetchWorks();
  const gallery = modal.querySelector(".mini-gallery");
  gallery.innerHTML = ""; // On nettoie d'abord le contenu précédent

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const logo = document.createElement("img");

    image.src = work.imageUrl;
    image.style.height = "102px";

    logo.src = "FrontEnd/assets/icons/ben.svg";
    logo.classList.add("logo-ben");

    figure.id = `work-${work.id}`;

    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(logo);

    logo.addEventListener("click", async () => {
      // événement au click pour supprimer les élémants depuis la modale
      const isDeleted = await DeleteImage(work.id);
      if (isDeleted) {
        figure.remove();
        alert("Image supprimée avec succès");

        // Recharge les works depuis l'API pour mettre à jour la galerie principale
        generImages();
      }
    });
  }
}

BoitModal(); // appel à la fonction

// Fonction pour supprimer les images **********************
async function DeleteImage(imgId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${imgId}`, {
      // recupération de chemin de l'API avec la methode DELETE pour
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAuthentifier}`, // bearer tocken sous le nom de "userAuthentifier" mis dans le headers pour validé la demande
      },
    });

    // gestion de la reponse et des erreurs

    if (!response.ok) {
      // condition si la reponse n'est pas bonne
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    console.log("Suppression réussie :", response); // reponse console si l'action à fonctionné avec la reponse en retour
    return true;
  } catch (error) {
    // affichage de l'erreur dans la console
    console.error("Erreur lors de la suppression de l'élément :", error);
    return false;
  }
}

// Fonction d'affichage par defaut du boutton de validation dans le formulaire ********
function BtnValiderOff() {
  // bouton valider
  const btnValider = modal.querySelector(".btn-valider");
  btnValider.style.display = "block";
  btnValider.style.background = "#A7A7A7";
  btnValider.addEventListener("mouseover", () => {
    btnValider.style.opacity = "1";
  });
  btnValider.addEventListener("mouseout", () => {
    btnValider.style.opacity = "1";
  });
}

// Fonction d'affichage du boutton de validation quand le formulaire est remplie *******
function BtnValiderOn() {
  const btnValider = modal.querySelector(".btn-valider");
  btnValider.style.display = "block";
  btnValider.style.background = " #1D6154";
  btnValider.addEventListener("mouseover", () => {
    btnValider.style.opacity = "0.8";
  });
}

// Fonction d'affichage de la prévisualisation de l'image dans le formulaire ********
function appercuImage(file, imgPreview) {
  const reader = new FileReader();

  reader.onload = function (e) {
    imgPreview.src = e.target.result;
    imgPreview.style.display = "block";
  };

  reader.readAsDataURL(file);
}

// Fonction pour ajouter une nouvelle image dans le DOM de manière dynamique depuis le formulaire *****
function ajoutImageGallery(nouvelleImg, titre) {
  // parametre lien à l'image recupérer et le titre ajouter dans le formulaire
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  image.src = nouvelleImg;
  figcaption.innerText = titre;
  figure.id = `work-${nouvelleImg.id}`;

  document.querySelector(".gallery").appendChild(figure);
  figure.appendChild(image); // rattachement de l'élément enfant "image" dans le parent "figure"
  figure.appendChild(figcaption); // en utilisant une boucle for en lien à l'API, tous nos élément se méttrons automatiquement dans l'ordre en respectant les imbrication apporter par la methode ".appendChild"
}

// Fonction pour ajouter une nouvelle image dans la modale et pouvoir la supprimer de manière dynamique ********
function ajoutImageModal(nouvelleImg, id) {
  const figure = document.createElement("figure"); // création des éléments dons nous avons besoins pour insert nos images
  const image = document.createElement("img");
  const logo = document.createElement("img");

  image.src = nouvelleImg;
  image.style.height = "102px";
  logo.src = "./assets/icons/ben.svg";
  logo.classList.add("logo-ben");
  figure.id = `work-${id}`;

  modal.querySelector(".mini-gallery").appendChild(figure); // rattachement de l'élément enfant "figure" à son parent ".gallery"
  figure.appendChild(image); // rattachement de l'élément enfant "image" dans le parent "figure"
  figure.appendChild(logo);

  logo.addEventListener("click", async () => {
    const isDeleted = await DeleteImage(id);
    if (isDeleted) {
      figure.remove();
      alert("Image supprimée avec succès");

      // Recharge les works depuis l'API pour mettre à jour la galerie principale
      generImages();
    }
  });
}

// Fonction pour ajouter les images depuis un formulaire ************
function AjouterPhoto() {
  modal.querySelector("input").addEventListener("click", () => {
    //affichage intérface
    const fleche = modal.querySelector(".arrow-display");
    const containerFleche = modal.querySelector(".arrow-left");
    document.getElementById("wrapper-1").style.display = "none";
    document.getElementById("wrapper-2").style.display = "flex";
    modal.querySelector(".btn-ajout-photo").style.display = "none";

    containerFleche.classList.remove("arrow-left");
    fleche.classList.remove("arrow-display");
  });

  const contetPreview = document.querySelector(".encart-ajout-photo");
  const imageDefault = document.getElementById("image-default");
  const label = modal.querySelector(".btn-file");
  const text = modal.querySelector("p");
  const span = modal.querySelector("span");
  const inputFile = document.getElementById("image");
  const preview = document.createElement("img");
  preview.style.height = "100%";

  BtnValiderOff();

  // Télélcharger l'image
  inputFile.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file && file.type.match("image.*")) {
      contetPreview.appendChild(preview);
      preview.classList.add("img-preview");

      appercuImage(file, preview);

      inputFile.style.display = "none";
      imageDefault.style.display = "none";
      text.style.display = "none";
      span.style.display = "none";
      label.style.display = "none";

      BtnValiderOn();
    } else {
      alert("Veuillez sellectionner un fichier de type image");
    }
  });

  document.getElementById("image-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const inputFile = document.getElementById("image");
    const inputTitle = document.getElementById("title");
    const selectCat = document.getElementById("category").value;
    const formData = new FormData();

    if (inputFile.files.length === 0) {
      alert("Veuillez télécharger une image");
      return;
    }

    if (inputTitle.value.trim() === "") {
      inputTitle.style.border = "1px red solid";
      alert("Veuillez saisir un titre");
      return;
    }

    if (inputFile.files.length > 0) {
      const image = inputFile.files[0];

      formData.append("image", image);
      formData.append("title", inputTitle.value);
      formData.append("category", selectCat);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userAuthentifier}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Succes", data);
          alert("Image ajoutée avec succès");

          ajoutImageGallery(URL.createObjectURL(image), inputTitle.value);
          ajoutImageModal(URL.createObjectURL(image), data.id);

          CloseModal();
        })
        .catch((error) => {
          console.log("Erreur", error);
          alert("Echec du téléchargement");
        });
    }
  });
}

AjouterPhoto(); //appel à la fonction

// Fonction pour nettoyer le formulaire ****************
function nettoyerForm() {
  const form = modal.querySelector("#image-form");
  const preview = modal.querySelector(".img-preview");
  const imageDefault = document.getElementById("image-default");
  const label = modal.querySelector(".btn-file");
  const text = modal.querySelector("p");
  const span = modal.querySelector("span");
  const inputTitle = document.getElementById("title");

  BtnValiderOff();

  inputTitle.style.border = "none";

  form.reset();
  if (preview) {
    preview.src = "";
    imageDefault.style.display = "block";
    text.style.display = "block";
    span.style.display = "block";
    label.style.display = "block";
  }
}

// Fonction pour retounrer à la gallerie de la modale depuis le formulaire **************
function retourModal() {
  const containerFleche = modal.querySelector(".container-icon-top");
  const fleche = modal.querySelector(".arrow-display");
  fleche.addEventListener("click", () => {
    document.getElementById("wrapper-1").style.display = "flex";
    document.getElementById("wrapper-2").style.display = "none";
    fleche.classList.add("arrow-display");
    containerFleche.classList.add("arrow-left");
  });
}

retourModal(); //appel à la fonction

// Fonction qui gérants la sellection des catégorie depuis le formulaire ***********
async function OptionCat() {
  const apiCat = await fetch("http://localhost:5678/api/categories");
  const categories = await apiCat.json();
  for (let i = 0; i < categories.length; i++) {
    const select = modal.querySelector("select");
    const option = document.createElement("option");

    option.value = categories[i].id;
    option.textContent = categories[i].name;

    select.appendChild(option);
  }
}

OptionCat(); //applet à la fonction
