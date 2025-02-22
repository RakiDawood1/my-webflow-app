// AI-powered calculator app that works with Webflow elements
document.addEventListener('DOMContentLoaded', () => {
  // Find the elements by their IDs
  const calculatorForm = document.getElementById('calculator-form');
  const queryInput = document.getElementById('text-form');
  const answerElement = document.getElementById('answer-text');
  
  // Your worker URL (Cloudflare worker)
  const workerURL = 'https://cf-worker.weblabsters.workers.dev';
  
  // Function to display errors
  function showError(message) {
    answerElement.textContent = `Error: ${message}`;
  }
  
  // Function to handle natural language calculation
  async function handleCalculation(event) {
    event.preventDefault();
    
    // Check if natural language input exists
    if (!queryInput) {
      console.error('Query input not found');
      return;
    }
    
    const query = queryInput.value.trim();
    
    // Validate input
    if (!query) {
      showError('Please enter a math question');
      return;
    }
    
    try {
      // Show loading state
      answerElement.textContent = 'Calculating...';
      
      // Send the query to our worker
      const response = await fetch(`${workerURL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get calculation');
      }
      
      const data = await response.json();
      
      // Display the result
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Display the result
      answerElement.textContent = data.result;
      
      console.log(`Calculation: "${query}" = ${data.result}`);
      
    } catch (error) {
      showError(error.message);
      console.error('Calculation error:', error);
    }
  }
  
  // Add event listeners
  if (calculatorForm) {
    calculatorForm.addEventListener('submit', handleCalculation);
    console.log('AI Calculator initialized and ready!');
  } else {
    console.error('Calculator form not found');
  }
});