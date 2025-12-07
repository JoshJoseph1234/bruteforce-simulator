const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
let isRunning = false;

// --- Helper Functions for Metrics and Time ---

/**
 * Determines the size of the character set (S) based on characters present in the password.
 * This is crucial for accurate entropy and combination calculations.
 */
function getCharacterPoolSize(password) {
    let S = 0; // Character Set Size
    const hasLower = /[a-z]/.test(password); // 26 chars
    const hasUpper = /[A-Z]/.test(password); // 26 chars
    const hasNumber = /[0-9]/.test(password); // 10 chars
    // Includes common symbols: !@#$%^&*()_+-=[]{}|;:",.<>?/~`
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(password); // ~32 chars

    if (hasLower) S += 26;
    if (hasUpper) S += 26;
    if (hasNumber) S += 10;
    if (hasSymbol) S += 32;

    // Default to a basic numeric set if no valid characters were found
    if (S === 0) S = 10; 
    
    document.getElementById('charset').innerText = S;
    return S;
}

/**
 * Calculates and displays Entropy, Combinations, and Estimated Crack Time.
 */
function calculateMetrics(password) {
    const L = password.length;
    document.getElementById('length').innerText = L;
    
    const S = getCharacterPoolSize(password);
    
    // 1. Calculate Combinations (N = S^L)
    const N = Math.pow(S, L);
    // Use BigInt for accurate display if combinations exceed JS Number limit (2^53), though N in Number is fine for calculation here.
    const combinationsText = N > 999999999999999 ? N.toExponential(2) : N.toLocaleString();
    document.getElementById('combinations').innerText = combinationsText;

    // 2. Calculate Entropy (E = L * log2(S))
    const E = L * (Math.log(S) / Math.log(2));
    document.getElementById('entropy').innerText = `${E.toFixed(2)} bits`;

    // 3. Estimate Crack Time (Based on 2 billion guesses/sec)
    // This is a high-end GPU estimate for realism
    const CRACK_SPEED = 2_000_000_000; 
    const seconds = N / CRACK_SPEED;

    document.getElementById('crackTime').innerText = formatTime(seconds);
    return N; // Return combinations for the simulation check
}

/**
 * Formats seconds into a human-readable string (seconds, minutes, hours, years).
 */
function formatTime(seconds) {
    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
    if (seconds < 315360000000) return `${(seconds / 31536000).toFixed(2)} years`;
    return 'Centuries or longer 🕰️';
}

// --- Core Attack Logic ---

function startAttack() {
    if (isRunning) return;
    
    const target = document.getElementById('targetPassword').value;
    if (!target) return alert("Enter a password first!");
    
    // Reset UI
    isRunning = true;
    document.getElementById('status').innerText = "CALCULATING...";
    document.getElementById('status').style.color = "#0f0";
    document.getElementById('terminal').innerHTML = '';
    
    // Calculate metrics immediately
    const combinations = calculateMetrics(target);
    
    // Safety check: Only run literal brute-force for very short passwords (L <= 4)
    if (target.length <= 4) {
        // Use the actual brute-force loop
        document.getElementById('status').innerText = "BRUTE FORCING (REAL TIME)...";
        runBruteForce(target); 
    } else {
        // Use the simulated, animated demonstration
        document.getElementById('status').innerText = "SIMULATING (THEORETICAL TIME)...";
        runSimulatedAttack(target, combinations);
    }
}

// --- Brute-Force Implementation (for L <= 4) ---

function runBruteForce(target) {
    let attempts = 0;
    let startTime = Date.now();
    
    // This character set is simpler to keep the quick attack fast
    const simpleChars = 'abcdefghijklmnopqrstuvwxyz0123456789'; 
    
    const cracker = {
        indices: [0],
        next: function() {
            let i = 0;
            while (i < this.indices.length) {
                if (this.indices[i] < simpleChars.length - 1) {
                    this.indices[i]++;
                    return this.toString();
                } else {
                    this.indices[i] = 0;
                    i++;
                }
            }
            if (this.indices.length < target.length) {
                this.indices.push(0);
            }
            return this.toString();
        },
        toString: function() {
            return this.indices.map(i => simpleChars[i]).reverse().join('');
        }
    };

    function tick() {
        if (!isRunning) return;
        
        // Perform multiple guesses per frame to speed up the visual
        for (let i = 0; i < 500; i++) { 
            attempts++;
            let guess = cracker.next();

            if (guess === target) {
                crackSuccess(guess, attempts, startTime, false);
                return;
            }
            
            // Safety break if the guess length exceeds the target length
            if (guess.length > target.length) {
                 crackSuccess(target, attempts, startTime, true, true);
                 return;
            }
        }

        updateTerminal(cracker.toString(), attempts, startTime, false);
        requestAnimationFrame(tick);
    }

    tick();
}

// --- Simulation Implementation (for L > 4) ---

function runSimulatedAttack(target, combinations) {
    let attempts = 0;
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '';
    
    // Simulate an attempt rate that looks fast, but isn't actually trying all 'combinations'
    const totalLines = 150; 
    let lineCount = 0;

    function simulateTick() {
        if (!isRunning || lineCount >= totalLines) {
            // End of simulation animation
            crackSuccess(target, combinations, Date.now(), true); 
            return;
        }

        attempts++;
        const line = document.createElement('div');
        line.className = 'log-entry';
        line.innerText = `> ITERATION ${attempts} :: CHECKING HASHES :: ${generateRandomHex()}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight; 

        if (terminal.children.length > 10) {
            terminal.removeChild(terminal.firstChild);
        }
        
        lineCount++;
        // Use a short delay for smooth animation flow
        setTimeout(simulateTick, 10); 
    }
    simulateTick();
}

function generateRandomHex() {
    return '0x' + Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}


// --- UI Update & Success Handling ---

function updateTerminal(currentGuess, attempts, startTime, isSimulated) {
    const terminal = document.getElementById('terminal');
    const time = ((Date.now() - startTime) / 1000).toFixed(2);
    
    document.getElementById('attempts').innerText = attempts.toLocaleString();
    document.getElementById('timer').innerText = time + 's';

    const line = document.createElement('div');
    line.className = 'log-entry';
    if (!isSimulated) {
        line.innerText = `> TESTING HASH: [ ${currentGuess} ] ... FAIL`;
    }
    terminal.appendChild(line);

    if (terminal.children.length > 8) {
        terminal.removeChild(terminal.firstChild);
    }
}

function crackSuccess(password, attempts, startTime, isSimulated, failedByLength=false) {
    isRunning = false;
    const time = ((Date.now() - startTime) / 1000).toFixed(2);
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '';
    
    // Reset timer and attempts for the final display
    document.getElementById('attempts').innerText = attempts.toLocaleString();
    document.getElementById('timer').innerText = isSimulated ? document.getElementById('crackTime').innerText : `${time}s`;

    if (failedByLength) {
        document.getElementById('status').innerText = "FAILURE: Too Complex for Real-Time Brute Force";
        terminal.innerHTML = `
            <div class="log-entry" style="color:red; font-weight:bold;">>>> TARGET EXCEEDS BRUTE FORCE LIMIT (L=${password.length})</div>
            <div class="log-entry">>>> Displaying calculated metrics below.</div>
        `;
    } else if (isSimulated) {
        document.getElementById('status').innerText = "SIMULATION COMPLETE";
        terminal.innerHTML = `
            <div class="log-entry" style="color:#fff; font-weight:bold;">>>> TARGET HASHES ANALYZED: ${attempts.toLocaleString()}</div>
            <div class="log-entry">>>> Estimated Time to Crack: ${document.getElementById('crackTime').innerText}</div>
            <div class="log-entry">>>> Entropy: ${document.getElementById('entropy').innerText}</div>
        `;
    } else {
        document.getElementById('status').innerText = "PASSWORD CRACKED 🔓";
        terminal.innerHTML = `
            <div class="log-entry match">>>> MATCH FOUND: ${password}</div>
            <div class="log-entry">>>> EFFORT: ${attempts.toLocaleString()} attempts</div>
            <div class="log-entry">>>> REAL TIME TAKEN: ${time} seconds</div>
        `;
    }
    
    // Visual flare
    document.querySelector('.container').classList.add('cracked');
    setTimeout(() => document.querySelector('.container').classList.remove('cracked'), 2000);
}

// Listen for input changes to update metrics instantly
document.getElementById('targetPassword').addEventListener('input', function() {
    const password = this.value;
    if (password.length > 0) {
        calculateMetrics(password);
    } else {
        // Reset metrics on empty input
        document.querySelectorAll('.stats-full span').forEach(el => el.innerText = '0');
    }
});