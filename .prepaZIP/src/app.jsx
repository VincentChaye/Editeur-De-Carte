import React, { useState, useEffect } from "react";
import AccueilDeck from "./AccueilDeck";
import EditeurCartes from "./EditeurCartes";

export default function App() {
	const [deckNom, setDeckNom] = useState("");

	useEffect(() => {
		const saved = localStorage.getItem("deck_nom");
		if (saved) setDeckNom(saved);
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			{deckNom ? (
				<EditeurCartes
					deckNom={deckNom}
					onReset={() => {
						setDeckNom("");
						localStorage.removeItem("deck_nom");
					}}
				/>
			) : (
				<AccueilDeck
					onCreate={(nom) => {
						setDeckNom(nom);
						localStorage.setItem("deck_nom", nom);
					}}
				/>
			)}
		</div>
	);
}
