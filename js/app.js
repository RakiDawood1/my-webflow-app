// AI-powered calculator app that works with Webflow elements
document.addEventListener('DOMContentLoaded', () => {
  // Find all the elements by their IDs
  const calculatorForm = document.querySelector('form');
  const naturalLanguageInput = document.getElementById('query-input'); // Add this input in Webflow
  const number1Input = document.getElementById('number-1');
  const number2Input = document.getElementById('number-2');
  const answerElement = document.getElementById('answer');
  const submitButton = document.querySelector('input[type="submit"]');
  const loadingIndicator = document.getElementById('loading-indicator'); // Add this element in Webflow
  const errorMessage = document.getElementById('error-message'); // Add this element in Webflow
  
  // Your worker URL (Cloudflare worker)
  const workerURL = 'https://cf-worker.weblabsters.workers.dev'; // Your actual worker domain
  
  // Function to show/hide loading state
  function setLoading(isLoading) {
    if (loadingIndicator) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
    if (submitButton) {
      submitButton.disabled = isLoading;
    }
  }
  
  // Function to display errors
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    } else {
      console.error(message);
    }
  }
  
  // Hide error when user starts typing
  if (naturalLanguageInput) {
    naturalLanguageInput.addEventListener('input', () => {
      if (errorMessage) errorMessage.style.display = 'none';
    });
  }
  
  // Function to handle traditional calculator
  function calculateSum(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the input values and convert to numbers
    const num1 = parseFloat(number1Input.value) || 0;
    const num2 = parseFloat(number2Input.value) || 0;
    
    // Calculate the sum
    const sum = num1 + num2;
    
    // Display the result
    if (answerElement) {
      answerElement.textContent = sum;
    }
    
    // Log for debugging
    console.log(`Calculated: ${num1} + ${num2} = ${sum}`);
  }
  
  // Function to handle AI-powered natural language calculation
  async function calculateNaturalLanguage(event) {
    event.preventDefault();
    
    // Check if natural language input exists
    if (!naturalLanguageInput) {
      console.error('Natural language input not found');
      return;
    }
    
    const query = naturalLanguageInput.value.trim();
    
    // Validate input
    if (!query) {
      showError('Please enter a math question');
      return;
    }
    
    try {
      // Set loading state
      setLoading(true);
      
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
      if (answerElement) {
        answerElement.textContent = data.result;
      }
      
      console.log(`Natural language calculation: "${query}" = ${data.result}`);
      
    } catch (error) {
      showError(`Error: ${error.message}`);
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // Determine which function to use based on available inputs
  function handleFormSubmit(event) {
    event.preventDefault();
    
    if (naturalLanguageInput && naturalLanguageInput.value.trim()) {
      // If natural language input is present and has a value, use AI calculation
      calculateNaturalLanguage(event);
    } else if (number1Input && number2Input) {
      // Otherwise fall back to traditional calculator
      calculateSum(event);
    } else {
      showError('Please enter either a natural language query or numbers');
    }
  }
  
  // Add event listeners
  if (calculatorForm) {
    calculatorForm.addEventListener('submit', handleFormSubmit);
    console.log('AI Calculator initialized and ready!');
  } else if (submitButton) {
    // Find the form and attach the event to the form submission
    const form = submitButton.closest('form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      console.log('AI Calculator initialized and ready!');
    } else {
      console.error('Could not find form element');
      // Fallback: attach to button click if form not found
      submitButton.addEventListener('click', handleFormSubmit);
    }
  } else {
    console.error('Form and submit button not found');
  }
});