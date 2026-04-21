/**
 * Adds footer.contact translations to all locale message files.
 * Removes linkedinLabel from all files.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const LOCALES = ["en", "fr", "es", "de", "it", "nl", "zh"];

const TRANSLATIONS = {
  en: { label: "Send us a message", firstName: "First name", email: "Email", message: "Message", send: "Send", sending: "Sending...", success: "Message sent!", error: "Something went wrong." },
  fr: { label: "Envoyez-nous un message", firstName: "Prénom", email: "E-mail", message: "Message", send: "Envoyer", sending: "Envoi…", success: "Message envoyé !", error: "Une erreur est survenue." },
  es: { label: "Envíenos un mensaje", firstName: "Nombre", email: "Correo electrónico", message: "Mensaje", send: "Enviar", sending: "Enviando…", success: "¡Mensaje enviado!", error: "Algo salió mal." },
  de: { label: "Senden Sie uns eine Nachricht", firstName: "Vorname", email: "E-Mail", message: "Nachricht", send: "Senden", sending: "Sende…", success: "Nachricht gesendet!", error: "Etwas ist schiefgelaufen." },
  it: { label: "Inviaci un messaggio", firstName: "Nome", email: "Email", message: "Messaggio", send: "Invia", sending: "Invio…", success: "Messaggio inviato!", error: "Qualcosa è andato storto." },
  nl: { label: "Stuur ons een bericht", firstName: "Voornaam", email: "E-mail", message: "Bericht", send: "Versturen", sending: "Verzenden…", success: "Bericht verzonden!", error: "Er is iets misgegaan." },
  zh: { label: "给我们发送消息", firstName: "名字", email: "电子邮件", message: "消息", send: "发送", sending: "发送中…", success: "消息已发送！", error: "出现了错误。" },
};

for (const locale of LOCALES) {
  const path = resolve(`messages/${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf-8"));

  // Add contact section
  data.footer.contact = TRANSLATIONS[locale];

  // Remove linkedinLabel (no longer used)
  delete data.footer.linkedinLabel;

  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`✅ ${locale}.json updated`);
}
console.log("Done.");
