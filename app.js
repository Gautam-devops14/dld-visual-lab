document.addEventListener("DOMContentLoaded", () => {
    // K-Map indices corresponding to Gray Code ordering for 4 variables (A, B, C, D)
    // Rows: AB (00, 01, 11, 10)
    // Cols: CD (00, 01, 11, 10)
    // Array indices match truth table rows (0 to 15)
    const kmapLayout = [
        [0, 1, 3, 2],
        [4, 5, 7, 6],
        [12, 13, 15, 14],
        [8, 9, 11, 10]
    ];

    // State array holding 0 or 1 for each of the 16 minterms
    let truthData = new Array(16).fill(0);

    const truthTableBody = document.querySelector("#truthTable tbody");
    const kmapTable = document.querySelector("#kmapTable");
    const sopResult = document.getElementById("sopResult");
    const posResult = document.getElementById("posResult");

    // Initialize Truth Table
    function initTruthTable() {
        truthTableBody.innerHTML = "";
        for (let i = 0; i < 16; i++) {
            const A = (i >> 3) & 1;
            const B = (i >> 2) & 1;
            const C = (i >> 1) & 1;
            const D = i & 1;
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${A}</td>
                <td>${B}</td>
                <td>${C}</td>
                <td>${D}</td>
                <td class="output-cell output-0" data-index="${i}">0</td>
            `;
            truthTableBody.appendChild(tr);
        }

        // Add event listeners to output cells
        document.querySelectorAll(".output-cell").forEach(cell => {
            cell.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                toggleState(index);
            });
        });
    }

    // Initialize K-Map Grid
    function initKMap() {
        kmapTable.innerHTML = "";
        
        // Header Row (CD)
        const headerTr = document.createElement("tr");
        headerTr.innerHTML = `<th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th>`;
        kmapTable.appendChild(headerTr);

        const rowLabels = ["00", "01", "11", "10"];

        for (let i = 0; i < 4; i++) {
            const tr = document.createElement("tr");
            // Row Label (AB)
            const th = document.createElement("th");
            th.textContent = rowLabels[i];
            tr.appendChild(th);

            for (let j = 0; j < 4; j++) {
                const index = kmapLayout[i][j];
                const td = document.createElement("td");
                td.textContent = "0";
                td.className = "cell-0";
                td.setAttribute("data-index", index);
                
                td.addEventListener("click", function() {
                    const idx = parseInt(this.getAttribute("data-index"));
                    toggleState(idx);
                });
                
                tr.appendChild(td);
            }
            kmapTable.appendChild(tr);
        }
    }

    // Toggle State and Update UI
    function toggleState(index) {
        truthData[index] = truthData[index] === 0 ? 1 : 0;
        updateUI();
    }

    function updateUI() {
        // Update Truth Table
        document.querySelectorAll(".output-cell").forEach(cell => {
            const index = parseInt(cell.getAttribute("data-index"));
            const val = truthData[index];
            cell.textContent = val;
            cell.className = `output-cell output-${val}`;
        });

        // Update K-Map
        document.querySelectorAll(".kmap td").forEach(cell => {
            if(cell.hasAttribute("data-index")) {
                const index = parseInt(cell.getAttribute("data-index"));
                const val = truthData[index];
                cell.textContent = val;
                cell.className = `cell-${val}`;
            }
        });

        calculateExpressions();
    }

    function calculateExpressions() {
        // Generating Canonical SOP
        let sopTerms = [];
        let posTerms = [];

        for (let i = 0; i < 16; i++) {
            const A = (i >> 3) & 1;
            const B = (i >> 2) & 1;
            const C = (i >> 1) & 1;
            const D = i & 1;

            if (truthData[i] === 1) {
                // Minterm
                let term = "";
                term += A ? "A" : "A'";
                term += B ? "B" : "B'";
                term += C ? "C" : "C'";
                term += D ? "D" : "D'";
                sopTerms.push(term);
            } else {
                // Maxterm
                let term = "(";
                term += A ? "A'" : "A";
                term += " + ";
                term += B ? "B'" : "B";
                term += " + ";
                term += C ? "C'" : "C";
                term += " + ";
                term += D ? "D'" : "D";
                term += ")";
                posTerms.push(term);
            }
        }

        sopResult.textContent = sopTerms.length > 0 ? sopTerms.join(" + ") : "0";
        if (sopTerms.length === 16) sopResult.textContent = "1";

        posResult.textContent = posTerms.length > 0 ? posTerms.join(" \u00B7 ") : "1";
        if (posTerms.length === 16) posResult.textContent = "0";
    }

    // Initialize
    initTruthTable();
    initKMap();
});
