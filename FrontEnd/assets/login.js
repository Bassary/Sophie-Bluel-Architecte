// Création de la fonctinon de login et rédiraction de l'utilisateur

// récupération des éléments nécéssaire à la fonction
const formulaireLogin = document.getElementById("formulaire-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const infoErreurLogin = document.querySelector(".info-erreur-login");

formulaireLogin.addEventListener("submit", (event) => {
  //création d'un événement au "submit" cad au moment ou l'utilisateur valide le formulaire
  event.preventDefault(); // fonction qui empêche le changement de URL parce que nous voulons nous même redirigier l'utilisateur plus tard

  const chargeUtile = {
    // enregistrement de la "charge utile" qui se trouvera plus tard dans le body de l'objet fletch
    email: inputEmail.value, // valeur de l'input email
    password: inputPassword.value, // valeur de l'input password
  };

  //ajout du fetch en lien avec l'adresse HTTP de l'API user/login
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chargeUtile), // traduction de la charge utilise précédemment enregistrer en format json, sans ça le navigateur ne pourra pas comprendre les inforamtion envoyer
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La reponse n'est pas correcte");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);

      // Sauvegarde les informations de l'utilisateur dans localStorage
      localStorage.setItem("user", data.token);

      // Redirection vers la page d'accueil
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      infoErreurLogin.style.display = "flex"; // Affiche le message d'erreur
    });
});
