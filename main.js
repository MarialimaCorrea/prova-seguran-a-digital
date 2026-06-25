const chars = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>/?"
};

function updateLength(val) {
    document.getElementById('length-val').textContent = val;
    document.getElementById('length-value').textContent = val;
}

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 5) return { level: "Muito Forte", width: "100%", color: "#22C55E" };
    if (score >= 4) return { level: "Forte", width: "80%", color: "#4ADE80" };
    if (score >= 3) return { level: "Média", width: "55%", color: "#FACC15" };
    return { level: "Fraca", width: "25%", color: "#EF4444" };
}

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const useUpper = document.getElementById('uppercase').checked;
    const useLower = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;

    let availableChars = "";
    if (useUpper) availableChars += chars.uppercase;
    if (useLower) availableChars += chars.lowercase;
    if (useNumbers) availableChars += chars.numbers;
    if (useSymbols) availableChars += chars.symbols;

    if (availableChars === "") {
        availableChars = chars.lowercase + chars.uppercase;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }

    // Garantir diversidade
    if (useUpper && !/[A-Z]/.test(password)) {
        password = password.slice(0, -1) + chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
    }
    if (useLower && !/[a-z]/.test(password)) {
        password = password.slice(0, -1) + chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
    }
    if (useNumbers && !/\d/.test(password)) {
        password = password.slice(0, -1) + chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    }
    if (useSymbols && !/[^A-Za-z0-9]/.test(password)) {
        password = password.slice(0, -1) + chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    }

    document.getElementById('password').textContent = password;
    
    const strength = getPasswordStrength(password);
    const fill = document.getElementById('strength-fill');
    fill.style.width = strength.width;
    fill.style.background = strength.color;
    document.getElementById('strength-text').textContent = strength.level;

    const crackTimeEl = document.getElementById('crack-time');
    if (strength.level === "Muito Forte") {
        crackTimeEl.innerHTML = `Um supercomputador levaria <strong>milhares de anos</strong> para quebrar esta senha.`;
    } else if (strength.level === "Forte") {
        crackTimeEl.innerHTML = `Levaria <strong>décadas</strong> para ser descoberta.`;
    } else {
        crackTimeEl.innerHTML = `Um computador levaria <strong>anos</strong> para descobrir esta senha.`;
    }
}

function copyPassword() {
    const passwordText = document.getElementById('password').textContent;
    if (passwordText === "Clique em Gerar") return;

    navigator.clipboard.writeText(passwordText).then(() => {
        const toast = document.getElementById('toast');
        toast.style.display = 'flex';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500);
    });
}

// Inicializar
window.onload = function() {
    generatePassword();
    
    document.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
            generatePassword();
        }
    });
};