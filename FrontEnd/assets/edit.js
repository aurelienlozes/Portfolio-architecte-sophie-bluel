import { loadAndDisplayAllWorks } from "./works.js";

// récupération des données depuis l'API
const token = localStorage.getItem("token");
if (!token || token === "") {
    //console.log("Aucun token trouvé");
    displayEditMode(false);
    switchLogBtn(false);
} else {
    //console.log("Token trouvé : ", token);
    displayEditMode(true);
    switchLogBtn(true);
}


// --------------------------------------------------------------------------
// MODE EDITION -------------------------------------------------------------
// --------------------------------------------------------------------------

/** Affiche ou masque les éléments de la page en fonction du mode d'édition
 * @param {boolean} value - true pour afficher les éléments d'édition, false pour les masquer
 */
function displayEditMode(value) {
    const editModeElements = document.querySelectorAll(".edit-mode");
    editModeElements.forEach(element => {
        element.style.display = value ? "block" : "none";
    });
}

/** Basculer l'affichage des boutons de connexion et de déconnexion
 * @param {boolean} value - true pour afficher le bouton de déconnexion, false pour afficher le bouton de connexion
 */
function switchLogBtn(value) {
    const loginBtn = document.querySelector(".login-btn");
    const logoutBtn = document.querySelector(".logout-btn");

    loginBtn.style.display = value ? "none" : "block";
    logoutBtn.style.display = value ? "block" : "none";
}

/* Gère la déconnexion de l'utilisateur lorsque le bouton "logout" est cliqué */
document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token"); // Supprime le token du localStorage
    displayEditMode(false); // Masque les éléments d'édition
    switchLogBtn(false); // Affiche le bouton de connexion et masque le bouton de déconnexion
});


// --------------------------------------------------------------------------
// FENETRE MODAL NAVIGATION ----------------------------------------------------
// --------------------------------------------------------------------------


/* Affiche la popup modale d'édition lorsque le bouton "Modifier" est cliqué */
document.querySelector(".open-modal-btn").addEventListener("click", () => {
    displayGaleryPage(); // Affiche la page de galerie d'édition par défaut
    displayModal(true);
});

/* Ferme la popup modale d'édition lorsque le bouton de fermeture est cliqué */
document.querySelectorAll(".close-modal-btn").forEach(button => {
    button.addEventListener("click", () => {
        displayModal(false);
    });
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

/* ajout d'un écouteur sur le bouton "Ajouter une photo" pour afficher le formulaire d'ajout de photo */
document.querySelector(".modal-add-photo-btn").addEventListener("click", () => {
    displayAddPhotoPage();
});

function displayAddPhotoPage() {
    const addPhotoPage = document.querySelector(".modal-ajout-photo");
    addPhotoPage.style.display = "flex";
    addPhotoPage.setAttribute("aria-hidden", "false");
    const galleryPage = document.querySelector(".modal-galerie-photo");
    galleryPage.style.display = "none";
    galleryPage.setAttribute("aria-hidden", "true");
}

/* ajout d'un écouteur sur le bouton "Retour à la galerie" pour revenir à la galerie d'édition */
document.querySelector(".return-modal-btn").addEventListener("click", () => {
    displayGaleryPage();
});

function displayGaleryPage() {
    const addPhotoPage = document.querySelector(".modal-ajout-photo");
    addPhotoPage.style.display = "none";
    addPhotoPage.setAttribute("aria-hidden", "true");
    const galleryPage = document.querySelector(".modal-galerie-photo");
    galleryPage.style.display = "flex";
    galleryPage.setAttribute("aria-hidden", "false");
}

// --------------------------------------------------------------------------
// FENETRE MODAL EDITION ----------------------------------------------------
// --------------------------------------------------------------------------

// Affiche les travaux dans la modale d'édition
displayWorksInModal();

/** Afficher les travaux dans la modale d'édition
 * @param {Array} works - Tableau d'objets représentant les travaux à afficher
 */
async function displayWorksInModal() {
    const requete = await fetch("http://localhost:5678/api/works");
    const works = await requete.json();
    const galleryModal = document.querySelector(".modal-body");
    galleryModal.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        img.height = 102;
        figure.appendChild(img);
        const deleteBtn = document.createElement("a");
        deleteBtn.setAttribute("href", "#");
        deleteBtn.classList.add("modal-delete-btn");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteBtn.addEventListener("click", () => {
            deleteWork(work.id);
        });
        figure.appendChild(deleteBtn);
        galleryModal.appendChild(figure);
    });
}


function deleteWork(workId) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        if (response.ok) {
            console.log(`Travail avec ID ${workId} supprimé avec succès.`);
            // Met à jour l'affichage des travaux après la suppression
            displayWorksInModal();
            loadAndDisplayAllWorks();
        } else {
            console.error(`Erreur lors de la suppression du travail avec ID ${workId}. Statut : ${response.status}`);
        }
    })
        .catch(error => {
            console.error(`Erreur réseau lors de la suppression du travail avec ID ${workId} :`, error);
        });
}



// --------------------------------------------------------------------------
// AJOUT DE PHOTOS ----------------------------------------------------------
// --------------------------------------------------------------------------

/* Récupération des catégories depuis l'API pour les afficher dans le formulaire d'ajout de photo */
const requeteCategories = await fetch("http://localhost:5678/api/categories");
let categories = await requeteCategories.json();
categories.unshift({ id: 0, name: "Sélectionner une catégorie" });

// Remplir le selecteur avec les catégories
const categorySelect = document.querySelector(".upload-category-select");
categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
});

/* Upload et affichage de l'image sélectionnée dans le formulaire d'ajout de photo */
const uploadBtn = document.querySelector(".modal-upload-btn");
let imagePreview = document.querySelector(".image-preview");
const uploadChamps = document.querySelector(".image-upload-container");
uploadBtn.addEventListener("change", (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
            imagePreview.style.width = "129px";
            uploadChamps.style.display = "none";
            checkFormValidity();
        };
        reader.readAsDataURL(file);
    }
});


/* activation du bouton "Valider" du formulaire d'ajout de photo lorsque tous les champs sont remplis */
const titleInput = document.querySelector("#upload-title");
const categoryInput = document.querySelector(".upload-category-select");
const validerBtn = document.querySelector(".modal-valider-btn");
function checkFormValidity() {
    //console.log("Vérification de la validité du formulaire...");
    const isTitleValid = titleInput.value.trim() !== "";
    const isCategoryValid = categoryInput.value !== "0";
    const isImageSelected = imagePreview.src !== "";
    //console.log(`Titre valide : ${isTitleValid}, Catégorie valide : ${isCategoryValid}, Image sélectionnée : ${isImageSelected}`);
    validerBtn.disabled = !(isTitleValid && isCategoryValid && isImageSelected);
}

checkFormValidity();
/* lancer la vérification de la validité du formulaire à chaque changement dans les champs */
titleInput.addEventListener("input", checkFormValidity);
categoryInput.addEventListener("change", checkFormValidity);

