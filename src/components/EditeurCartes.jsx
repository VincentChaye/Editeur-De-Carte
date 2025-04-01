import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function EditeurCartes() {
	const [champs, setChamps] = useState(() => {
	  const saved = localStorage.getItem("carte_champs");
	  return saved ? JSON.parse(saved) : [
		{ nom: "Nom", valeur: "", type: "texte", align: "left", offset: 0, couleur: "#000000", opacite: 1, taille: 16, top: 0, largeur: 100, hauteur: 100 }
	  ];
	});
  
	const cardRef = useRef(null);
	const fileInputRef = useRef();
  
	const ajouterChamp = () => {
	  const nouveauxChamps = [
		...champs,
		{ nom: `Champ ${champs.length + 1}`, valeur: "", type: "texte", align: "left", offset: 0, couleur: "#000000", opacite: 1, taille: 16, top: 0, largeur: 100, hauteur: 100 }
	  ];
	  setChamps(nouveauxChamps);
	  localStorage.setItem("carte_champs", JSON.stringify(nouveauxChamps));
	};
  
	const supprimerChamp = (index) => {
	  const nouveauxChamps = champs.filter((_, i) => i !== index);
	  setChamps(nouveauxChamps);
	  localStorage.setItem("carte_champs", JSON.stringify(nouveauxChamps));
	};
  
	const resetCarte = () => {
	  localStorage.removeItem("carte_champs");
	  setChamps([{
		nom: "Nom", valeur: "", type: "texte", align: "left", offset: 0, couleur: "#000000", opacite: 1, taille: 16, top: 0, largeur: 100, hauteur: 100
	  }]);
	};
  
	const modifierChamp = (index, cle, nouvelleValeur) => {
	  const nouveauxChamps = [...champs];
	  nouveauxChamps[index][cle] = ["offset", "taille", "top", "largeur", "hauteur", "opacite"].includes(cle) ? parseFloat(nouvelleValeur) : nouvelleValeur;
	  setChamps(nouveauxChamps);
	  localStorage.setItem("carte_champs", JSON.stringify(nouveauxChamps));
	};
  
	const handleImageUpload = (index, file) => {
	  const reader = new FileReader();
	  reader.onload = (e) => {
		const nouveauxChamps = [...champs];
		nouveauxChamps[index].valeur = e.target.result;
		setChamps(nouveauxChamps);
		localStorage.setItem("carte_champs", JSON.stringify(nouveauxChamps));
	  };
	  reader.readAsDataURL(file);
	};
  
	const exporterImage = async () => {
	  if (!cardRef.current) return;
	  const canvas = await html2canvas(cardRef.current);
	  const link = document.createElement("a");
	  link.download = "carte.png";
	  link.href = canvas.toDataURL("image/png");
	  link.click();
	};
  
	const exporterJSON = () => {
	  const blob = new Blob([JSON.stringify(champs, null, 2)], { type: "application/json" });
	  const link = document.createElement("a");
	  link.href = URL.createObjectURL(blob);
	  link.download = "carte.json";
	  link.click();
	};
  
	const importerJSON = (event) => {
	  const file = event.target.files[0];
	  if (!file) return;
	  const reader = new FileReader();
	  reader.onload = (e) => {
		try {
		  const data = JSON.parse(e.target.result);
		  if (Array.isArray(data)) {
			setChamps(data);
			localStorage.setItem("carte_champs", JSON.stringify(data));
		  }
		} catch (error) {
		  alert("Fichier JSON invalide");
		}
	  };
	  reader.readAsText(file);
	};
  
	return (
	  <div className="flex flex-col md:flex-row gap-6">
		{/* Formulaire d'édition */}
		<div className="w-full md:w-1/2">
		  <h2 className="text-xl font-semibold mb-2">Éditeur</h2>
		  {champs.map((champ, index) => (
			<div key={index} className="mb-4 space-y-1 border-b pb-4">
			  <div className="flex justify-between items-center">
				<span className="font-semibold">Champ {index + 1}</span>
				<button
				  onClick={() => supprimerChamp(index)}
				  className="text-red-600 hover:underline text-sm"
				>
				  Supprimer
				</button>
			  </div>
            <select
              className="border px-2 py-1 mr-2"
              value={champ.type}
              onChange={(e) => modifierChamp(index, "type", e.target.value)}
            >
              <option value="texte">Texte</option>
              <option value="image">Image</option>
            </select>
            <input
              type="text"
              className="border px-2 py-1 mr-2"
              value={champ.nom}
              onChange={(e) => modifierChamp(index, "nom", e.target.value)}
              placeholder="Nom du champ"
            />
            {champ.type === "texte" ? (
              <input
                type="text"
                className="border px-2 py-1 mr-2"
                value={champ.valeur}
                onChange={(e) => modifierChamp(index, "valeur", e.target.value)}
                placeholder="Valeur"
              />
            ) : (
              <>
                <input
                  type="text"
                  className="border px-2 py-1 mr-2"
                  value={champ.valeur}
                  onChange={(e) => modifierChamp(index, "valeur", e.target.value)}
                  placeholder="URL de l'image"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="border px-2 py-1 mr-2"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                />
                <div
                  className="border border-dashed p-2 text-center text-sm cursor-pointer bg-gray-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) {
                      handleImageUpload(index, e.dataTransfer.files[0]);
                    }
                  }}
                >
                  Glisser-déposer une image ici
                </div>
                <input
                  type="number"
                  min="10"
                  className="border px-2 py-1 w-24 mr-2"
                  value={champ.largeur}
                  onChange={(e) => modifierChamp(index, "largeur", e.target.value)}
                  placeholder="Largeur (px)"
                />
                <input
                  type="number"
                  min="10"
                  className="border px-2 py-1 w-24"
                  value={champ.hauteur}
                  onChange={(e) => modifierChamp(index, "hauteur", e.target.value)}
                  placeholder="Hauteur (px)"
                />
              </>
            )}
            <select
              className="border px-2 py-1 mr-2"
              value={champ.align}
              onChange={(e) => modifierChamp(index, "align", e.target.value)}
            >
              <option value="left">Gauche</option>
              <option value="center">Centre</option>
              <option value="right">Droite</option>
            </select>
            <input
              type="number"
              step="0.1"
              min="0"
              className="border px-2 py-1 w-20 mr-2"
              value={champ.offset}
              onChange={(e) => modifierChamp(index, "offset", e.target.value)}
              placeholder="Décalage (cm)"
            />
            {champ.type === "texte" && (
              <>
                <input
                  type="color"
                  className="border w-10 h-10 mr-2"
                  value={champ.couleur}
                  onChange={(e) => modifierChamp(index, "couleur", e.target.value)}
                  title="Couleur du texte"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="border px-2 py-1 w-24 mr-2"
                  value={champ.opacite}
                  onChange={(e) => modifierChamp(index, "opacite", e.target.value)}
                  placeholder="Opacité (0-1)"
                />
                <input
                  type="number"
                  min="8"
                  max="72"
                  className="border px-2 py-1 w-20 mr-2"
                  value={champ.taille}
                  onChange={(e) => modifierChamp(index, "taille", e.target.value)}
                  placeholder="Taille"
                />
              </>
            )}
            <input
              type="number"
              step="0.1"
              min="0"
              className="border px-2 py-1 w-24"
              value={champ.top}
              onChange={(e) => modifierChamp(index, "top", e.target.value)}
              placeholder="Position verticale (cm)"
            />
          </div>
        ))}
        <div className="mt-4 space-x-2">
          <button
            onClick={ajouterChamp}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ajouter un champ
          </button>
          <button
            onClick={exporterImage}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Exporter en PNG
          </button>
          <button
            onClick={exporterJSON}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Exporter JSON
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Importer JSON
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={importerJSON}
            className="hidden"
          />
        </div>
      </div>

      {/* Carte visuelle */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-2">Aperçu</h2>
        <div
          ref={cardRef}
          className="w-80 h-[500px] p-4 bg-white border shadow-lg rounded-lg relative overflow-hidden"
        >
          {champs.map((champ, index) => {
            const alignment = champ.align === "center" ? "center" : champ.align === "right" ? "flex-end" : "flex-start";
            const offsetStyle = champ.align === "left"
              ? { left: `${champ.offset * 37.795}px` }
              : champ.align === "right"
              ? { right: `${champ.offset * 37.795}px` }
              : { left: "50%", transform: "translateX(-50%)" };

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  display: "flex",
                  justifyContent: alignment,
                  top: `${champ.top * 37.795}px`,
                  color: champ.couleur,
                  opacity: champ.opacite,
                  fontSize: champ.type === "texte" ? `${champ.taille}px` : undefined,
                  ...offsetStyle,
                }}
              >
                {champ.type === "texte" ? (
                  <>
                    <span className="font-bold">{champ.nom}</span>&nbsp;
                    <span>{champ.valeur}</span>
                  </>
                ) : (
                  <img
                    src={champ.valeur}
                    alt={champ.nom}
                    style={{
                      width: champ.largeur + "px",
                      height: champ.hauteur + "px",
                      objectFit: "contain"
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}