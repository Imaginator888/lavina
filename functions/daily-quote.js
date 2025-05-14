// Serverless Function for Daily Quote from aalavina.org
const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  try {
    // Fetch the homepage content
    const response = await axios.get('https://www.aalavina.org/');
    const html = response.data;
    
    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(html);
    
    // Look for the daily quote element
    let quoteText = "";
    
    // Try to find the daily quote on the page
    $('*:contains("Cita Diaria")').each(function() {
      const element = $(this);
      const text = element.text().trim();
      
      // Look for text that seems like a quote
      if (text.includes("Cita Diaria") && text.length > 20 && text.length < 500) {
        quoteText = text;
        return false; // Break the loop
      }
    });
    
    // Format the date in Spanish
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const today = new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const currentDate = `${day} de ${month}`;
    
    // If we found a quote, return it
    if (quoteText) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow cross-origin requests
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: currentDate,
          quote: quoteText,
          source: "AA La Viña"
        })
      };
    } else {
      // If we couldn't find a quote, return a default one
      const defaultQuotes = [
        "El programa de AA funciona cuando yo trabajo en él.",
        "Escucha y aprende; comparte y crece.",
        "Un día a la vez.",
        "Lo primero es lo primero.",
        "Vive y deja vivir."
      ];
      
      const randomIndex = Math.floor(Math.random() * defaultQuotes.length);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: currentDate,
          quote: defaultQuotes[randomIndex],
          source: "AA La Viña",
          note: "Default quote - could not fetch from source"
        })
      };
    }
  } catch (error) {
    console.log("Error fetching quote:", error);
    
    // Return a default quote if there's an error
    const defaultQuotes = [
      "El programa de AA funciona cuando yo trabajo en él.",
      "Escucha y aprende; comparte y crece.",
      "Un día a la vez.",
      "Lo primero es lo primero.",
      "Vive y deja vivir."
    ];
    
    const randomIndex = Math.floor(Math.random() * defaultQuotes.length);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const today = new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const currentDate = `${day} de ${month}`;
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: currentDate,
        quote: defaultQuotes[randomIndex],
        source: "AA La Viña",
        note: "Error quote - could not fetch from source"
      })
    };
  }
};
