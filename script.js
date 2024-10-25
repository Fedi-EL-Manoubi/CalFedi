let operateur = '';
let theme = 'light';

// Définir le thème initial
document.documentElement.setAttribute('data-theme', theme);

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const themeButton = document.getElementById('themeButton');
    themeButton.textContent = theme === 'light' ? '🌙' : '☀️';
}

function setOperator(op) {
    operateur = op;
    updateExpression();
    
    // Mettre en évidence l'opérateur sélectionné
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === op || 
            (btn.textContent === '×' && op === '*') || 
            (btn.textContent === '÷' && op === '/')) {
            btn.classList.add('active');
        }
    });
}

function updateExpression() {
    const nombre1 = document.getElementById('nombre1').value || '_';
    const nombre2 = document.getElementById('nombre2').value || '_';
    const opSymbol = operateur === '*' ? '×' : operateur === '/' ? '÷' : operateur;
    document.getElementById('expression').textContent = 
        `${nombre1} ${opSymbol || '_'} ${nombre2}`;
}

function calculer() {
    const nombre1 = parseFloat(document.getElementById('nombre1').value);
    const nombre2 = parseFloat(document.getElementById('nombre2').value);
    let resultat;

    if (isNaN(nombre1) || isNaN(nombre2)) {
        showError("Veuillez entrer des nombres valides.");
        return;
    }

    if (operateur === '') {
        showError("Veuillez sélectionner un opérateur.");
        return;
    }

    try {
        switch (operateur) {
            case '+':
                resultat = nombre1 + nombre2;
                break;
            case '-':
                resultat = nombre1 - nombre2;
                break;
            case '*':
                resultat = nombre1 * nombre2;
                break;
            case '/':
                if (nombre2 === 0) throw new Error("Division par zéro impossible.");
                resultat = nombre1 / nombre2;
                break;
            default:
                throw new Error("Opérateur non valide.");
        }

        // Arrondir le résultat à 4 décimales si nécessaire
        resultat = Math.round(resultat * 10000) / 10000;
        
        const opSymbol = operateur === '*' ? '×' : operateur === '/' ? '÷' : operateur;
        document.getElementById('resultat').textContent = `${resultat}`;
        addToHistorique(`${nombre1} ${opSymbol} ${nombre2} = ${resultat}`);
    } catch (error) {
        showError(error.message);
    }
}

function resetFields() {
    document.getElementById('nombre1').value = '';
    document.getElementById('nombre2').value = '';
    document.getElementById('resultat').textContent = '';
    document.getElementById('expression').textContent = '';
    operateur = '';
    
    // Retirer la classe active des boutons d'opérateurs
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
}

document.getElementById("clear-history").addEventListener("click", function() {
    const historyContent = document.getElementById("history");
    historyContent.innerHTML = ""; // Efface le contenu de l'historique
});


function addToHistorique(operation) {
    const historiqueDiv = document.getElementById('history'); // Correction de l'identifiant
    const newEntry = document.createElement('div'); // Changer en <div> pour correspondre au style existant
    newEntry.textContent = operation;
    newEntry.className = 'history-item'; // Ajout de la classe pour le style
    historiqueDiv.insertBefore(newEntry, historiqueDiv.firstChild);
    
    // Limiter l'historique à 10 entrées
    while (historiqueDiv.children.length > 10) {
        historiqueDiv.removeChild(historiqueDiv.lastChild);
    }
}

function showError(message) {
    const resultat = document.getElementById('resultat');
    resultat.textContent = `Erreur : ${message}`;
    resultat.style.color = 'var(--danger-color)';
    
    // Réinitialiser la couleur après 3 secondes
    setTimeout(() => {
        resultat.style.color = 'var(--secondary-color)'; // Assurez-vous que cette variable CSS est définie
    }, 3000);
}

// Mettre à jour l'expression lorsque les nombres changent
document.getElementById('nombre1').addEventListener('input', updateExpression);
document.getElementById('nombre2').addEventListener('input', updateExpression);

// Supporter les touches du clavier
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '+':
        case '-':
            setOperator(e.key);
            break;
        case '*':
        case 'x':
            setOperator('*');
            break;
        case '/':
            setOperator('/');
            break;
        case 'Enter':
            calculer();
            break;
        case 'Escape':
            resetFields();
            break;
        case 'c': // Pour la touche 'c', efface l'historique
            clearHistory();
            break;
    }
});
