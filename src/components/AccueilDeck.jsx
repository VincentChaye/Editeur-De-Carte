import React, { useState, useEffect } from "react";

export default function AccueilDeck({ onCreate }) {
	const [nom, setNom] = useState("");
	const [decksExistants, setDecksExistants] = useState([]);

	// Fonction pour récupérer les noms de decks à jour
	const chargerDecks = () => {
		const keys = Object.keys(localStorage).filter(key =>
			key.startsWith("deck_") && key.endsWith("_cartes")
		);
		const noms = keys.map(key =>
			key.replace(/^deck_/, "").replace(/_cartes$/, "")
		);
		setDecksExistants(noms);
	};

	useEffect(() => {
		chargerDecks();

		// Met à jour si localStorage change dans une autre tab (optionnel mais utile)
		window.addEventListener("storage", chargerDecks);
		return () => window.removeEventListener("storage", chargerDecks);
	}, []);

	const creerDeck = () => {
		const trimmed = nom.trim();
		if (!trimmed) return;
		onCreate(trimmed);
		setNom("");
		chargerDecks();
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-2">Créer un nouveau deck</h1>
				<input
					type="text"
					value={nom}
					onChange={(e) => setNom(e.target.value)}
					placeholder="Nom du deck"
					className="px-4 py-2 border rounded w-64"
				/>
				<button
					onClick={creerDeck}
					className="bg-blue-600 text-white px-6 py-2 rounded mt-2"
				>
					Créer le deck
				</button>
			</div>

			{decksExistants.length > 0 && (
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Decks existants</h2>
					<div className="flex flex-wrap gap-2 justify-center">
						{decksExistants.map((deck) => (
							<button
								key={deck}
								onClick={() => onCreate(deck)}
								className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
							>
								{deck}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
