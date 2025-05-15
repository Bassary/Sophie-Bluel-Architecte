// Création de la fonctinon de login et rédiraction de l'utilisateur

// récupération des éléments nécéssaire à la fonction
const formulaireLogin = document.getElementById("formulaire-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const infoErreurLogin = document.querySelector(".info-erreur-login");

formulaireLogin.addEventListener("submit", (event) => {
  //création d'un événement au "submit" cad au moment ou l'utilisateur valide le formulaire
  event.preventDefault(); // fonction qui empêche le changement de URL parce que nous voulons nous même redirigier l'utilisateur plus tard

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"; // enregistrement du token dans une variable : code nécéssaire qui correspond à la cléf de sécurité de l'autotification de l'utilisateur
  const chargeUtile = {
    // enregistrement de la "charge utile" qui se trouvera plus tard dans le body de l'objet fletch
    email: inputEmail.value, // valeur de l'input email
    password: inputPassword.value, // valeur de l'input password
  };

  //ajout du fetch en lien avec l'adresse HTTP de l'API user/login
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ajout de l'autorisation incluant du token dans le header pour avoir accès à l'adresse URL. Sans le token il y aurra une erreur 404 car l'adresse sera introuvable.
    }, // le terme "Bearer" coresspond au nom pour definir ce genre de token, il est imporant de le présiser dans l'autorisation
    body: JSON.stringify(chargeUtile), // traduiction de la charge utilise précédemment enregistrer en format json, sans ça le navigateur ne pourra pas comprendre les inforamtion envoyer
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);

      // Sauvegarde les informations de l'utilisateur dans localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          email: chargeUtile.email,
          token: token,
        })
      );

      // Redirige l'utilisateur vers une autre page
      window.location.href = "index.html";
      // Remplace par l'URL de la page de redirection
    })
    .catch((error) => {
      console.error("Error:", error);
      infoErreurLogin.style.display = "flex"; // Affiche le message d'erreur
    });
});
