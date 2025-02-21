export default {
  async fetch(request, env) {
    // Parse the URL once
    const url = new URL(request.url);
    
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

    // Handle root path
    if (url.pathname === '/') {
      return new Response('Calculator API is running!', {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // Test route for the Gemini API
    if (url.pathname === '/test-gemini' && request.headers.get('X-Debug-Key') === 'your-debug-password') {
      try {
        const apiKey = env.GEMINI_API_KEY || env.GEMINI_API_KEY_NEW;
        
        // Simple test query
        const testData = {
          contents: [
            {
              parts: [
                {
                  text: "You are a calculator. Respond with just the number 42."
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0
          }
        };
        
        // Make request to Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        
        return new Response(JSON.stringify({
          status: 'API test response',
          apiKeyExists: !!apiKey,
          apiKeyLength: apiKey ? apiKey.length : 0,
          responseStatus: response.status,
          responseBody: result
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          status: 'error',
          message: error.message,
          stack: error.stack
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Route for serving the JavaScript
    if (url.pathname === '/app.js') {
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
    if (url.pathname === '/calculate' && request.method === 'POST') {
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
                  text: "You are a calculator assistant. For the following math question, respond ONLY with the numerical answer. No words, just the number: " + query
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1
          }
        };

        // Try to get the API key from either environment variable
        const apiKey = env.GEMINI_API_KEY || env.GEMINI_API_KEY_NEW;
        
        // Make request to Gemini API
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(geminiData)
        });

        const geminiResult = await geminiResponse.json();
        
        // Log the response for debugging
        console.log('Gemini API response:', JSON.stringify(geminiResult));
        
        // Check if the response is properly formatted
        if (!geminiResult.candidates || !geminiResult.candidates[0] || 
            !geminiResult.candidates[0].content || !geminiResult.candidates[0].content.parts || 
            !geminiResult.candidates[0].content.parts[0]) {
          
          // If there's an error in the API response
          if (geminiResult.error) {
            throw new Error(`Gemini API error: ${geminiResult.error.message || JSON.stringify(geminiResult.error)}`);
          }
          
          throw new Error('Invalid response format from Gemini API');
        }
        
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
        console.error('Calculate endpoint error:', error);
        
        return new Response(JSON.stringify({ 
          error: error.message,
          details: 'An error occurred processing your request with the AI service'
        }), {
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