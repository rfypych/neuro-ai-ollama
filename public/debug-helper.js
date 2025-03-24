/**
 * Neura AI Debug Helper
 * Utilitas untuk debugging Neura AI di browser
 */

// Namespace untuk debug helper
window.neuraDebug = (() => {
  console.log('🔍 Neura AI Debug Helper diinisialisasi');

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
      console.error('❌ Diagnostik gagal: Tidak dapat terhubung ke Ollama');
      return {
        status: 'error',
        message: 'Diagnostik gagal: Tidak dapat terhubung ke Ollama',
        connectionStatus
      };
    }
    
    // Mendapatkan daftar model
    const modelStatus = {};
    
    // Model default yang digunakan Neura AI
    const defaultModels = ['qwen2.5:3b', 'llama3:8b', 'mistral:7b', 'phi3:3b'];
    
    // Memeriksa setiap model
    for (const model of defaultModels) {
      modelStatus[model] = await checkOllamaModel(model);
      
      // Jika model tersedia, lakukan tes singkat
      if (modelStatus[model].status === 'success') {
        modelStatus[model].test = await testOllamaModel(model);
      }
    }
    
    console.log('✅ Diagnostik selesai');
    
    return {
      status: 'success',
      message: 'Diagnostik selesai',
      connectionStatus,
      modelStatus,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Menambahkan panel debug ke halaman
   */
  function showDebugPanel() {
    // Cek apakah panel sudah ada
    if (document.getElementById('neura-debug-panel')) {
      return;
    }
    
    const panel = document.createElement('div');
    panel.id = 'neura-debug-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 400px;
      max-height: 500px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-top-left-radius: 5px;
      z-index: 9999;
      overflow-y: auto;
      transition: all 0.3s ease;
    `;
    
    const header = document.createElement('div');
    header.innerHTML = `<h3>Neura AI Debug Panel</h3>`;
    header.style.cssText = `
      margin-bottom: 10px;
      cursor: pointer;
      user-select: none;
    `;
    
    const content = document.createElement('div');
    content.id = 'neura-debug-content';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 5px;
      margin-bottom: 10px;
    `;
    
    const runDiagButton = document.createElement('button');
    runDiagButton.textContent = 'Run Diagnostics';
    runDiagButton.style.cssText = `
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      background-color: #cc0000;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin-left: auto;
    `;
    
    const output = document.createElement('pre');
    output.id = 'neura-debug-output';
    output.style.cssText = `
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;
    
    // Tambahkan event listeners
    runDiagButton.addEventListener('click', async () => {
      output.innerHTML = 'Running diagnostics...\n';
      try {
        const results = await runDiagnostics();
        output.innerHTML = JSON.stringify(results, null, 2);
      } catch (e) {
        output.innerHTML = `Error: ${e.message}\n${e.stack}`;
      }
    });
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(panel);
    });
    
    // Tambahkan ke DOM
    buttonsContainer.appendChild(runDiagButton);
    buttonsContainer.appendChild(closeButton);
    content.appendChild(buttonsContainer);
    content.appendChild(output);
    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);
    
    // Log ke console
    console.log('🔧 Neura AI Debug Panel ditampilkan');
    
    return panel;
  }

  // Ekspos fungsi-fungsi
  return {
    checkOllamaConnection,
    checkOllamaModel,
    testOllamaModel,
    runDiagnostics,
    showDebugPanel
  };
})();

// Tambahkan shortcut keyboard untuk menampilkan panel debug
document.addEventListener('keydown', (event) => {
  // Ctrl+Shift+D
  if (event.ctrlKey && event.shiftKey && event.key === 'D') {
    window.neuraDebug.showDebugPanel();
  }
}); 