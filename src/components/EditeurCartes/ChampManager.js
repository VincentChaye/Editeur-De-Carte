export function ajouterChamp(cartes, setCartes, carteActiveId, champs, STORAGE_KEY) {
	const nouveauxChamps = [
	  ...champs,
	  {
		nom: "",
		valeur: "",
		type: "texte",
		align: "left",
		offset: "",
		couleur: "#000000",
		opacite: "",
		taille: "",
		top: "",
		largeur: 100,
		hauteur: 100,
		rotation: "",
		gras: false,
		italique: false,
		souligne: false,
		font: "Roboto"
	  }
	];
	const nouvellesCartes = cartes.map((c) =>
	  c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
	);
	setCartes(nouvellesCartes);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  }
  
  export function supprimerChamp(index, champs, cartes, setCartes, carteActiveId, STORAGE_KEY) {
	const nouveauxChamps = champs.filter((_, i) => i !== index);
	const nouvellesCartes = cartes.map((c) =>
	  c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
	);
	setCartes(nouvellesCartes);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  }
  
  export function dupliquerChamp(index, champs, cartes, setCartes, carteActiveId, STORAGE_KEY) {
	const champACopier = champs[index];
	const copie = { ...champACopier };
	const nouveauxChamps = [...champs];
	nouveauxChamps.splice(index + 1, 0, copie);
	const nouvellesCartes = cartes.map((c) =>
	  c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
	);
	setCartes(nouvellesCartes);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  }
  
  export function modifierChamp(index, cle, nouvelleValeur, champs, cartes, setCartes, carteActiveId, STORAGE_KEY) {
	const nouveauxChamps = [...champs];
	nouveauxChamps[index][cle] = ["offset", "taille", "top", "largeur", "hauteur", "opacite"].includes(cle)
	  ? parseFloat(nouvelleValeur)
	  : nouvelleValeur;
  
	const nouvellesCartes = cartes.map((c) =>
	  c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
	);
	setCartes(nouvellesCartes);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  }
  