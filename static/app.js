document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadArea = document.getElementById("uploadArea");
    const convertBtn = document.getElementById("convertBtn");
    const fileInfo = document.getElementById("fileInfo");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const downloadBtn = document.getElementById("downloadBtn");
    const resultsSection = document.getElementById("resultsSection");
    const errorSection = document.getElementById("errorSection");
    const errorMessage = document.getElementById("errorMessage");
    const status = document.getElementById("statusMessage");
    const themeToggle = document.getElementById("themeToggle");

    let selectedFile = null;

    // Theme toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });

    // Click to select
    uploadArea.addEventListener("click", () => fileInput.click());

    // Drag & Drop
    uploadArea.addEventListener("dragover", e => { e.preventDefault(); uploadArea.style.background = "#dbeafe"; });
    uploadArea.addEventListener("dragleave", e => { e.preventDefault(); uploadArea.style.background = "#eff6ff"; });
    uploadArea.addEventListener("drop", e => { e.preventDefault(); fileInput.files = e.dataTransfer.files; handleFileSelection(); uploadArea.style.background = "#eff6ff"; });

    fileInput.addEventListener("change", handleFileSelection);

    function handleFileSelection() {
        selectedFile = fileInput.files[0];
        if (selectedFile) {
            fileInfo.style.display = "block";
            fileName.textContent = selectedFile.name;
            fileSize.textContent = (selectedFile.size / 1024 / 1024).toFixed(2) + " MB";
            convertBtn.disabled = false;
            resultsSection.style.display = "none";
            errorSection.style.display = "none";
            status.textContent = "";
        }
    }

    // Convert Button
    convertBtn.addEventListener("click", () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("pdf_file", selectedFile);

        status.innerHTML = 'Processing... <span id="loader"></span>';
        convertBtn.disabled = true;

        fetch("/upload", { method: "POST", body: formData })
            .then(res => { if (!res.ok) throw new Error("Server error or OCR failed"); return res.blob(); })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                downloadBtn.href = url;
                downloadBtn.download = "output.xlsx";
                resultsSection.style.display = "block";
                errorSection.style.display = "none";
                status.textContent = "File processed successfully!";
                convertBtn.disabled = false;
            })
            .catch(err => {
                console.error("Upload failed:", err);
                errorMessage.textContent = err.message;
                errorSection.style.display = "block";
                resultsSection.style.display = "none";
                status.textContent = "";
                convertBtn.disabled = false;
            });
    });
});
