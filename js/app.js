// AI-powered calculator app that works with Webflow elements
document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded, initializing calculator...');

  // Find the elements by their IDs
  const calculatorForm = document.getElementById('calculator-form');
  const queryInput = document.getElementById('text-form');
  const answerElement = document.getElementById('answer-text');
  
  // Log whether elements were found
  console.log('Form found:', !!calculatorForm);
  console.log('Input found:', !!queryInput);
  console.log('Answer element found:', !!answerElement);
  
  // Your worker URL (Cloudflare worker)
  const workerURL = 'https://cf-worker.weblabsters.workers.dev';
  
  // Function to display errors
  function showError(message) {
    console.error('Error:', message);
    if (answerElement) {
      answerElement.textContent = `Error: ${message}`;
    }
  }
  
  // Function to handle natural language calculation
  async function handleCalculation(event) {
    console.log('Form submission intercepted');
    event.preventDefault(); // Prevent form from submitting normally
    
    // Check if natural language input exists
    if (!queryInput) {
      console.error('Query input not found');
      return;
    }
    
    const query = queryInput.value.trim();
    console.log('Query:', query);
    
    // Validate input
    if (!query) {
      showError('Please enter a math question');
      return;
    }
    
    try {
      // Show loading state
      if (answerElement) {
        answerElement.textContent = 'Calculating...';
      }
      
      console.log('Sending request to worker:', `${workerURL}/calculate`);
      
      // Send the query to our worker
      const response = await fetch(`${workerURL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to get calculation: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      // Display the result
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Display the result
      if (answerElement) {
        answerElement.textContent = data.result;
      }
      
      console.log(`Calculation complete: "${query}" = ${data.result}`);
      
    } catch (error) {
      showError(error.message);
      console.error('Calculation error:', error);
    }
  }
  
  // Add event listeners
  if (calculatorForm) {
    // Add both submit and click handlers to ensure we catch the event
    calculatorForm.addEventListener('submit', handleCalculation);
    
    // Find the submit button and add a click handler
    const submitButton = calculatorForm.querySelector('input[type="submit"]') || 
                        calculatorForm.querySelector('button[type="submit"]') ||
                        calculatorForm.querySelector('button');
                        
    if (submitButton) {
      console.log('Submit button found, adding click handler');
      submitButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default button behavior
        handleCalculation(e);
      });
    } else {
      console.error('Submit button not found');
    }
    
    console.log('AI Calculator initialized and ready!');
  } else {
    console.error('Calculator form not found');
  }
});