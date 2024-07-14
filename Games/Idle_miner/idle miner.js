
let resources = 0;
let Cost = {
    "upgrade": {
        "vadapav": 10,
        "kulfi": 100,
        "shawrma": 1000,
        "Fish": 10000,
        "Biryani": 100000,
    },
    automation: {
        "vadapav": 100,
        "kulfi": 1000,
        "shawrma": 10000,
        "Fish": 100000,
        "Biryani": 1000000,
    },
    resourcesPerClick: {
        "vadapav": 1,
        "kulfi": 0,
        "shawrma": 0,
        "Fish": 0,
        "Biryani": 0,
    },
    AutomationPerSec: {
        "vadapav": 0,
        "kulfi": 0,
        "shawrma": 0,
        "Fish": 0,
        "Biryani": 0,
    },
    Value: {
        "vadapav": 1,
        "kulfi": 5,
        "shawrma": 15,
        "Fish": 50,
        "Biryani": 100,
    }
};
let resourcesPerSecond = 0;

//clicking on product
{
    document.getElementById('vadapav').addEventListener('click', () => {
        resources += Cost.resourcesPerClick.vadapav;
        updateResources();
    }
    );
    document.getElementById('kulfi').addEventListener('click', () => {
        resources += Cost.resourcesPerClick.kulfi;
        updateResources();
    }
    );
    document.getElementById('shawrma').addEventListener('click', () => {
        resources += Cost.resourcesPerClick.shawrma;
        updateResources();
    }
    );
    document.getElementById('fish').addEventListener('click', () => {
        resources += Cost.resourcesPerClick.Fish;
        updateResources();
    }
    );
    document.getElementById('biryani').addEventListener('click', () => {
        resources += Cost.resourcesPerClick.Biryani;
        updateResources();
    }
    );
}
//buying single product
{
    document.getElementById('buy-vadapav').addEventListener('click', () => {
        console.log(resources, Cost.upgrade.vadapav, Cost.resourcesPerClick.vadapav);
        if (resources >= Cost.upgrade.vadapav) {
            resources -= Cost.upgrade.vadapav;
            Cost.resourcesPerClick.vadapav += 1;
            Cost.upgrade.vadapav *= 2;
            updateResourcesPerClick()
            updateResources();
            updateUpgradeCost();
        }
    }
    );
    document.getElementById('buy-kulfi').addEventListener('click', () => {
        console.log(resources, Cost.upgrade.kulfi, Cost.resourcesPerClick.kulfi);
        if (resources >= Cost.upgrade.kulfi) {
            resources -= Cost.upgrade.kulfi;
            Cost.resourcesPerClick.kulfi += 5;
            Cost.upgrade.kulfi *= 2;
            updateResourcesPerClick()
            updateResources();
            updateUpgradeCost();
        }
    }
    );
    document.getElementById('buy-shawrma').addEventListener('click', () => {
        if (resources >= Cost.upgrade.shawrma) {
            resources -= Cost.upgrade.shawrma;
            Cost.resourcesPerClick.shawrma += 10;
            Cost.upgrade.shawrma *= 2;
            updateResourcesPerClick()
            updateResources();
            updateUpgradeCost();
        }
    }
    );
    document.getElementById('buy-fish').addEventListener('click', () => {
        if (resources >= Cost.upgrade.Fish) {
            resources -= Cost.upgrade.Fish;
            Cost.resourcesPerClick.Fish += 50;
            Cost.upgrade.Fish *= 2;
            updateResourcesPerClick()
            updateResources();
            updateUpgradeCost();
        }
    }
    );
    document.getElementById('buy-biryani').addEventListener('click', () => {
        if (resources >= Cost.upgrade.Biryani) {
            resources -= Cost.upgrade.Biryani;
            Cost.resourcesPerClick.Biryani += 100;
            Cost.upgrade.Biryani *= 2;
            updateResourcesPerClick()
            updateResources();
            updateUpgradeCost();
        }
    }
    );
}

//buying single automation
{
    document.getElementById('auto-vadapav').addEventListener('click', () => {
        console.log(resources, Cost.upgrade.vadapav, Cost.resourcesPerClick.vadapav);
        if (resources >= Cost.automation.vadapav) {
            resources -= Cost.automation.vadapav;
            resourcesPerSecond += Cost.Value.vadapav;
            Cost.automation.vadapav *= 2;
            Cost.AutomationPerSec.vadapav += Cost.Value.vadapav;
            updateAutomationPerSec();
            updateResources();
            updateAutomationCost();
        }
    }
    );
    document.getElementById('auto-kulfi').addEventListener('click', () => {
        if (resources >= Cost.automation.kulfi) {
            resources -= Cost.automation.kulfi;
            resourcesPerSecond += Cost.Value.kulfi;
            Cost.automation.kulfi *= 2;
            Cost.AutomationPerSec.kulfi += Cost.Value.kulfi;
            updateAutomationPerSec();
            updateResources();
            updateAutomationCost();
        }
    }
    );
    document.getElementById('auto-shawrma').addEventListener('click', () => {
        if (resources >= Cost.automation.shawrma) {
            resources -= Cost.automation.shawrma;
            resourcesPerSecond += Cost.Value.shawrma;
            Cost.automation.shawrma *= 2;
            Cost.AutomationPerSec.shawrma += Cost.Value.shawrma;
            updateAutomationPerSec();
            updateResources();
            updateAutomationCost();
        }
    }
    );
    document.getElementById('auto-fish').addEventListener('click', () => {
        if (resources >= Cost.automation.Fish) {
            resources -= Cost.automation.Fish;
            resourcesPerSecond += Cost.Value.Fish;
            Cost.automation.Fish *= 2;
            Cost.AutomationPerSec.Fish += Cost.Value.Fish;
            updateAutomationPerSec();
            updateResources();
            updateAutomationCost();
        }
    }
    );
    document.getElementById('auto-biryani').addEventListener('click', () => {
        if (resources >= Cost.automation.Biryani) {
            resources -= Cost.automation.Biryani;
            resourcesPerSecond += Cost.Value.Biryani;
            Cost.automation.Biryani *= 2;
            Cost.AutomationPerSec.Biryani += Cost.Value.Biryani;
            updateAutomationPerSec();
            updateResources();
            updateAutomationCost();
        }
    }
    );
}
function updateResources() {
    document.getElementById('resource').textContent = resources;
    document.getElementById('automation-').textContent = "    "+resourcesPerSecond;
}

function updateUpgradeCost() {
    document.getElementById('vadapav-cost').textContent = Cost.upgrade.vadapav;
    document.getElementById('kulfi-cost').textContent = Cost.upgrade.kulfi;
    document.getElementById('shawrma-cost').textContent = Cost.upgrade.shawrma;
    document.getElementById('fish-cost').textContent = Cost.upgrade.Fish;
    document.getElementById('biryani-cost').textContent = Cost.upgrade.Biryani;
}

function updateAutomationCost() {
    document.getElementById('vadapav-auto').textContent = Cost.automation.vadapav;
    document.getElementById('kulfi-auto').textContent = Cost.automation.kulfi;
    document.getElementById('shawrma-auto').textContent = Cost.automation.shawrma;
    document.getElementById('fish-auto').textContent = Cost.automation.Fish;
    document.getElementById('biryani-auto').textContent = Cost.automation.Biryani;
}

function updateResourcesPerClick() {
    document.getElementById('vadapav-click').textContent = Cost.resourcesPerClick.vadapav;
    document.getElementById('kulfi-click').textContent = Cost.resourcesPerClick.kulfi;
    document.getElementById('shawrma-click').textContent = Cost.resourcesPerClick.shawrma;
    document.getElementById('fish-click').textContent = Cost.resourcesPerClick.Fish;
    document.getElementById('biryani-click').textContent = Cost.resourcesPerClick.Biryani;
}

function updateAutomationPerSec() {
    document.getElementById('vadapav-autom').textContent = Cost.AutomationPerSec.vadapav;
    document.getElementById('kulfi-autom').textContent = Cost.AutomationPerSec.kulfi;
    document.getElementById('shawrma-autom').textContent = Cost.AutomationPerSec.shawrma;
    document.getElementById('fish-autom').textContent = Cost.AutomationPerSec.Fish;
    document.getElementById('biryani-autom').textContent = Cost.AutomationPerSec.Biryani;
}

setInterval(() => {
    resources += resourcesPerSecond;
    updateResources();
}, 1000);

document.addEventListener("DOMContentLoaded", function() {
    updateResources();
    updateUpgradeCost();
    updateAutomationCost();
    updateResourcesPerClick();
    updateAutomationPerSec();
});
