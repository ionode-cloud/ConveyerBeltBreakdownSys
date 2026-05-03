// update_test.js
// Uses native fetch available in Node.js 18+

async function updateRecord() {
  const ID = "69f73aa7f02aba58bb02f4df";
  const URL = `http://localhost:62887/data/${ID}`;

  const payload = {
    operationalMetrics: {
      wind: 10,
      beltWidth: 10,
      speed: 10,
      torque: 10,
      beltTemp: 10,
      motorTemp: 10,
      voltage: 10,
      current: 10
    },
    maintenanceLog: {
      lastService: null,
      cause: "N/A"
    },
    conditionMonitoring: {
      vibration: 0,
      lubricant: "Optimal",
      tension: "Good"
    }
  };

  console.log(`Updating record ${ID}...`);

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Update Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during update:', error.message);
  }
}

updateRecord();
