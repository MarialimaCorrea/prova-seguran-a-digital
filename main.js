/* ==========================================================================
   Configuração e Seleção de Elementos
   ========================================================================== */
const passwordDisplay = document.getElementById('password-display');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');

const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');

const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const strengthBar = document.getElementById('strength-bar-fill');
const strengthText = document.getElementById('strength-text-val');

// Dicionários de caracteres
const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/* ==========================================================================
   Funções de Geração (Segurança Criptográfica)
   ========================================================================== */

/**
 * Gera um número inteiro aleatório seguro usando a Crypto API do navegador.
 * Evita a previsibilidade do Math.random().
 */
function getSecureRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

/**
 * Função principal para gerar a senha com base nas opções do usuário.
 */
function generatePassword() {
    const length = parseInt(lengthInput.value);
    let allowedChars = '';
    let password = '';

    // Garante que pelo menos um caractere de cada tipo selecionado entre na senha
    const guaranteedChars = [];

    if (uppercaseEl.checked) {
        allowedChars += CHAR_SETS.uppercase;
        guaranteedChars.push(CHAR_SETS.uppercase[getSecureRandomInt(CHAR_SETS.uppercase.length)]);
    }
    if (lowercaseEl.checked) {
        allowedChars += CHAR_SETS.lowercase;
        guaranteedChars.push(CHAR_SETS.lowercase[getSecureRandomInt(CHAR_SETS.lowercase.length)]);
    }
    if (numbersEl.checked) {
        allowedChars += CHAR_SETS.numbers;
        guaranteedChars.push(CHAR_SETS.numbers[getSecureRandomInt(CHAR_SETS.numbers.length)]);
    }
    if (symbolsEl.checked) {
        allowedChars += CHAR_SETS.symbols;
        guaranteedChars.push(CHAR_SETS.symbols[getSecureRandomInt(CHAR_SETS.symbols.length)]);
    }

    // Se nenhuma opção for selecionada, exibe aviso e limpa o campo
    if (allowedChars.length === 0) {
        passwordDisplay.textContent = "Selecione uma opção!";
        updateStrengthMeter(0);
        return;
    }

    // Preenche o restante do comprimento da senha com caracteres aleatórios permitidos
    const remainingLength = length - guaranteedChars.length;
    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = getSecureRandomInt(allowedChars.length);
        password += allowedChars[randomIndex];
    }

    // Adiciona os caracteres garantidos de volta
    password += guaranteedChars.join('');

    // Embaralha o resultado final de forma segura para não deixar os caracteres garantidos no final
    password = shuffleString(password);

    // Renderiza na tela e calcula a força
    passwordDisplay.textContent = password;
    evaluateStrength(password, length);
}

/**
 * Embaralha uma string usando o algoritmo Fisher-Yates com Crypto API.
 */
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getSecureRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

/* ==========================================================================
   Validação de Força (Strength Meter)
   ========================================================================== */

function evaluateStrength(password, length) {
    let score = 0;

    // Critério 1: Comprimento (Boas práticas exigem pelo menos 12 caracteres)
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    // Critério 2: Diversidade de tipos
    let typesCount = 0;
    if (/[A-Z]/.test(password)) typesCount++;
    if (/[a-z]/.test(password)) typesCount++;
    if (/[0-9]/.test(password)) typesCount++;
    if (/[^A-Za-z0-9]/.test(password)) typesCount++;

    score += Math.floor(typesCount / 2);

    updateStrengthMeter(score);
}

function updateStrengthMeter(score) {
    // Limpa classes anteriores
    strengthBar.className = 'strength-bar-fill';
    
    if (score <= 1) {
        strengthBar.classList.add('fraca');
        strengthText.textContent = 'Fraca';
    } else if (score === 2 || score === 3) {
        strengthBar.classList.add('media');
        strengthText.textContent = 'Média';
    } else if (score === 4) {
        strengthBar.classList.add('forte');
        strengthText.textContent = 'Forte';
    } else {
        strengthBar.classList.add('excelente');
        strengthText.textContent = 'Excelente 🎉';
    }
}

/* ==========================================================================
   Funcionalidade de Cópia (Clipboard API)
   ========================================================================== */

async function copyToClipboard() {
    const password = passwordDisplay.textContent;
    
    if (!password || password === "Selecione uma opção!" || password === "Senha Copiada!") {
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        
        // Feedback visual temporário de sucesso
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓';
        copyBtn.style.color = '#10b981'; // Muda para verde temporariamente
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.color = ''; // Reseta para o CSS original (azul)
        }, 2000);

    } catch (err) {
        console.error('Erro ao copiar: ', err);
    }
}

/* ==========================================================================
   Event Listeners (Eventos)
   ========================================================================== */

// Atualiza o texto do tamanho dinamicamente ao mover o slider
lengthInput.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

// Gera uma nova senha ao clicar no botão
generateBtn.addEventListener('click', generatePassword);

// Copia a senha ao clicar no botão de