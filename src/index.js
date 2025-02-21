export default {
  async fetch(request, env) {
    // Define your CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Or your Webflow domain
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Route for serving the JavaScript
    if (request.url.includes('/app.js')) {
      // Fetch your JavaScript from GitHub
      const githubURL = 'https://raw.githubusercontent.com/RakiDawood1/my-webflow-app/main/js/app.js';
      
      try {
        const response = await fetch(githubURL);
        const jsContent = await response.text();
        
        return new Response(jsContent, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/javascript'
          }
        });
      } catch (error) {
        return new Response('Error loading script: ' + error.message, {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Route for handling AI calculator requests
    if (request.url.includes('/calculate') && request.method === 'POST') {
      try {
        // Get the query from the request
        const { query } = await request.json();
        
        if (!query) {
          return new Response(JSON.stringify({ error: 'Query is required' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Prepare the message for Gemini API
        const geminiData = {
          contents: [
            {
              parts: [
                {
                  text: "You are a calculator assistant that interprets natural language math questions and provides numerical answers. Respond only with the calculation result as a number, without any explanation or text."
                }
              ]
            },
            {
              parts: [
                {
                  text: query
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1
          }
        };

        // Make request to Gemini API
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(geminiData)
        });

        const geminiResult = await geminiResponse.json();
        
        // Extract just the numerical answer
        const answer = geminiResult.candidates[0].content.parts[0].text.trim();

        // Return the result
        return new Response(JSON.stringify({ 
          result: answer,
          query: query
        }), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Default response for other routes
    return new Response('Not found', {
      status: 404,
      headers: corsHeaders
    });
  }
};