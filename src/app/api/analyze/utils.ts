import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export const extractVisibleText = (html: string) => {
  // Verwende readability, um den Hauptinhalt zu extrahieren
  const dom = new JSDOM(html);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  // Gib den extrahierten Text zurück, falls vorhanden, ansonsten einen leeren String
  return article ? article.textContent.trim() : '';
};

export const getMainContent = (html: string) => {
  // Diese Funktion ist nun redundant, da extractVisibleText bereits den Hauptinhalt extrahiert
  return extractVisibleText(html);
};
