import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { publierDeck } from "../../api/deckAPI";
import {
  ajouterCarte,
  supprimerCarte,
  dupliquerCarte,
  modifierTitreCarte,
  resetCarte
} from "./CarteManager";
import {
  ajouterChamp,
  supprimerChamp,
  modifierChamp,
  dupliquerChamp
} from "./ChampManager";
import {
  exporterPNG,
  exporterPDF,
  exporterCarteJSON,
  exporterDeckJSON
} from "./ExportManager";
import { importerJSON } from "./ImportManager";
import ApercuCarte from "./ApercuCarte";

export default function EditeurCartes({ deckNom, onReset }) {
  const STORAGE_KEY = `deck_${deckNom}_cartes`;
  const [cartes, setCartes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [carteActiveId, setCarteActiveId] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_active`);
    return saved || null;
  });

  const carteActive = cartes.find((c) => c.id === carteActiveId);
  const champs = carteActive?.champs ?? [];
  const [champsOuverts, setChampsOuverts] = useState([]);

  const toggleChamp = (index) => {
    setChampsOuverts((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const setCarteActive = (update) => {
    const nouvellesCartes = cartes.map((c) =>
      c.id === carteActiveId ? { ...c, ...update } : c
    );
    setCartes(nouvellesCartes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
  };

  const cardRef = useRef(null);
  const fileInputRef = useRef();

  const [champEnEdition, setChampEnEdition] = useState(null);
  const [carteEnEditionId, setCarteEnEditionId] = useState(null);

  const cmToPx = (cm) => cm * 37.8;
  const [largeurCarte, setLargeurCarte] = useState(() => parseFloat(localStorage.getItem("carte_largeur")) || 8.5);
  const [hauteurCarte, setHauteurCarte] = useState(() => parseFloat(localStorage.getItem("carte_hauteur")) || 13);

  useEffect(() => {
    if (carteActive) {
      setChampsOuverts(carteActive.champs.map(() => false));
    }
  }, [carteActiveId]);

  useEffect(() => {
    localStorage.setItem("carte_largeur", largeurCarte);
  }, [largeurCarte]);

  useEffect(() => {
    localStorage.setItem("carte_hauteur", hauteurCarte);
  }, [hauteurCarte]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* FORMULAIRE ÉDITEUR */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-2">Éditeur</h2>
        <button onClick={() => ajouterCarte(cartes, setCartes, setCarteActiveId, STORAGE_KEY)}
          className="bg-green-600 text-white px-3 py-2 rounded mb-4">
          Nouvelle carte
        </button>

        {cartes.map((carte) => (
          <div key={carte.id} className="flex items-center gap-2 mb-2">
            {carteEnEditionId === carte.id ? (
              <input
                type="text"
                value={carte.titre}
                onChange={(e) => modifierTitreCarte(carte.id, e.target.value, cartes, setCartes, STORAGE_KEY)}
                onBlur={() => setCarteEnEditionId(null)}
                autoFocus
                className="px-2 py-1 border rounded"
              />
            ) : (
              <button
                onClick={() => {
                  setCarteActiveId(carte.id);
                  localStorage.setItem(`${STORAGE_KEY}_active`, carte.id);
                }}
                onDoubleClick={() => setCarteEnEditionId(carte.id)}
                className={`px-3 py-1 rounded border ${carte.id === carteActiveId ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
              >
                {carte.titre}
              </button>
            )}
            <button onClick={() =>
              Swal.fire({
                title: "Supprimer cette carte ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler"
              }).then((res) => {
                if (res.isConfirmed) {
                  supprimerCarte(carte.id, cartes, setCartes, carteActiveId, setCarteActiveId, STORAGE_KEY);
                }
              })}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              🗑
            </button>
            <button
              onClick={() => dupliquerCarte(carte, cartes, setCartes, setCarteActiveId, STORAGE_KEY)}
              className="text-yellow-600 hover:text-yellow-800 text-sm"
            >
              📄
            </button>
          </div>
        ))}

        {champs.map((champ, index) => (
          <div key={index} className="mb-4 space-y-1 border-b pb-4">
            <div className="flex justify-between items-center cursor-pointer">
              {champEnEdition === index ? (
                <input
                  type="text"
                  className="font-semibold border px-2 py-1"
                  value={champ.nom}
                  autoFocus
                  onChange={(e) => modifierChamp(index, "nom", e.target.value, champs, cartes, setCartes, carteActiveId, STORAGE_KEY)}
                  onBlur={() => setChampEnEdition(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setChampEnEdition(null);
                  }}
                />
              ) : (
                <span className="font-semibold" onClick={() => setChampEnEdition(index)}>
                  {champ.nom || `Champ ${index + 1}`}
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500" onClick={() => toggleChamp(index)}>
                  {champsOuverts[index] ? "▼" : "▲"}
                </span>
                <button
                  onClick={() => supprimerChamp(index, champs, cartes, setCartes, carteActiveId, STORAGE_KEY)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => dupliquerChamp(index, champs, cartes, setCartes, carteActiveId, STORAGE_KEY)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Dupliquer
                </button>
              </div>
            </div>

            {champsOuverts[index] && champ.type === "texte" && (
              <>
                <input
                  type="text"
                  value={champ.valeur}
                  onChange={(e) => modifierChamp(index, "valeur", e.target.value, champs, cartes, setCartes, carteActiveId, STORAGE_KEY)}
                  className="border px-2 py-1"
                />
              </>
            )}
          </div>
        ))}

        <div className="mt-4 space-x-2">
          <button onClick={() => ajouterChamp(cartes, setCartes, carteActiveId, champs, STORAGE_KEY)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Ajouter un champ
          </button>
          <button onClick={() => exporterPNG(cardRef)} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
            Exporter en PNG
          </button>
          <button onClick={() => exporterPDF(cardRef)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Exporter en PDF
          </button>
          <button onClick={() => exporterCarteJSON(carteActive)} className="bg-indigo-500 text-white px-4 py-2 rounded mt-2">
            Exporter cette carte
          </button>
          <button onClick={() => exporterDeckJSON(deckNom, cartes)} className="bg-blue-800 text-white px-4 py-2 rounded mt-2">
            Exporter le deck
          </button>

          <input type="file" accept="application/json" ref={fileInputRef} onChange={(e) =>
            importerJSON(e, cartes, setCartes, setCarteActiveId, deckNom)} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="bg-purple-600 text-white px-4 py-2 rounded mt-2">
            Importer JSON
          </button>

          <button onClick={async () => {
            try {
              await publierDeck({ nom: deckNom, cartes });
              Swal.fire("Succès", "Deck publié avec succès !", "success");
            } catch (err) {
              console.error(err);
              Swal.fire("Erreur", "Impossible de publier le deck", "error");
            }
          }}
            className="bg-emerald-600 text-white px-4 py-2 rounded mt-2">
            Publier le deck
          </button>
        </div>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h2 className="text-2xl font-bold">Deck : {deckNom}</h2>
          <div className="flex gap-4 items-center">
            <button onClick={onReset} className="text-sm text-blue-600 underline">Changer de deck</button>
            <button onClick={() =>
              Swal.fire({
                title: `Supprimer "${deckNom}" ?`,
                text: "Cette action est irréversible.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Oui, supprimer",
                cancelButtonText: "Annuler"
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem(`deck_${deckNom}_cartes`);
                  localStorage.removeItem(`deck_${deckNom}_cartes_active`);
                  localStorage.removeItem("deck_nom");
                  onReset();
                  Swal.fire("Supprimé", `Le deck "${deckNom}" a été supprimé.`, "success");
                }
              })}
              className="text-sm text-red-600 underline">
              Supprimer le deck
            </button>
          </div>
        </div>
      </div>

      {/* APERCU VISUEL */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-2">Aperçu</h2>
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium">Format de la carte</label>
          <select className="border px-2 py-1 w-full"
            onChange={(e) => {
              const [w, h] = e.target.value.split("x").map(parseFloat);
              if (!isNaN(w) && !isNaN(h)) {
                setLargeurCarte(w);
                setHauteurCarte(h);
              }
            }}
            defaultValue="custom">
            <option value="custom">Personnalisé</option>
            <option value="5.5x9">Carte de jeu – 5.5 × 9 cm</option>
          </select>

          <div className="flex gap-4">
            <label className="block text-sm">
              Largeur (cm)
              <input type="number" min="3" step="0.1" className="border px-2 py-1 w-24"
                value={largeurCarte}
                onChange={(e) => setLargeurCarte(parseFloat(e.target.value))} />
            </label>
            <label className="block text-sm">
              Hauteur (cm)
              <input type="number" min="3" step="0.1" className="border px-2 py-1 w-24"
                value={hauteurCarte}
                onChange={(e) => setHauteurCarte(parseFloat(e.target.value))} />
            </label>
          </div>
        </div>

        <ApercuCarte
          champs={champs}
          largeur={largeurCarte}
          hauteur={hauteurCarte}
          cardRef={cardRef}
          cmToPx={cmToPx}
        />
      </div>
    </div>
  );
}
