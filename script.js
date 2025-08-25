let currentHexData = '';
let currentCsvData = '';
let currentFileName = '';
let loadedBytes = null;

const hexTable = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
);

document.getElementById('fileInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    currentFileName = file.name.replace('.pmm', '');

    try {
        const arrayBuffer = await file.arrayBuffer();
        loadedBytes = new Uint8Array(arrayBuffer);

        document.getElementById('convertBtn').classList.remove('hidden');
    } catch (error) {
        alert('Error reading file: ' + error.message);
    }
});

document.getElementById('convertBtn').addEventListener('click', function() {
    if (!loadedBytes) {
        alert('先にファイルを選択してください。');
        return;
    }

    const hexLines = [];
    const csvLines = [];

    for (let i = 0; i < loadedBytes.length; i += 16) {
        const hexBytes = [];
        for (let j = 0; j < 16 && i + j < loadedBytes.length; j++) {
            const val = hexTable[loadedBytes[i + j]];
            hexBytes.push(val);
        }
        hexLines.push(hexBytes.join(' '));
        csvLines.push(hexBytes.join(','));
    }

    currentHexData = hexLines.join('\n');
    currentCsvData = csvLines.join('\n');

    const output = document.getElementById('output');
    output.textContent = currentHexData;
    output.classList.remove('hidden');
    document.getElementById('buttons').classList.remove('hidden');
});

document.getElementById('saveTxt').addEventListener('click', function() {
    const blob = new Blob([currentHexData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName + '_hex.txt';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('saveCsv').addEventListener('click', function() {
    const BOM = '\uFEFF';

    const csvContent = BOM + currentCsvData.replace(/\n/g, '\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName + '_hex.csv';
    a.click();
    URL.revokeObjectURL(url);
});