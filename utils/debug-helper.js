/**
 * Utilitas untuk debugging Neura AI
 */

/**
 * Memeriksa koneksi ke server Ollama
 * @returns {Promise<Object>} Status koneksi
 */
async function checkOllamaConnection() {
  console.log('Memeriksa koneksi ke Ollama...');
  
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    
    if (!response.ok) {
      return {
        status: 'error',
        message: `API Ollama mengembalikan status ${response.status}`,
        details: await response.text().catch(() => 'Tidak dapat membaca respons')
      };
    }
    
    const data = await response.json();
    
    return {
      status: 'success',
      message: 'Koneksi ke Ollama berhasil',
      models: data.models || []
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Gagal terhubung ke Ollama',
      details: error.message || String(error)
    };
  }
}

/**
 * Memeriksa model tertentu di Ollama
 * @param {string} modelName - Nama model yang akan diperiksa
 * @returns {Promise<Object>} Status model
 */
async function checkOllamaModel(modelName) {
  console.log(`Memeriksa model Ollama: ${modelName}...`);
  
  try {
    const response = await fetch(`http://localhost:11434/api/show`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: modelName })
    });
    
    if (!response.ok) {
      return {
        status: 'error',
        message: `Model ${modelName} tidak tersedia`,
        details: await response.text().catch(() => 'Tidak dapat membaca respons')
      };
    }
    
    const data = await response.json();
    
    return {
      status: 'success',
      message: `Model ${modelName} tersedia`,
      details: data
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Gagal memeriksa model ${modelName}`,
      details: error.message || String(error)
    };
  }
}

/**
 * Tes sederhana untuk model Ollama
 * @param {string} modelName - Nama model yang akan diuji
 * @returns {Promise<Object>} Hasil tes
 */
async function testOllamaModel(modelName) {
  console.log(`Menguji model Ollama: ${modelName}...`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`http://localhost:11434/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        prompt: 'Tolong berikan respon singkat untuk mengetes model. Katakan "Tes berhasil!"',
        stream: false
      })
    });
    
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; // detik
    
    if (!response.ok) {
      return {
        status: 'error',
        message: `Gagal menguji model ${modelName}`,
        details: await response.text().catch(() => 'Tidak dapat membaca respons'),
        elapsedTime
      };
    }
    
    const data = await response.json();
    
    return {
      status: 'success',
      message: `Tes model ${modelName} berhasil`,
      response: data.response,
      elapsedTime
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Gagal menguji model ${modelName}`,
      details: error.message || String(error)
    };
  }
}

/**
 * Menjalankan semua pengecekan diagnostik
 * @returns {Promise<Object>} Hasil diagnostik
 */
async function runDiagnostics() {
  console.log('Menjalankan diagnostik Neura AI...');
  
  const connectionStatus = await checkOllamaConnection();
  
  if (connectionStatus.status === 'error') {
    return {
      status: 'error',
      message: 'Diagnostik gagal: Tidak dapat terhubung ke Ollama',
      connectionStatus
    };
  }
  
  // Mendapatkan daftar model
  const modelStatus = {};
  
  // Model default yang digunakan Neura AI
  const defaultModels = ['qwen2.5:3b', 'gemma:2b', 'tinyllama:latest'];
  
  // Memeriksa setiap model
  for (const model of defaultModels) {
    modelStatus[model] = await checkOllamaModel(model);
    
    // Jika model tersedia, lakukan tes singkat
    if (modelStatus[model].status === 'success') {
      modelStatus[model].test = await testOllamaModel(model);
    }
  }
  
  return {
    status: 'success',
    message: 'Diagnostik selesai',
    connectionStatus,
    modelStatus,
    timestamp: new Date().toISOString()
  };
}

// Ekspos fungsi-fungsi untuk digunakan di browser atau Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.neuraDebug = {
    checkOllamaConnection,
    checkOllamaModel,
    testOllamaModel,
    runDiagnostics
  };
  
  console.log('Neura AI Debug Helper tersedia melalui window.neuraDebug');
} else {
  // Node.js environment
  module.exports = {
    checkOllamaConnection,
    checkOllamaModel,
    testOllamaModel,
    runDiagnostics
  };
} 