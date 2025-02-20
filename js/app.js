// Calculator app that works with Webflow elements
document.addEventListener('DOMContentLoaded', () => {
  // Find the form elements by their IDs
  const number1Input = document.getElementById('number-1');
  const number2Input = document.getElementById('number-2');
  const answerElement = document.getElementById('answer');
  const submitButton = document.querySelector('input[type="submit"]');
  
  // Function to calculate and display the sum
  function calculateSum(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the input values and convert to numbers
    const num1 = parseFloat(number1Input.value) || 0;
    const num2 = parseFloat(number2Input.value) || 0;
    
    // Calculate the sum
    const sum = num1 + num2;
    
    // Display the result
    answerElement.textContent = sum;
    
    // Log for debugging
    console.log(`Calculated: ${num1} + ${num2} = ${sum}`);
  }
  
  // Add the event listener to the submit button
  if (submitButton) {
    // Find the form and attach the event to the form submission
    const form = submitButton.closest('form');
    if (form) {
      form.addEventListener('submit', calculateSum);
      console.log('Calculator initialized and ready!');
    } else {
      console.error('Could not find form element');
      // Fallback: attach to button click if form not found
      submitButton.addEventListener('click', calculateSum);
    }
  } else {
    console.error('Submit button not found');
  }
  
  // Optional: Add real-time calculation as user types
  function updateCalculation() {
    const num1 = parseFloat(number1Input.value) || 0;
    const num2 = parseFloat(number2Input.value) || 0;
    const sum = num1 + num2;
    
    // Update the answer in real-time
    answerElement.textContent = sum;
  }
  
  // Uncomment these lines if you want real-time calculation
  // number1Input.addEventListener('input', updateCalculation);
  // number2Input.addEventListener('input', updateCalculation);
});