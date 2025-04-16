const API_URL = "http://localhost:5000/api/decks";

/**
 * Récupère tous les decks depuis le backend.
 */
export const getDecks = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erreur lors du chargement des decks");
  return await res.json();
};

/**
 * Récupère un deck spécifique par son ID.
 */
export const getDeckById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Deck non trouvé");
  return await res.json();
};

/**
 * Crée un nouveau deck dans la base de données.
 */
export const publierDeck = async (deck) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error("Erreur lors de la publication");
  return await res.json();
};

/**
 * Supprime un deck par son ID.
 */
export const supprimerDeck = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return await res.json();
};

/**
 * Met à jour un deck par son ID.
 */
export const updateDeck = async (id, newData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return await res.json();
};
