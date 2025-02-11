document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("energy-form");
    const tableBody = document.querySelector("#energy-table tbody");
    const totalCostElement = document.getElementById("total");
    const clearButton = document.getElementById("clear-button");
    
    function loadFromLocalStorage() {
        const storedDevices = JSON.parse(localStorage.getItem("devices")) || [];
        storedDevices.forEach(addRow);
        updateTotalCost();
    }
    
    function saveToLocalStorage(devices) {
        localStorage.setItem("devices", JSON.stringify(devices));
    }
    
    function addRow(deviceData) {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${deviceData.device}</td>
            <td>${deviceData.watts}</td>
            <td>${deviceData.dayHours}</td>
            <td>${deviceData.nightHours}</td>
            <td>${deviceData.dayConsumption.toFixed(2)}</td>
            <td>${deviceData.nightConsumption.toFixed(2)}</td>
            <td>${deviceData.totalConsumption.toFixed(2)}</td>
            <td>${deviceData.totalCost.toFixed(2)}</td>
            <td><button class="delete-button">Премахни</button></td>
        `;
        
        newRow.querySelector(".delete-button").addEventListener("click", function () {
            newRow.remove();
            removeFromLocalStorage(deviceData);
            updateTotalCost();
        });
    }
    
    function removeFromLocalStorage(deviceData) {
        let devices = JSON.parse(localStorage.getItem("devices")) || [];
        devices = devices.filter(d => d.device !== deviceData.device || d.watts !== deviceData.watts);
        saveToLocalStorage(devices);
    }
    
    function updateTotalCost() {
        let total = 0;
        document.querySelectorAll("#energy-table tbody tr").forEach(row => {
            total += parseFloat(row.cells[7].innerText);
        });
        totalCostElement.innerText = total.toFixed(2);
    }
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const deviceData = {
            device: document.getElementById("device").value,
            watts: parseFloat(document.getElementById("watts").value),
            dayHours: parseFloat(document.getElementById("day-hours").value),
            nightHours: parseFloat(document.getElementById("night-hours").value),
            dayConsumption: (parseFloat(document.getElementById("watts").value) * parseFloat(document.getElementById("day-hours").value)) / 1000,
            nightConsumption: (parseFloat(document.getElementById("watts").value) * parseFloat(document.getElementById("night-hours").value)) / 1000,
        };
        
        deviceData.totalConsumption = deviceData.dayConsumption + deviceData.nightConsumption;
        deviceData.totalCost = (deviceData.dayConsumption * 0.28360) + (deviceData.nightConsumption * 0.16536);
        
        addRow(deviceData);
        
        let devices = JSON.parse(localStorage.getItem("devices")) || [];
        devices.push(deviceData);
        saveToLocalStorage(devices);
        
        updateTotalCost();
        form.reset();
    });
    
    clearButton.addEventListener("click", function () {
        localStorage.removeItem("devices");
        tableBody.innerHTML = "";
        totalCostElement.innerText = "0.00";
    });
    
    loadFromLocalStorage();
});
