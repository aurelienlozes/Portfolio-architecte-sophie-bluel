const token = localStorage.getItem("token");
if (!token || token === "") {
    //console.log("Aucun token trouvé");
    displayEditMode(false);
} else {
    //console.log("Token trouvé : ", token);
    displayEditMode(true);
}

/** Affiche ou masque les éléments de la page en fonction du mode d'édition
 * @param {boolean} value - true pour afficher les éléments d'édition, false pour les masquer
 */
function displayEditMode(value) {
    const editModeElements = document.querySelectorAll(".edit-mode");
    editModeElements.forEach(element => {
        element.style.display = value ? "block" : "none";
    });
}

/* Affiche la popup modale d'édition lorsque le bouton "Modifier" est cliqué */
document.querySelector(".open-modal").addEventListener("click", () => {
    displayModal(true);
});

/* Ferme la popup modale d'édition lorsque le bouton de fermeture est cliqué */
document.querySelector(".close-modal").addEventListener("click", () => {
    displayModal(false);
});

/* Ferme la popup modale d'édition lorsque l'utilisateur clique en dehors de la modale */
document.querySelector(".modal-overlay").addEventListener("click", () => {
    if (event.target === document.querySelector(".modal-overlay")) {
        displayModal(false);
    }
});

/* Gère l'affichage de la popup modale d'édition
    * @param {boolean} value - true pour afficher la modale, false pour la masquer  
*/
function displayModal(value) {
    const modal = document.querySelector(".modal-overlay");
    modal.style.display = value ? "block" : "none";
    modal.setAttribute("aria-hidden", !value);
}