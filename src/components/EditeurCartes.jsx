import React, { useState, useRef,useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


export default function EditeurCartes() {
	const [champs, setChamps] = useState(() => {
		const saved = localStorage.getItem("carte_champs");
		return saved ? JSON.parse(saved) : [
			{
				nom: "Nom",
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
				gras: false,
				italique: false,
				souligne: false,
				font: "Roboto"
			}

		];
	});

	const cardRef = useRef(null);
	const fileInputRef = useRef();

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
				nom: "Nom",
				valeur: "",
				type: "texte",
				align: "Left",
				offset: "",
				couleur: "#000000",
				opacite: "",
				taille: "",
				top: "",
				largeur: "",
				hauteur: "",
				gras: false,
				italique: false,
				souligne: false,
				font: "Roboto"
			}

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
			nom: "Nom",
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
			gras: false,
			italique: false,
			souligne: false,
			font: "Roboto"
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
									<option value="Roboto" style={{ fontFamily: "Roboto" }}>Roboto</option>
									<option value="Open Sans" style={{ fontFamily: "Open Sans" }}>Open Sans</option>
									<option value="Lobster" style={{ fontFamily: "Lobster" }}>Lobster</option>
									<option value="Merriweather" style={{ fontFamily: "Merriweather" }}>Merriweather</option>
									<option value="Pacifico" style={{ fontFamily: "Pacifico" }}>Pacifico</option>
									<option value="Poppins" style={{ fontFamily: "Roboto" }}>Poppins</option>
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
							className="border px-2 py-1 w-20 mr-2"
							value={champ.offset}
							onChange={(e) => modifierChamp(index, "offset", e.target.value)}
							placeholder="Décalage (cm)"
						/>
						<input
							type="number"
							step="0.1"
							min="0"
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
						onClick={exporterJSON}
						className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
					>
						Exporter JSON
					</button>
					<button
						onClick={() => fileInputRef.current.click()}
						className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
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
						<option value="5.5x9">Carte de jeu – 5.4 × 9 cm</option>
						<option value="10.5x14.8">Format RDM – 10.5 × 14.8 cm</option>
						<option value="14.8x21">Format RDM – 14.8 × 21 cm</option>
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
						const offsetStyle = champ.align === "left"
							? { left: `${champ.offset}px` }
							: champ.align === "right"
								? { right: `${champ.offset}px` }
								: { left: "50%", transform: "translateX(-50%)" };

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
									...offsetStyle,
								}}
							>
								{champ.type === "texte" ? (
									<>
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

									</>
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