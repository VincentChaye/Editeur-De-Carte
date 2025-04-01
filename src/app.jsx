import React from "react";
import EditeurCartes from "./components/EditeurCartes";

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Éditeur de cartes de jeu</h1>
      <EditeurCartes />
    </div>
  );
}
