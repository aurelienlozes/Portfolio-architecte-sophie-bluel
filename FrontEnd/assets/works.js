
// Récupération des catégories depuis l'API
const requeteCategories = await fetch("http://localhost:5678/api/categories");
let categories = await requeteCategories.json();
categories.unshift({ id: 0, name: "Tous" }); // Ajout d'une catégorie "Tous" pour afficher tous les travaux
console.log(categories);

// Affichage des travaux dans la section "portfolio"
const gallery = document.querySelector(".gallery");
loadAndDisplayAllWorks();

/** charge puis affiche tous les travaux
 * 
 */
export async function loadAndDisplayAllWorks() {
    // Récupération des travaux depuis l'API
    const requete = await fetch("http://localhost:5678/api/works");
    const works = await requete.json();
    console.log(works);
    displayWorks(works);
}

/** Fonction pour afficher les travaux dans la galerie
 * @param {Array} works - Tableau d'objets représentant les travaux à afficher
 */
function displayWorks(works) {
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Création des catégories dans la section "filtres"
const filtersContainer = document.querySelector(".filters");
categories.forEach(category => {
    // ajout de bouttons de filtre pour chaque catégorie
    const a = document.createElement("a");
    a.textContent = category.name;
    a.setAttribute("href", `#`);
    a.setAttribute("data-filter", category.id);
    filtersContainer.appendChild(a);
    if(category.id === 0) {
        a.classList.add("active"); // Par défaut, le filtre "Tous" est actif
    }

    // ajout d'un écouteur d'événement pour filtrer les travaux lors du clic sur une catégorie
    a.addEventListener("click", (event) => {
        //console.log(`Filtre sélectionné : ${category.name}`);
        event.preventDefault(); // Empêche le comportement par défaut du lien
        const filter = event.target.getAttribute("data-filter");
        const filteredWorks = filter === "0" ? works : works.filter(work => work.categoryId == filter);
        displayWorks(filteredWorks); // Affiche les travaux filtrés
        btnUpdate(event.target); // Met à jour l'état actif du bouton de filtre
    });
});

/** Fonction pour mettre à jour l'état actif des boutons de filtre
 * @param {HTMLElement} activeBtn - Le bouton de filtre actuellement actif
 */
function btnUpdate(activeBtn) {
    const buttons = document.querySelectorAll(".filters a");
    buttons.forEach(button => {
        if (button === activeBtn) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

}