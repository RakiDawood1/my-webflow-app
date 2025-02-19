// This will run when your script is loaded in Webflow
document.addEventListener('DOMContentLoaded', () => {
    // Target Webflow elements using their IDs or classes
    // For example:
    const targetElement = document.querySelector('.my-webflow-element');
    if (targetElement) {
      // Your functionality here
      console.log('Connected to Webflow element!');
      
      // Example: Add event listeners
      targetElement.addEventListener('click', () => {
        console.log('Webflow element clicked!');
        // Your logic here
      });
    }
  });
  
  // If you need to expose functions globally for Webflow interactions
  window.myAppFunction = function() {
    // Function that can be called from Webflow interactions
    alert('Function called from Webflow!');
  };