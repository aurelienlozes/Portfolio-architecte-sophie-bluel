// Récupération des travaux depuis l'API
const requete = await fetch("http://localhost:5678/api/works");
const works = await requete.json();

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