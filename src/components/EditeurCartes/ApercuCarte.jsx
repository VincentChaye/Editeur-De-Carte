import React from "react";

export default function ApercuCarte({ champs, largeur, hauteur, cardRef, cmToPx }) {
  return (
    <div
      ref={cardRef}
      style={{
        width: `${cmToPx(largeur)}px`,
        height: `${cmToPx(hauteur)}px`,
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
        const alignment = champ.align === "center"
          ? "center"
          : champ.align === "right"
          ? "flex-end"
          : "flex-start";

        const offsetStyle =
          champ.align === "left"
            ? { left: `${champ.offset}px` }
            : champ.align === "right"
            ? { right: `${champ.offset}px` }
            : { left: "50%" };

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
  );
}
