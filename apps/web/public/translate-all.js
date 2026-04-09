// Comprehensive translation that works EVERYWHERE - no exceptions
(function() {
  'use strict';

  // Complete translation dictionary
  const translations = {
    // Spanish
    es: {
      "Home": "Inicio",
      "Menu": "Menú",
      "Cart": "Carrito",
      "Orders": "Pedidos",
      "Account": "Cuenta",
      "Login": "Iniciar Sesión",
      "Logout": "Cerrar Sesión",
      "Sign Up": "Registrarse",
      "Order Now": "Ordenar Ahora",
      "Add to Cart": "Añadir al Carrito",
      "View Cart": "Ver Carrito",
      "Continue Shopping": "Seguir Comprando",
      "Checkout": "Pagar",
      "Save": "Guardar",
      "Cancel": "Cancelar",
      "Edit": "Editar",
      "Delete": "Eliminar",
      "Remove": "Quitar",
      "Price": "Precio",
      "Total": "Total",
      "Subtotal": "Subtotal",
      "Tax": "Impuesto",
      "Discount": "Descuento",
      "Free Shipping": "Envío Gratis",
      "Quantity": "Cantidad",
      "Size": "Talla",
      "Color": "Color",
      "Weight": "Peso",
      "Description": "Descripción",
      "Ingredients": "Ingredientes",
      "Allergens": "Alérgenos",
      "Delivery": "Entrega",
      "Pickup": "Recoger",
      "Estimated Delivery": "Entrega Estimada",
      "Tracking": "Seguimiento",
      "Track Order": "Rastrear Pedido",
      "Order Status": "Estado del Pedido",
      "Preparing": "Preparando",
      "On the way": "En camino",
      "Delivered": "Entregado",
      "Cancelled": "Cancelado",
      "Payment Method": "Método de Pago",
      "Card Number": "Número de Tarjeta",
      "Expiry Date": "Fecha de Vencimiento",
      "CVV": "CVV",
      "Name on Card": "Nombre en la Tarjeta",
      "Billing Address": "Dirección de Facturación",
      "Shipping Address": "Dirección de Envío",
      "Same as shipping": "Igual que el envío",
      "Profile": "Perfil",
      "Settings": "Configuración",
      "History": "Historial",
      "Favorites": "Favoritos",
      "Address Book": "Libro de Direcciones",
      "Payment Methods": "Métodos de Pago",
      "Email": "Correo Electrónico",
      "Phone": "Teléfono",
      "Full Name": "Nombre Completo",
      "First Name": "Nombre",
      "Last Name": "Apellido",
      "Welcome": "Bienvenido",
      "Thank you": "Gracias",
      "Success": "Éxito",
      "Error": "Error",
      "Loading": "Cargando",
      "Please wait": "Por favor espera",
      "No results found": "No se encontraron resultados",
      "Try again": "Intenta de nuevo",
      "Search": "Buscar",
      "Filter": "Filtrar",
      "Sort": "Ordenar",
      "View": "Ver",
      "More": "Más",
      "Less": "Menos",
      "All": "Todos",
      "None": "Ninguno",
      "Yes": "Sí",
      "No": "No",
      "OK": "OK",
      "Back": "Atrás",
      "Next": "Siguiente",
      "Previous": "Anterior",
      "Close": "Cerrar",
      "Open": "Abrir",
      "Send": "Enviar",
      "Submit": "Enviar",
      "Restaurant": "Restaurante",
      "Cuisine": "Cocina",
      "Rating": "Calificación",
      "Hours": "Horario",
      "Location": "Ubicación",
      "Contact": "Contacto",
      "About": "Acerca de",
      "Terms of Service": "Términos de Servicio",
      "Privacy Policy": "Política de Privacidad"
    },
    // French
    fr: {
      "Home": "Accueil",
      "Menu": "Menu",
      "Cart": "Panier",
      "Orders": "Commandes",
      "Account": "Compte",
      "Login": "Se Connecter",
      "Logout": "Se Déconnecter",
      "Sign Up": "S'inscrire",
      "Order Now": "Commander Maintenant",
      "Add to Cart": "Ajouter au Panier",
      "View Cart": "Voir le Panier",
      "Continue Shopping": "Continuer vos Achats",
      "Checkout": "Payer",
      "Save": "Sauvegarder",
      "Cancel": "Annuler",
      "Edit": "Modifier",
      "Delete": "Supprimer",
      "Remove": "Supprimer",
      "Price": "Prix",
      "Total": "Total",
      "Subtotal": "Sous-total",
      "Tax": "Taxe",
      "Discount": "Réduction",
      "Free Shipping": "Livraison Gratuite",
      "Quantity": "Quantité",
      "Size": "Taille",
      "Color": "Couleur",
      "Weight": "Poids",
      "Description": "Description",
      "Ingredients": "Ingrédients",
      "Allergens": "Allergènes",
      "Delivery": "Livraison",
      "Pickup": "Emporter",
      "Estimated Delivery": "Livraison Estimée",
      "Tracking": "Suivi",
      "Track Order": "Suivre la Commande",
      "Order Status": "État de la Commande",
      "Preparing": "Préparation",
      "On the way": "En route",
      "Delivered": "Livré",
      "Cancelled": "Annulé",
      "Payment Method": "Méthode de Paiement",
      "Card Number": "Numéro de Carte",
      "Expiry Date": "Date d'Expiration",
      "CVV": "CVV",
      "Name on Card": "Nom sur la Carte",
      "Billing Address": "Adresse de Facturation",
      "Shipping Address": "Adresse de Livraison",
      "Same as shipping": "Identique à la livraison",
      "Profile": "Profil",
      "Settings": "Paramètres",
      "History": "Historique",
      "Favorites": "Favoris",
      "Address Book": "Carnet d'Adresses",
      "Payment Methods": "Méthodes de Paiement",
      "Email": "Email",
      "Phone": "Téléphone",
      "Full Name": "Nom Complet",
      "First Name": "Prénom",
      "Last Name": "Nom de Famille",
      "Welcome": "Bienvenue",
      "Thank you": "Merci",
      "Success": "Succès",
      "Error": "Erreur",
      "Loading": "Chargement",
      "Please wait": "Veuillez patienter",
      "No results found": "Aucun résultat trouvé",
      "Try again": "Réessayer",
      "Search": "Rechercher",
      "Filter": "Filtrer",
      "Sort": "Trier",
      "View": "Voir",
      "More": "Plus",
      "Less": "Moins",
      "All": "Tous",
      "None": "Aucun",
      "Yes": "Oui",
      "No": "Non",
      "OK": "OK",
      "Back": "Retour",
      "Next": "Suivant",
      "Previous": "Précédent",
      "Close": "Fermer",
      "Open": "Ouvrir",
      "Send": "Envoyer",
      "Submit": "Envoyer",
      "Restaurant": "Restaurant",
      "Cuisine": "Cuisine",
      "Rating": "Note",
      "Hours": "Horaires",
      "Location": "Emplacement",
      "Contact": "Contact",
      "About": "À Propos",
      "Terms of Service": "Conditions d'Utilisation",
      "Privacy Policy": "Politique de Confidentialité"
    },
    // German
    de: {
      "Home": "Startseite",
      "Menu": "Menü",
      "Cart": "Warenkorb",
      "Orders": "Bestellungen",
      "Account": "Konto",
      "Login": "Anmelden",
      "Logout": "Abmelden",
      "Sign Up": "Registrieren",
      "Order Now": "Jetzt Bestellen",
      "Add to Cart": "In den Warenkorb",
      "View Cart": "Warenkorb anzeigen",
      "Continue Shopping": "Weiter einkaufen",
      "Checkout": "Bezahlen",
      "Save": "Speichern",
      "Cancel": "Abbrechen",
      "Edit": "Bearbeiten",
      "Delete": "Löschen",
      "Remove": "Entfernen",
      "Price": "Preis",
      "Total": "Gesamt",
      "Subtotal": "Zwischensumme",
      "Tax": "Steuer",
      "Discount": "Rabatt",
      "Free Shipping": "Kostenloser Versand",
      "Quantity": "Menge",
      "Size": "Größe",
      "Color": "Farbe",
      "Weight": "Gewicht",
      "Description": "Beschreibung",
      "Ingredients": "Zutaten",
      "Allergens": "Allergene",
      "Delivery": "Lieferung",
      "Pickup": "Abholen",
      "Estimated Delivery": "Voraussichtliche Lieferung",
      "Tracking": "Verfolgung",
      "Track Order": "Bestellung verfolgen",
      "Order Status": "Bestellstatus",
      "Preparing": "Vorbereitung",
      "On the way": "Unterwegs",
      "Delivered": "Geliefert",
      "Cancelled": "Storniert",
      "Payment Method": "Zahlungsmethode",
      "Card Number": "Kartennummer",
      "Expiry Date": "Ablaufdatum",
      "CVV": "CVV",
      "Name on Card": "Name auf der Karte",
      "Billing Address": "Rechnungsadresse",
      "Shipping Address": "Lieferadresse",
      "Same as shipping": "Gleich wie Lieferadresse",
      "Profile": "Profil",
      "Settings": "Einstellungen",
      "History": "Verlauf",
      "Favorites": "Favoriten",
      "Address Book": "Adressbuch",
      "Payment Methods": "Zahlungsmethoden",
      "Email": "E-Mail",
      "Phone": "Telefon",
      "Full Name": "Vollständiger Name",
      "First Name": "Vorname",
      "Last Name": "Nachname",
      "Welcome": "Willkommen",
      "Thank you": "Danke",
      "Success": "Erfolg",
      "Error": "Fehler",
      "Loading": "Laden",
      "Please wait": "Bitte warten",
      "No results found": "Keine Ergebnisse gefunden",
      "Try again": "Erneut versuchen",
      "Search": "Suchen",
      "Filter": "Filtern",
      "Sort": "Sortieren",
      "View": "Anzeigen",
      "More": "Mehr",
      "Less": "Weniger",
      "All": "Alle",
      "None": "Keine",
      "Yes": "Ja",
      "No": "Nein",
      "OK": "OK",
      "Back": "Zurück",
      "Next": "Weiter",
      "Previous": "Zurück",
      "Close": "Schließen",
      "Open": "Öffnen",
      "Send": "Senden",
      "Submit": "Senden",
      "Restaurant": "Restaurant",
      "Cuisine": "Küche",
      "Rating": "Bewertung",
      "Hours": "Öffnungszeiten",
      "Location": "Standort",
      "Contact": "Kontakt",
      "About": "Über",
      "Terms of Service": "Nutzungsbedingungen",
      "Privacy Policy": "Datenschutzerklärung"
    },
    // Portuguese
    pt: {
      "Home": "Início",
      "Menu": "Menu",
      "Cart": "Carrinho",
      "Orders": "Pedidos",
      "Account": "Conta",
      "Login": "Entrar",
      "Logout": "Sair",
      "Sign Up": "Cadastrar",
      "Order Now": "Peça Agora",
      "Add to Cart": "Adicionar ao Carrinho",
      "View Cart": "Ver Carrinho",
      "Continue Shopping": "Continuar Comprando",
      "Checkout": "Pagar",
      "Save": "Salvar",
      "Cancel": "Cancelar",
      "Edit": "Editar",
      "Delete": "Excluir",
      "Remove": "Remover",
      "Price": "Preço",
      "Total": "Total",
      "Subtotal": "Subtotal",
      "Tax": "Imposto",
      "Discount": "Desconto",
      "Free Shipping": "Envio Gratuito",
      "Quantity": "Quantidade",
      "Size": "Tamanho",
      "Color": "Cor",
      "Weight": "Peso",
      "Description": "Descrição",
      "Ingredients": "Ingredientes",
      "Allergens": "Alérgenos",
      "Delivery": "Entrega",
      "Pickup": "Retirar",
      "Estimated Delivery": "Entrega Estimada",
      "Tracking": "Rastreamento",
      "Track Order": "Rastrear Pedido",
      "Order Status": "Status do Pedido",
      "Preparing": "Preparando",
      "On the way": "A caminho",
      "Delivered": "Entregue",
      "Cancelled": "Cancelado",
      "Payment Method": "Método de Pagamento",
      "Card Number": "Número do Cartão",
      "Expiry Date": "Data de Vencimento",
      "CVV": "CVV",
      "Name on Card": "Nome no Cartão",
      "Billing Address": "Endereço de Cobrança",
      "Shipping Address": "Endereço de Envio",
      "Same as shipping": "Igual ao envio",
      "Profile": "Perfil",
      "Settings": "Configurações",
      "History": "Histórico",
      "Favorites": "Favoritos",
      "Address Book": "Catálogo de Endereços",
      "Payment Methods": "Métodos de Pagamento",
      "Email": "E-mail",
      "Phone": "Telefone",
      "Full Name": "Nome Completo",
      "First Name": "Nome",
      "Last Name": "Sobrenome",
      "Welcome": "Bem-vindo",
      "Thank you": "Obrigado",
      "Success": "Sucesso",
      "Error": "Erro",
      "Loading": "Carregando",
      "Please wait": "Por favor aguarde",
      "No results found": "Nenhum resultado encontrado",
      "Try again": "Tente novamente",
      "Search": "Buscar",
      "Filter": "Filtrar",
      "Sort": "Ordenar",
      "View": "Ver",
      "More": "Mais",
      "Less": "Menos",
      "All": "Todos",
      "None": "Nenhum",
      "Yes": "Sim",
      "No": "Não",
      "OK": "OK",
      "Back": "Voltar",
      "Next": "Próximo",
      "Previous": "Anterior",
      "Close": "Fechar",
      "Open": "Abrir",
      "Send": "Enviar",
      "Submit": "Enviar",
      "Restaurant": "Restaurante",
      "Cuisine": "Cocina",
      "Rating": "Avaliação",
      "Hours": "Horário",
      "Location": "Localização",
      "Contact": "Contato",
      "About": "Sobre",
      "Terms of Service": "Termos de Serviço",
      "Privacy Policy": "Política de Privacidade"
    },
    // Italian
    it: {
      "Home": "Home",
      "Menu": "Menu",
      "Cart": "Carrello",
      "Orders": "Ordini",
      "Account": "Account",
      "Login": "Accedi",
      "Logout": "Esci",
      "Sign Up": "Registrati",
      "Order Now": "Ordina Ora",
      "Add to Cart": "Aggiungi al Carrello",
      "View Cart": "Vedi Carrello",
      "Continue Shopping": "Continua gli Acquisti",
      "Checkout": "Paga",
      "Save": "Salva",
      "Cancel": "Annulla",
      "Edit": "Modifica",
      "Delete": "Elimina",
      "Remove": "Rimuovi",
      "Price": "Prezzo",
      "Total": "Totale",
      "Subtotal": "Subtotale",
      "Tax": "Tassa",
      "Discount": "Sconto",
      "Free Shipping": "Spedizione Gratuita",
      "Quantity": "Quantità",
      "Size": "Taglia",
      "Color": "Colore",
      "Weight": "Peso",
      "Description": "Descrizione",
      "Ingredients": "Ingredienti",
      "Allergens": "Allergeni",
      "Delivery": "Consegna",
      "Pickup": "Ritiro",
      "Estimated Delivery": "Consegna Stimata",
      "Tracking": "Tracciamento",
      "Track Order": "Traccia Ordine",
      "Order Status": "Stato Ordine",
      "Preparing": "In Preparazione",
      "On the way": "In Viaggio",
      "Delivered": "Consegnato",
      "Cancelled": "Annullato",
      "Payment Method": "Metodo di Pagamento",
      "Card Number": "Numero di Carta",
      "Expiry Date": "Data di Scadenza",
      "CVV": "CVV",
      "Name on Card": "Nome sulla Carta",
      "Billing Address": "Indirizzo di Fatturazione",
      "Shipping Address": "Indirizzo di Spedizione",
      "Same as shipping": "Uguale alla spedizione",
      "Profile": "Profilo",
      "Settings": "Impostazioni",
      "History": "Cronologia",
      "Favorites": "Preferiti",
      "Address Book": "Rubrica",
      "Payment Methods": "Metodi di Pagamento",
      "Email": "Email",
      "Phone": "Telefono",
      "Full Name": "Nome Completo",
      "First Name": "Nome",
      "Last Name": "Cognome",
      "Welcome": "Benvenuto",
      "Thank you": "Grazie",
      "Success": "Successo",
      "Error": "Errore",
      "Loading": "Caricamento",
      "Please wait": "Attendi prego",
      "No results found": "Nessun risultato trovato",
      "Try again": "Riprova",
      "Search": "Cerca",
      "Filter": "Filtra",
      "Sort": "Ordina",
      "View": "Vedi",
      "More": "Più",
      "Less": "Meno",
      "All": "Tutti",
      "None": "Nessuno",
      "Yes": "Sì",
      "No": "No",
      "OK": "OK",
      "Back": "Indietro",
      "Next": "Successivo",
      "Previous": "Precedente",
      "Close": "Chiudi",
      "Open": "Apri",
      "Send": "Invia",
      "Submit": "Invia",
      "Restaurant": "Ristorante",
      "Cuisine": "Cucina",
      "Rating": "Valutazione",
      "Hours": "Orari",
      "Location": "Posizione",
      "Contact": "Contatto",
      "About": "Informazioni",
      "Terms of Service": "Termini di Servizio",
      "Privacy Policy": "Informativa sulla Privacy"
    },
    // Dutch
    nl: {
      "Home": "Home",
      "Menu": "Menu",
      "Cart": "Winkelmand",
      "Orders": "Bestellingen",
      "Account": "Account",
      "Login": "Inloggen",
      "Logout": "Uitloggen",
      "Sign Up": "Registreren",
      "Order Now": "Bestel Nu",
      "Add to Cart": "Toevoegen aan Winkelmand",
      "View Cart": "Bekijk Winkelmand",
      "Continue Shopping": "Verder Winkelen",
      "Checkout": "Afrekenen",
      "Save": "Opslaan",
      "Cancel": "Annuleren",
      "Edit": "Bewerken",
      "Delete": "Verwijderen",
      "Remove": "Verwijderen",
      "Price": "Prijs",
      "Total": "Totaal",
      "Subtotal": "Subtotaal",
      "Tax": "Belasting",
      "Discount": "Korting",
      "Free Shipping": "Gratis Verzending",
      "Quantity": "Hoeveelheid",
      "Size": "Maat",
      "Color": "Kleur",
      "Weight": "Gewicht",
      "Description": "Beschrijving",
      "Ingredients": "Ingrediënten",
      "Allergens": "Allergenen",
      "Delivery": "Levering",
      "Pickup": "Afhalen",
      "Estimated Delivery": "Geschatte Levering",
      "Tracking": "Tracking",
      "Track Order": "Volg Bestelling",
      "Order Status": "Bestelstatus",
      "Preparing": "Voorbereiden",
      "On the way": "Onderweg",
      "Delivered": "Geleverd",
      "Cancelled": "Geannuleerd",
      "Payment Method": "Betalingsmethode",
      "Card Number": "Kaartnummer",
      "Expiry Date": "Vervaldatum",
      "CVV": "CVV",
      "Name on Card": "Naam op Kaart",
      "Billing Address": "Factuuradres",
      "Shipping Address": "Verzendadres",
      "Same as shipping": "Zelfde als verzending",
      "Profile": "Profiel",
      "Settings": "Instellingen",
      "History": "Geschiedenis",
      "Favorites": "Favorieten",
      "Address Book": "Adresboek",
      "Payment Methods": "Betalingsmethoden",
      "Email": "E-mail",
      "Phone": "Telefoon",
      "Full Name": "Volledige Naam",
      "First Name": "Voornaam",
      "Last Name": "Achternaam",
      "Welcome": "Welkom",
      "Thank you": "Dank je",
      "Success": "Succes",
      "Error": "Fout",
      "Loading": "Laden",
      "Please wait": "Even geduld",
      "No results found": "Geen resultaten gevonden",
      "Try again": "Probeer opnieuw",
      "Search": "Zoeken",
      "Filter": "Filter",
      "Sort": "Sorteren",
      "View": "Bekijken",
      "More": "Meer",
      "Less": "Minder",
      "All": "Alle",
      "None": "Geen",
      "Yes": "Ja",
      "No": "Nee",
      "OK": "OK",
      "Back": "Terug",
      "Next": "Volgende",
      "Previous": "Vorige",
      "Close": "Sluiten",
      "Open": "Openen",
      "Send": "Verzenden",
      "Submit": "Indienen",
      "Restaurant": "Restaurant",
      "Cuisine": "Keuken",
      "Rating": "Beoordeling",
      "Hours": "Openingstijden",
      "Location": "Locatie",
      "Contact": "Contact",
      "About": "Over",
      "Terms of Service": "Servicevoorwaarden",
      "Privacy Policy": "Privacybeleid"
    }
  };

  // Function to translate text
  function translateText(text, lang) {
    if (!text || !lang || lang === 'en') return text;

    const langTranslations = translations[lang];
    if (!langTranslations) return text;

    // Try exact match first
    if (langTranslations[text]) {
      return langTranslations[text];
    }

    // Try case-insensitive match
    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(langTranslations)) {
      if (key.toLowerCase() === lowerText) {
        return value;
      }
    }

    // Try partial match
    for (const [key, value] of Object.entries(langTranslations)) {
      if (lowerText.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerText)) {
        return value;
      }
    }

    return text;
  }

  // Function to get all text nodes and elements
  function getAllTextNodesAndElements() {
    const textNodes = [];
    const elements = [];

    // Get all elements that might contain text
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
      // Skip script, style, noscript tags
      const tagName = element.tagName?.toLowerCase();
      if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
        return;
      }

      // Skip elements with translate="no"
      if (element.hasAttribute && element.hasAttribute('translate') && element.getAttribute('translate') === 'no') {
        return;
      }

      // Skip elements with class="notranslate"
      if (element.classList && element.classList.contains('notranslate')) {
        return;
      }

      // Collect the element if it's one we want to translate
      if (['BUTTON', 'A', 'SPAN', 'DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'LABEL'].includes(element.tagName)) {
        elements.push(element);
      }

      // Get all text nodes in this element
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip empty text nodes
            if (!node.textContent || !node.textContent.trim()) {
              return NodeFilter.FILTER_REJECT;
            }

            // Skip if parent is excluded
            let parent = node.parentElement;
            while (parent) {
              const parentTag = parent.tagName?.toLowerCase();
              if (parentTag === 'script' || parentTag === 'style' || parentTag === 'noscript') {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.hasAttribute && parent.hasAttribute('translate') && parent.getAttribute('translate') === 'no') {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.classList && parent.classList.contains('notranslate')) {
                return NodeFilter.FILTER_REJECT;
              }
              parent = parent.parentElement;
            }

            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
    });

    return { textNodes, elements };
  }

  // Function to translate all content including dynamic elements
  function translateAllContent() {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['es', 'fr', 'de', 'pt', 'it', 'nl'];

    // Only translate if not English and language is supported
    if (supportedLangs.includes(browserLang) && browserLang !== 'en') {
      // Get all text nodes and elements
      const { textNodes, elements } = getAllTextNodesAndElements();

      // Translate text nodes
      textNodes.forEach(textNode => {
        const originalText = textNode.textContent || '';
        if (originalText.trim()) {
          const translatedText = translateText(originalText.trim(), browserLang);
          textNode.textContent = translatedText;
        }
      });

      // Translate elements with text content
      elements.forEach(element => {
        // Handle button text
        if (element.tagName === 'BUTTON') {
          const textContent = element.textContent || '';
          if (textContent.trim()) {
            const translated = translateText(textContent.trim(), browserLang);
            element.textContent = translated;
          }
        }
        // Handle anchor text
        else if (element.tagName === 'A') {
          const linkText = element.textContent || '';
          if (linkText.trim()) {
            const translated = translateText(linkText.trim(), browserLang);
            element.textContent = translated;
          }
        }
        // Handle span/div/p/h1-h6 text
        else if (element.tagName === 'SPAN' || element.tagName === 'DIV' ||
                   element.tagName === 'P' || element.tagName.startsWith('H')) {
          const textContent = element.textContent || '';
          if (textContent.trim()) {
            const translated = translateText(textContent.trim(), browserLang);
            element.textContent = translated;
          }
        }
        // Handle list items
        else if (element.tagName === 'LI') {
          const textContent = element.textContent || '';
          if (textContent.trim()) {
            const translated = translateText(textContent.trim(), browserLang);
            element.textContent = translated;
          }
        }
        // Handle label text
        else if (element.tagName === 'LABEL') {
          const labelText = element.textContent || element.getAttribute('aria-label') || '';
          if (labelText.trim()) {
            const translated = translateText(labelText.trim(), browserLang);
            element.textContent = translated;
          }
        }
        // Handle title attributes
        if (element.hasAttribute('title')) {
          const title = element.getAttribute('title');
          if (title) {
            const translated = translateText(title, browserLang);
            element.setAttribute('title', translated);
          }
        }
        // Handle alt text for images
        if (element.hasAttribute('alt')) {
          const alt = element.getAttribute('alt');
          if (alt) {
            const translated = translateText(alt, browserLang);
            element.setAttribute('alt', translated);
          }
        }
        // Handle placeholder text
        if (element.hasAttribute('placeholder')) {
          const placeholder = element.getAttribute('placeholder');
          if (placeholder) {
            const translated = translateText(placeholder, browserLang);
            element.setAttribute('placeholder', translated);
          }
        }
      });
    }
  }

  // Function to wait for and re-translate (for dynamic content)
  function retranslateAfterDelay() {
    const browserLang = navigator.language.split('-')[0];
    setTimeout(() => {
      translateAllContent();
      // Keep rechecking for content that might load
      setInterval(() => translateAllContent(), 2000);
    }, 500);
  }

  // Auto-translate when DOM is ready
  function initTranslation() {
    // Initial translation
    translateAllContent();

    // Re-translate periodically for dynamic content
    retranslateAfterDelay();

    // Observe DOM mutations for new content
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        let hasChanges = false;

        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            hasChanges = true;
          }
        });

        if (hasChanges) {
          retranslateAfterDelay();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  }

  // Start translation
  initTranslation();
})();