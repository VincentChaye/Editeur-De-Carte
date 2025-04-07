import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";


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
	useEffect(() => {
		if (carteActive) {
			setChampsOuverts(carteActive.champs.map(() => false));
		}
	}, [carteActiveId]);

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

	const [largeurCarte, setLargeurCarte] = useState(() => {
		const saved = localStorage.getItem("carte_largeur");
		return saved ? parseFloat(saved) : 8.5; // valeur par défaut en cm
	});

	const [hauteurCarte, setHauteurCarte] = useState(() => {
		const saved = localStorage.getItem("carte_hauteur");
		return saved ? parseFloat(saved) : 13; // valeur par défaut en cm
	});

	useEffect(() => {
		localStorage.setItem("carte_largeur", largeurCarte);
	}, [largeurCarte]);

	useEffect(() => {
		localStorage.setItem("carte_hauteur", hauteurCarte);
	}, [hauteurCarte]);


	const ajouterChamp = () => {
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
	};


	const supprimerChamp = (index) => {
		const nouveauxChamps = champs.filter((_, i) => i !== index);
		const nouvellesCartes = cartes.map((c) =>
			c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
		);
		setCartes(nouvellesCartes);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
	};


	const supprimerCarte = (id) => {
		Swal.fire({
			title: "Supprimer cette carte ?",
			text: "Elle sera définitivement supprimée.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui",
			cancelButtonText: "Annuler",
		}).then((res) => {
			if (res.isConfirmed) {
				const nouvellesCartes = cartes.filter(carte => carte.id !== id);
				setCartes(nouvellesCartes);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));

				if (id === carteActiveId) {
					const nouvelleActive = nouvellesCartes[0]?.id || null;
					setCarteActiveId(nouvelleActive);
					localStorage.setItem(`${STORAGE_KEY}_active`, nouvelleActive);
				}

			}
		});
	};


	const ajouterCarte = () => {
		const nouvelleCarte = {
			id: uuidv4(),
			titre: `Carte ${cartes.length + 1}`,
			champs: [
				{
					nom: "",
					valeur: "",
					type: "texte",
					align: "left",
					offset: 0,
					couleur: "#000000",
					opacite: 1,
					taille: 16,
					top: 0,
					largeur: 100,
					hauteur: 100,
					rotation: 0,
					gras: false,
					italique: false,
					souligne: false,
					font: "Roboto"
				}
			]
		};
		const updated = [...cartes, nouvelleCarte];
		setCartes(updated);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		setCarteActiveId(nouvelleCarte.id);
		localStorage.setItem(`${STORAGE_KEY}_active`, nouvelleCarte.id);
	};

	const resetCarte = () => {
		localStorage.removeItem(STORAGE_KEY);
		setCarteActive({
			champs: [{
				nom: "",
				valeur: "",
				type: "texte",
				align: "left",
				offset: 0,
				couleur: "#000000",
				opacite: 1,
				taille: 16,
				top: 0,
				largeur: 100,
				hauteur: 100,
				rotation: 0,
				gras: false,
				italique: false,
				souligne: false,
				font: "Roboto"
			}]
		});


	};

	const modifierChamp = (index, cle, nouvelleValeur) => {
		const nouveauxChamps = [...champs];
		nouveauxChamps[index][cle] = ["offset", "taille", "top", "largeur", "hauteur", "opacite"].includes(cle)
			? parseFloat(nouvelleValeur)
			: nouvelleValeur;

		const nouvellesCartes = cartes.map((c) =>
			c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
		);
		setCartes(nouvellesCartes);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
	};

	const dupliquerChamp = (index) => {
		const champACopier = champs[index];
		const copie = { ...champACopier }; // copie indépendante

		const nouveauxChamps = [...champs];
		nouveauxChamps.splice(index + 1, 0, copie); // insère après l’original

		const nouvellesCartes = cartes.map((c) =>
			c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
		);

		setCartes(nouvellesCartes);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
	};

	const dupliquerCarte = (carte) => {
		const copie = {
			...carte,
			id: uuidv4(),
			titre: `${carte.titre} (copie)`,
			champs: carte.champs.map((champ) => ({ ...champ })) // copie profonde des champs
		};

		const updated = [...cartes, copie];
		setCartes(updated);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		setCarteActiveId(copie.id);
		localStorage.setItem(`${STORAGE_KEY}_active`, copie.id);
	};

	const modifierTitreCarte = (id, nouveauTitre) => {
		const updated = cartes.map(c =>
			c.id === id ? { ...c, titre: nouveauTitre } : c
		);
		setCartes(updated);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	};


	const handleImageUpload = (index, file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const nouveauxChamps = [...champs];
			nouveauxChamps[index].valeur = e.target.result;

			const nouvellesCartes = cartes.map((c) =>
				c.id === carteActiveId ? { ...c, champs: nouveauxChamps } : c
			);
			setCartes(nouvellesCartes);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nouvellesCartes));
		};
		reader.readAsDataURL(file);
	};


	const exporterPNG = async () => {
		if (!cardRef.current) return;

		const scale = 2;
		const canvas = await html2canvas(cardRef.current, { scale });

		// 👉 Créer un canvas temporaire à taille réelle
		const trueWidth = canvas.width / scale;
		const trueHeight = canvas.height / scale;

		const resizedCanvas = document.createElement("canvas");
		resizedCanvas.width = trueWidth;
		resizedCanvas.height = trueHeight;

		const ctx = resizedCanvas.getContext("2d");
		ctx.drawImage(canvas, 0, 0, trueWidth, trueHeight);

		const link = document.createElement("a");
		link.download = "carte.png";
		link.href = resizedCanvas.toDataURL("image/png");
		link.click();
	};



	const exporterPDF = async () => {
		if (!cardRef.current) return;

		const scale = 2; // qualité d'image améliorée
		const canvas = await html2canvas(cardRef.current, { scale });

		const imgData = canvas.toDataURL("image/png");

		const largeurPx = canvas.width;
		const hauteurPx = canvas.height;

		const pdfWidth = (largeurPx / scale) * 0.2646; // 1px ≈ 0.2646 mm
		const pdfHeight = (hauteurPx / scale) * 0.2646;

		const pdf = new jsPDF({
			orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
			unit: "mm",
			format: [pdfWidth, pdfHeight],
		});

		pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save("carte.pdf");
	};




	const exporterCarteJSON = () => {
		if (!carteActive) return;
		const blob = new Blob([JSON.stringify(carteActive.champs, null, 2)], {
			type: "application/json",
		});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${carteActive.titre}.json`;
		link.click();
	};
	const exporterDeckJSON = () => {
		const blob = new Blob(
			[JSON.stringify({ deck: deckNom, cartes }, null, 2)],
			{ type: "application/json" }
		);
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${deckNom}.json`;
		link.click();
	};

	const importerJSON = (event) => {
		const file = event.target.files[0];
		if (!file) return;

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
	};


	return (
		<div className="flex flex-col md:flex-row gap-6">
			{/* Formulaire d'édition */}
			<div className="w-full md:w-1/2">
				<h2 className="text-xl font-semibold mb-2">Éditeur</h2>
				{/* Bouton pour créer une nouvelle carte */}
				<button
					onClick={ajouterCarte}
					className="bg-green-600 text-white px-3 py-2 rounded mb-4"
				>
					Nouvelle carte
				</button>

				{/* Liste des cartes */}
				{cartes.map((carte) => (
					<div key={carte.id} className="flex items-center gap-2 mb-2">
						{carteEnEditionId === carte.id ? (
							<input
								type="text"
								value={carte.titre}
								onChange={(e) => modifierTitreCarte(carte.id, e.target.value)}
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
								className={`px-3 py-1 rounded border ${carte.id === carteActiveId ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
									}`}
							>
								{carte.titre}
							</button>
						)}

						<button
							onClick={() => supprimerCarte(carte.id)}
							className="text-red-600 hover:text-red-800 text-sm"
							title="Supprimer la carte"
						>
							🗑
						</button>
						<button
							onClick={() => dupliquerCarte(carte)}
							className="text-yellow-600 hover:text-yellow-800 text-sm"
							title="Dupliquer cette carte"
						>
							📄
						</button>
					</div>
				))}

				{champs.map((champ, index) => (
					<div key={index} className="mb-4 space-y-1 border-b pb-4">
						{/* Titre + Bouton supprimer */}
						<div className="flex justify-between items-center cursor-pointer">
							{champEnEdition === index ? (
								<input
									type="text"
									className="font-semibold border px-2 py-1"
									value={champ.nom}
									autoFocus
									onChange={(e) => modifierChamp(index, "nom", e.target.value)}
									onBlur={() => setChampEnEdition(null)}
									onKeyDown={(e) => {
										if (e.key === "Enter") setChampEnEdition(null);
									}}
								/>
							) : (
								<span
									className="font-semibold"
									onClick={() => setChampEnEdition(index)}
								>
									{champ.nom || `Champ ${index + 1}`}
								</span>
							)}

							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-500" onClick={() => toggleChamp(index)}>
									{champsOuverts[index] ? "▼" : "▲"}
								</span>
								<button
									onClick={() => supprimerChamp(index)}
									className="text-red-600 hover:underline text-sm"
								>
									Supprimer
								</button>
								<button
									onClick={() => dupliquerChamp(index)}
									className="text-blue-600 hover:underline text-sm"
								>
									Dupliquer
								</button>
							</div>
						</div>


						{/* Contenu conditionnel */}
						{champsOuverts[index] && (
							<>
								<select
									className="border px-2 py-1 mr-2"
									value={champ.type}
									onChange={(e) => modifierChamp(index, "type", e.target.value)}
								>
									<option value="texte">Texte</option>
									<option value="image">Image</option>
								</select>

								{champ.type === "texte" ? (
									<>
										<input
											type="text"
											className="border px-2 py-1 mr-2"
											value={champ.valeur}
											onChange={(e) => modifierChamp(index, "valeur", e.target.value)}
											placeholder="Valeur"
										/>
										<label className="mr-2">
											<input
												type="checkbox"
												checked={champ.gras}
												onChange={(e) => modifierChamp(index, "gras", e.target.checked)}
											/> Gras
										</label>
										<label className="mr-2">
											<input
												type="checkbox"
												checked={champ.italique}
												onChange={(e) => modifierChamp(index, "italique", e.target.checked)}
											/> Italique
										</label>
										<label className="mr-2">
											<input
												type="checkbox"
												checked={champ.souligne}
												onChange={(e) => modifierChamp(index, "souligne", e.target.checked)}
											/> Souligné
										</label>
										<select
											className="border px-2 py-1"
											value={champ.font}
											onChange={(e) => modifierChamp(index, "font", e.target.value)}
										>
											<option value="Roboto">Roboto</option>
											<option value="Open Sans">Open Sans</option>
											<option value="Lobster">Lobster</option>
											<option value="Merriweather">Merriweather</option>
											<option value="Pacifico">Pacifico</option>
											<option value="Poppins">Poppins</option>
										</select>
									</>
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
											className="border px-2 py-1 w-24 mr-2"
											value={champ.hauteur}
											onChange={(e) => modifierChamp(index, "hauteur", e.target.value)}
											placeholder="Hauteur (px)"
										/>
									</>
								)}

								{/* Alignement + Couleurs + Positions */}
								<select
									className="border px-2 py-1 mr-2"
									value={champ.align}
									onChange={(e) => modifierChamp(index, "align", e.target.value)}
								>
									<option value="left">Gauche</option>
									<option value="center">Centre</option>
									<option value="right">Droite</option>
								</select>

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
											min=""
											max=""
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
									min=""
									className="border px-2 py-1 w-20 mr-2"
									value={champ.offset}
									onChange={(e) => modifierChamp(index, "offset", e.target.value)}
									placeholder="Décalage (cm)"
								/>
								<input
									type="number"
									step="0.1"
									min=""
									className="border px-2 py-1 w-24 mr-2"
									value={champ.top}
									onChange={(e) => modifierChamp(index, "top", e.target.value)}
									placeholder="Position verticale (cm)"
								/>
								<input
									type="number"
									step="0.05"
									min="0"
									max="1"
									className="border px-2 py-1 w-24"
									value={champ.opacite}
									onChange={(e) => modifierChamp(index, "opacite", e.target.value)}
									placeholder="Opacité (0-1)"
								/>
								<input
									type="number"
									step="1"
									className="border px-2 py-1 w-24 mr-2"
									value={champ.rotation}
									onChange={(e) => modifierChamp(index, "rotation", e.target.value)}
									placeholder="Rotation (°)"
									title="Rotation du champ"
								/>
							</>
						)}
					</div>
				))}

				<div className="mt-4 space-x-2">
					<button
						onClick={ajouterChamp}
						className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
					>
						Ajouter un champ
					</button>

					<button
						onClick={exporterPNG}
						className="bg-green-600 text-white px-4 py-2 rounded mt-2"
					>
						Exporter en PNG
					</button>
					<button
						onClick={exporterPDF}
						className="bg-red-500 text-white px-4 py-2 rounded mt-2"
					>
						Exporter en PDF
					</button>

					<button
						onClick={exporterCarteJSON}
						className="bg-indigo-500 text-white px-4 py-2 rounded mt-2"
					>
						Exporter cette carte
					</button>
					<button
						onClick={exporterDeckJSON}
						className="bg-blue-800 text-white px-4 py-2 rounded mt-2"
					>
						Exporter le deck
					</button>

					<input
						type="file"
						accept="application/json"
						ref={fileInputRef}
						onChange={importerJSON}
						className="hidden"
					/>
					<button
						onClick={() => fileInputRef.current.click()}
						className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
					>
						Importer JSON
					</button>
				</div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Deck : {deckNom}</h2>
					<div className="flex gap-4 items-center">
						<button onClick={onReset} className="text-sm text-blue-600 underline">Changer de deck</button>
						<button
							onClick={() => {
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
								});
							}}
							className="text-sm text-red-600 underline"
						>
							Supprimer le deck
						</button>
					</div>
				</div>

			</div>

			{/* Carte visuelle */}
			<div className="w-full md:w-1/2">
				<h2 className="text-xl font-semibold mb-2">Aperçu</h2>
				<div className="mb-4 space-y-2">
					<label className="block text-sm font-medium">Format de la carte</label>
					<select
						className="border px-2 py-1 w-full"
						onChange={(e) => {
							const [w, h] = e.target.value.split("x").map(parseFloat);
							if (!isNaN(w) && !isNaN(h)) {
								setLargeurCarte(w);
								setHauteurCarte(h);
							}
						}}
						defaultValue="custom"
					>
						<option value="custom">Personnalisé</option>
						<option value="5.5x9">Carte de jeu – 5.5 × 9 cm</option>
					</select>

					{/* Champs affichés uniquement si le format est personnalisé */}
					<div className="flex gap-4">
						<label className="block text-sm">
							Largeur (cm)
							<input
								type="number"
								min="3"
								step="0.1"
								className="border px-2 py-1 w-24"
								value={largeurCarte}
								onChange={(e) => setLargeurCarte(parseFloat(e.target.value))}
							/>
						</label>
						<label className="block text-sm">
							Hauteur (cm)
							<input
								type="number"
								min="3"
								step="0.1"
								className="border px-2 py-1 w-24"
								value={hauteurCarte}
								onChange={(e) => setHauteurCarte(parseFloat(e.target.value))}
							/>
						</label>

					</div>
				</div>

				<div
					ref={cardRef}
					style={{
						width: `${cmToPx(largeurCarte)}px`,
						height: `${cmToPx(hauteurCarte)}px`,
						padding: "1rem",
						backgroundColor: "white",
						border: "1px solid #e5e7eb",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
						borderRadius: "0.5rem",
						position: "relative",
						overflow: "hidden"
					}}
				>
					{champs.map((champ, index) => {
						const alignment = champ.align === "center" ? "center" : champ.align === "right" ? "flex-end" : "flex-start";

						const baseTransform =
							`translate(${champ.align === "center" ? "-50%" : "0"}, -50%) rotate(${champ.rotation || 0}deg)`;

						const offsetStyle = champ.align === "left"
							? { left: `${champ.offset}px` }
							: champ.align === "right"
								? { right: `${champ.offset}px` }
								: { left: "50%" }; // plus de transform ici !

						return (
							<div
								key={index}
								className="absolute"
								style={{
									display: "flex",
									justifyContent: alignment,
									top: `${champ.top}px`,
									color: champ.couleur,
									opacity: champ.opacite,
									fontSize: champ.type === "texte" ? `${champ.taille}px` : undefined,
									transform: `translate(-50%, -50%) rotate(${champ.rotation || 0}deg)`,
									...offsetStyle,
								}}
							>
								{champ.type === "texte" ? (
									<span
										style={{
											fontWeight: champ.gras ? "bold" : "normal",
											fontStyle: champ.italique ? "italic" : "normal",
											textDecoration: champ.souligne ? "underline" : "none",
											fontFamily: champ.font || "Roboto"
										}}
									>
										{champ.valeur}
									</span>
								) : (
									<img
										src={champ.valeur}
										alt={champ.nom}
										style={{
											width: champ.largeur + "px",
											height: champ.hauteur + "px",
											objectFit: "fill"
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