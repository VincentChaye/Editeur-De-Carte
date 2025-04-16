import { v4 as uuidv4 } from "uuid";

export function importerJSON(event, cartes, setCartes, setCarteActiveId, deckNom, setDeckNom) {
  const file = event.target.files[0];
  if (!file) return;

  const STORAGE_KEY = `deck_${deckNom}_cartes`;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (data.deck && Array.isArray(data.cartes)) {
        const newDeckKey = `deck_${data.deck}_cartes`;
        localStorage.setItem(newDeckKey, JSON.stringify(data.cartes));
        localStorage.setItem("deck_nom", data.deck);
        localStorage.setItem(`${newDeckKey}_active`, data.cartes[0]?.id || "");
        window.location.reload();
      }
      else if (Array.isArray(data)) {
        const nouvelleCarte = {
          id: uuidv4(),
          titre: `Carte ${cartes.length + 1}`,
          champs: data,
        };
        const updated = [...cartes, nouvelleCarte];
        setCartes(updated);
        setCarteActiveId(nouvelleCarte.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(`${STORAGE_KEY}_active`, nouvelleCarte.id);
      } else {
        alert("Format JSON non reconnu");
      }
    } catch (error) {
      alert("Fichier JSON invalide");
    }
  };
  reader.readAsText(file);
}
