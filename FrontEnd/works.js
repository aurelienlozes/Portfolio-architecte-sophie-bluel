// Récupération des travaux depuis l'API
const requete = await fetch("http://localhost:5678/api/works");
const works = await requete.json();
console.log(works);

// Affichage des travaux dans la section "portfolio"
const gallery = document.querySelector(".gallery");

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


// Récupération des catégories depuis l'API
const requeteCategories = await fetch("http://localhost:5678/api/categories");
const categories = await requeteCategories.json();
console.log(categories);

// Création des catégories dans la section "filtres"
const filtersContainer = document.querySelector(".filters");
categories.forEach(category => {
    // ajout de bouttons de filtre pour chaque catégorie
    const a = document.createElement("a");
    a.textContent = category.name;
    a.setAttribute("href", `#`);
    a.setAttribute("data-filter", category.id);
    filtersContainer.appendChild(a);

    // ajout d'un écouteur d'événement pour filtrer les travaux lors du clic sur une catégorie
    a.addEventListener("click", (event) => {
        //console.log(`Filtre sélectionné : ${category.name}`);
        event.preventDefault(); // Empêche le comportement par défaut du lien
        const filter = event.target.getAttribute("data-filter");
        const filteredWorks = filter === "all" ? works : works.filter(work => work.categoryId == filter);
        displayWorks(filteredWorks);        
    });
});