# QualityMeasurementApp


## Use Cases

### UC-JS-01: Load Units
Fetches units based on selected type from API.

- Input: Measurement type (length, weight, etc.)
- Output: List of units with symbol and label

---

### UC-JS-02: Select Measurement Type
Allows user to switch between measurement categories.

- Updates unit dropdown dynamically  
- Triggers recalculation  

---

### UC-JS-03: Select Action
User selects operation mode.

- Conversion  
- Comparison  
- Arithmetic  

Updates UI and logic accordingly.

---

### UC-JS-04: Save History
Stores each calculation in backend.

- Endpoint: `POST /history`  
- Includes type, action, result, timestamp  

---

### UC-JS-05: Trigger Calculation
Runs calculation when:

- Input value changes  
- Unit changes  
- Action changes  

---

### UC-JS-06: Load History
Fetches history records from backend.

- Endpoint: `GET /history?_sort=timestamp&_order=desc`  
- Returns latest records first  

---

### UC-JS-07: Apply Conversion
Converts value using factor or formula.

- Uses API conversion data  
- Returns result rounded to 6 decimal places  

---

### UC-JS-08: Compare Two Values
Compares two values after normalizing to base unit.

- Output:
  - Greater than  
  - Less than  
  - Equal  

---

### UC-JS-09: Arithmetic Operation
Performs arithmetic on two measurements.

- Second value is converted to first unit  
- Supports `+`, `−`, `×`, `÷`  
- Handles divide by zero  

---

### UC-JS-10: Handle Same Unit Conversion
If `fromUnit === toUnit`:

- Returns value directly  
- Avoids API call  

---

### UC-JS-11: Handle Invalid Input
Prevents calculation when:

- Input is NaN  
- Units are not selected  

---

### UC-JS-12: Dynamic Unit Population
Populates dropdown using API data.

- Removes hardcoded options  
- Supports all measurement types  

---

### UC-JS-13: Display Result
Shows output in UI.

- Conversion: single value  
- Arithmetic: base + converted value  
- Comparison: readable statement  

---

### UC-JS-14: Arithmetic UI Control
Shows arithmetic controls only when needed.

- Operator and second value input visible only in Arithmetic mode  

---

### UC-JS-15: Multi-Type Support
Supports:

- Length  
- Weight  
- Temperature  
- Volume  

Units change dynamically per type.

---

### UC-JS-16: Error Handling
Handles API and logic errors.

- Conversion not available  
- Invalid formula  
- Divide by zero  

Displays fallback or message.

---

### UC-JS-17: Application Initialization
On page load:

1. Attach event listeners  
2. Load default units (length)  
3. Set default action  
4. Load history  
5. Trigger initial calculation  

---

## Tech Stack

- HTML  
- CSS  
- JavaScript (ES6 Modules)  
- json-server (mock backend)  
- Fetch API  






Fetch API
