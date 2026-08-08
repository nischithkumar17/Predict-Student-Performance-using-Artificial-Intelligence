// ======================================
// AI Student Performance Predictor
// Main JavaScript File
// ======================================

// Backend API

const API_URL = "https://ai-student-performance-predictor-1-yqpy.onrender.com/api/predict";

// Form

const form = document.getElementById("predictionForm");

// Output Elements

const predictedScore = document.getElementById("predictedScore");
const grade = document.getElementById("grade");
const pass = document.getElementById("pass");
const performance = document.getElementById("performance");
const recommendation = document.getElementById("recommendation");
const downloadBtn = document.getElementById("downloadCSV");
const clearHistoryBtn = document.getElementById("clearHistory");
const pdfBtn = document.getElementById("downloadPDF");
const chartCanvas = document.getElementById("scoreChart");

let scoreChart = null;
let latestResult = null;
// ===========================
// Load Prediction History
// ===========================

window.addEventListener("DOMContentLoaded", () => {

    const historyTable = document.querySelector("#historyTable tbody");

    const history = JSON.parse(localStorage.getItem("predictionHistory")) || [];

    history.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.time}</td>
        <td>${item.score}</td>
        <td>${item.grade}</td>
        <td>${item.performance}</td>
        `;

        historyTable.appendChild(row);

    });

     updateChart();

});
form.addEventListener("submit", async function(event){

    event.preventDefault();

    const data = {

        Hours_Studied: Number(document.getElementById("Hours_Studied").value),

        Attendance: Number(document.getElementById("Attendance").value),

        Previous_Scores: Number(document.getElementById("Previous_Scores").value),

        Sleep_Hours: Number(document.getElementById("Sleep_Hours").value),

        Tutoring_Sessions: Number(document.getElementById("Tutoring_Sessions").value),

        Physical_Activity: Number(document.getElementById("Physical_Activity").value),

        Motivation_Level: document.getElementById("Motivation_Level").value,

        Parental_Involvement: document.getElementById("Parental_Involvement").value,

        Access_to_Resources: document.getElementById("Access_to_Resources").value,

        Extracurricular_Activities: document.getElementById("Extracurricular_Activities").value,

        Internet_Access: document.getElementById("Internet_Access").value,

        Family_Income: document.getElementById("Family_Income").value,

        Teacher_Quality: document.getElementById("Teacher_Quality").value,

        School_Type: document.getElementById("School_Type").value,

        Peer_Influence: document.getElementById("Peer_Influence").value,

        Learning_Disabilities: document.getElementById("Learning_Disabilities").value,

        Parental_Education_Level: document.getElementById("Parental_Education_Level").value,

        Distance_from_Home: document.getElementById("Distance_from_Home").value,

        Gender: document.getElementById("Gender").value

    };

    console.log(data);
 try{

    const response = await fetch(API_URL,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(data)

    });

    const result = await response.json();

    latestResult = result;

    console.log(result);

predictedScore.textContent = result.predicted_score.toFixed(2);

grade.textContent = result.grade;

pass.textContent = result.pass ? "PASS" : "FAIL";

performance.textContent = result.performance_level;

recommendation.innerHTML = result.recommendation
    .replace("Motivation:", "<strong>Motivation:</strong>")
    .replace("Study Tips:", "<strong>Study Tips:</strong>")
    .replace("Daily Habit:", "<strong>Daily Habit:</strong>")
    .replace(/\n/g, "<br>");


    // ---------- Prediction History ----------

const historyTable = document.querySelector("#historyTable tbody");

const row = document.createElement("tr");

row.innerHTML = `
<td>${new Date().toLocaleTimeString()}</td>
<td>${result.predicted_score.toFixed(2)}</td>
<td>${result.grade}</td>
<td>${result.performance_level}</td>
`;

historyTable.prepend(row);

// Save history to Local Storage

let history = JSON.parse(localStorage.getItem("predictionHistory")) || [];

history.unshift({
    time: new Date().toLocaleTimeString(),
    score: result.predicted_score.toFixed(2),
    grade: result.grade,
    performance: result.performance_level
});

localStorage.setItem(
    "predictionHistory",
    JSON.stringify(history)
);

updateChart();

} catch (error) {

    

    console.error(error);

}
});
// =====================================
// Download Prediction History as CSV
// =====================================

downloadBtn.addEventListener("click", () => {

    const history = JSON.parse(localStorage.getItem("predictionHistory")) || [];

    if (history.length === 0) {
        alert("No prediction history found!");
        return;
    }

    let csv =
        "Time,Score,Grade,Performance\n";

    history.forEach(item => {

        csv += `${item.time},${item.score},${item.grade},${item.performance}\n`;

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Prediction_History.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});
// =============================
// Download PDF Report
// =============================

pdfBtn.addEventListener("click", () => {

    if (!latestResult) {
        alert("Please make a prediction first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI Student Performance Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Predicted Score: ${latestResult.predicted_score.toFixed(2)}`, 20, 50);
    doc.text(`Grade: ${latestResult.grade}`, 20, 60);
    doc.text(`Performance: ${latestResult.performance_level}`, 20, 70);

    doc.text("AI Recommendation:", 20, 90);

    const recommendationText = doc.splitTextToSize(
        latestResult.recommendation,
        170
    );

    doc.text(recommendationText, 20, 100);

    doc.save("Student_Performance_Report.pdf");

});
// =============================
// Prediction Analytics Chart
// =============================

function updateChart() {

    const history = JSON.parse(localStorage.getItem("predictionHistory")) || [];

    const labels = history.map((item, index) => `Prediction ${history.length - index}`);
    const scores = history.map(item => Number(item.score));

    if (scoreChart) {
        scoreChart.destroy();
    }

    scoreChart = new Chart(chartCanvas, {
        type: "line",
        data: {
            labels: labels.reverse(),
            datasets: [{
                label: "Predicted Score",
                data: scores.reverse(),
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

}
// =============================
// Clear Prediction History
// =============================

clearHistoryBtn.addEventListener("click", () => {

    if (!confirm("Are you sure you want to clear all prediction history?")) {
        return;
    }

    localStorage.removeItem("predictionHistory");

    const historyTable = document.querySelector("#historyTable tbody");
    historyTable.innerHTML = "";

    if (scoreChart) {
        scoreChart.destroy();
        scoreChart = null;
    }

    alert("Prediction history cleared successfully!");

});