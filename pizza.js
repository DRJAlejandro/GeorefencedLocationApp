function validateInputs() {
    // Get the values of the inputs
    var latitud = parseFloat(document.getElementById("latitud").value);
    var longitud = parseFloat(document.getElementById("longitud").value);
    
    // Check if the values are outside the allowed range
    if (latitud < 20.93533 || latitud > 21.18545 || longitud < -101.86089 || longitud > -101.2172) {
      // Show an alert and clear the inputs
      alert("Valor fuera del rango");
      document.getElementById("latitud").value = "";
      document.getElementById("longitud").value = "";
      return false; // Prevent the form from submitting
    }
    
    // If the values are within the allowed range, allow the form to submit
    return true;
  }

  