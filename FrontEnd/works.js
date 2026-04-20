// Récupération des travaux depuis l'API
const requete = await fetch("http://localhost:5678/api/works");
const works = await requete.json();
console.log(works);

// Affichage des travaux dans la section "portfolio"
const gallery = document.querySelector(".gallery");
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


// Récupération des catégories depuis l'API
const requeteCategories = await fetch("http://localhost:5678/api/categories");
const categories = await requeteCategories.json();
console.log(categories);