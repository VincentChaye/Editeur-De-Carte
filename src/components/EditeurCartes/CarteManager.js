import { v4 as uuidv4 } from "uuid";

export function ajouterCarte(cartes, setCartes, setCarteActiveId, STORAGE_KEY) {
  const nouvelleCarte = {
    id: uuidv4(),
    titre: `Carte ${cartes.length + 1}`,
    champs: [{
      nom: "", valeur: "", type: "texte", align: "left", offset: 0,
      couleur: "#000000", opacite: 1, taille: 16, top: 0,
      largeur: 100, hauteur: 100, rotation: 0,
      gras: false, italique: false, souligne: false, font: "Roboto"
    }]
  };
  const updated = [...cartes, nouvelleCarte];
  setCartes(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  setCarteActiveId(nouvelleCarte.id);
  localStorage.setItem(`${STORAGE_KEY}_active`, nouvelleCarte.id);
}

export function supprimerCarte(id, cartes, setCartes, carteActiveId, setCarteActiveId, STORAGE_KEY) {
  const nouvellesCartes = cartes.filter(carte => carte.id !== id);
  setCartes(nouvellesCartes);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  if (id === carteActiveId) {
    const nouvelleActive = nouvellesCartes[0]?.id || null;
    setCarteActiveId(nouvelleActive);
    localStorage.setItem(`${STORAGE_KEY}_active`, nouvelleActive);
  }
}

export function dupliquerCarte(carte, cartes, setCartes, setCarteActiveId, STORAGE_KEY) {
  const copie = {
    ...carte,
    id: uuidv4(),
    titre: `${carte.titre} (copie)`,
    champs: carte.champs.map(champ => ({ ...champ }))
  };
  const updated = [...cartes, copie];
  setCartes(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  setCarteActiveId(copie.id);
  localStorage.setItem(`${STORAGE_KEY}_active`, copie.id);
}

export function modifierTitreCarte(id, nouveauTitre, cartes, setCartes, STORAGE_KEY) {
  const updated = cartes.map(c =>
    c.id === id ? { ...c, titre: nouveauTitre } : c
  );
  setCartes(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function resetCarte(setCarteActive, STORAGE_KEY) {
  localStorage.removeItem(STORAGE_KEY);
  setCarteActive({
    champs: [{
      nom: "", valeur: "", type: "texte", align: "left", offset: 0,
      couleur: "#000000", opacite: 1, taille: 16, top: 0,
      largeur: 100, hauteur: 100, rotation: 0,
      gras: false, italique: false, souligne: false, font: "Roboto"
    }]
  });
}
