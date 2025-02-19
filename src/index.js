export default {
    async fetch(request, env) {
      // Define your CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Or your Webflow domain
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/javascript'
      };
  
      // Handle OPTIONS request for CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders
        });
      }
  
      // Fetch your JavaScript from GitHub
      const githubURL = 'https://raw.githubusercontent.com/RakiDawood1/my-webflow-app/main/js/app.js';
      
      try {
        const response = await fetch(githubURL);
        const jsContent = await response.text();
        
        return new Response(jsContent, {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response('Error loading script: ' + error.message, {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  };