// TitaNets Galaxy's Edge Beacon Emulator for Flipper Zero
// --------------------------------------------------------
// This application allows the emulation of beacons emitted by the droids from Droid Depot, 
// including any of their personality chips and those located in the Galaxy's Edge theme park. 
// The application was designed for Flipper Zero devices capable of running JavaScript code and 
// supporting the loading of the blebeacon module. The application was successfully tested with 
// the Momentum firmware.
//
// The script must be uploaded to the apps\Scripts folder. 
// To execute it, navigate from the Flipper Zero's screen to Apps and then to the Scripts option.

let blebeacon = require("blebeacon");
let submenu = require("submenu");
let dialog = require("dialog");
let notify = require("notification");

let commonPrefix = [9, 0xFF, 0x83, 0x01];
notify.blink("yellow", "long");
print("Initializing beacons...");

// Show a loading message while creating variables
function showAboutMessage() {
    dialog.custom({
        header: "TitaNets",
        text: "Visit titanets.com\nfor more solutions.",
        button_center: "OK",
        auto_close: false
    });
}
function clearScreen() {
    // Print several new lines to effectively "clear" the console
    for (let i = 0; i < 20; i++) {
        print("\n");
    }
}
// Function to create the full payload array from a prefix and suffix
function createPayload(prefix, suffix) {
	let ix = 0;
	
    // Create a Uint8Array with the total length of commonPrefix and suffix
    let combinedArray = Uint8Array(commonPrefix.length + prefix.length + suffix.length);

    // Fill the combinedArray with the elements from commonPrefix
    for (let i = 0; i < commonPrefix.length; i++) {
        combinedArray[ix] = commonPrefix[i]; ix++;
    }
	
	// Fill the combinedArray with the elements from prefix
    for (let i = 0; i < prefix.length; i++) {
        combinedArray[ix] = prefix[i]; ix++;
    }

    // Fill the combinedArray with the elements from suffix
    for (let i = 0; i < suffix.length; i++) {
        combinedArray[ix] = suffix[i]; ix++;
    }

    return combinedArray;
}

// Function to convert an array of numbers to a hex string using to_hex_string
function uint8ArrayToHexString(array, ixStart) {
    let hexString = '';
	if(ixStart === undefined) ixStart = 0;
	
    for (let i = ixStart; i < array.length; i++) {
        let value = array[i]; // Access the byte value using 'value'

        // Convert value to hex string using to_hex_string
        let hex = to_hex_string(value);

        // Ensure the hex string is two characters long
        hexString += hex.length === 1 ? '0' + hex : hex;
    }
    return to_upper_case(hexString);
}

// Function to stop any active beacon
function stopBroadcast() {
    if (blebeacon.isActive()) {
        blebeacon.stop();
		notify.error();
		//notify.blink("red", "short");
    }
}

// Function to broadcast a beacon
function broadcastBeacon(payload) {
    let macAddress = Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // Default MAC address (all zeros)
    blebeacon.setConfig(macAddress, 0x1F, 100, 300); // Set beacon configuration
    blebeacon.setData(payload); // Set the beacon data
    blebeacon.start(); // Start broadcasting
	notify.success();
}

// Define location beacons with payloads
notify.blink("blue", "long");
print("  - location..."); 
let locationPrefix = [0x0A, 0x04];
let locationBeacons = [
	{ id: 0x00, name: "Marketplace 1", payload: createPayload(locationPrefix, [0x01, 0x02, 0xA6, 0x01]) },
	{ id: 0x01, name: "Marketplace 2", payload: createPayload(locationPrefix, [0x01, 0x0C, 0xA6, 0x01]) },
	{ id: 0x02, name: "Marketplace (WDW)", payload: createPayload(locationPrefix, [0x06, 0x18, 0xBA, 0x01]) },    
	{ id: 0x03, name: "Droid Depot (Behind)", payload: createPayload(locationPrefix, [0x02, 0x02, 0xA6, 0x01]) },
	{ id: 0x04, name: "Droid Depot (DL)", payload: createPayload(locationPrefix, [0x03, 0x18, 0xBA, 0x01]) },    
	{ id: 0x05, name: "Resistance", payload: createPayload(locationPrefix, [0x03, 0x02, 0xA6, 0x01]) },
	{ id: 0x06, name: "First Order 1", payload: createPayload(locationPrefix, [0x07, 0x02, 0xA6, 0x01]) },
	{ id: 0x07, name: "First Order 2", payload: createPayload(locationPrefix, [0x07, 0x0C, 0xA6, 0x01]) },    
	{ id: 0x08, name: "Dok-Ondar's", payload: createPayload(locationPrefix, [0x06, 0x0C, 0xA6, 0x01]) },
	{ id: 0x09, name: "Dok-Ondar's (WDW)", payload: createPayload(locationPrefix, [0x06, 0x02, 0xA6, 0x01]) },	
	{ id: 0x0A, name: "Oga's Detector", payload: createPayload(locationPrefix, [0x05, 0x02, 0xA6, 0x01]) },	
	{ id: 0x0B, name: "Oga's Entrance", payload: createPayload(locationPrefix, [0x05, 0x0C, 0xA6, 0x01]) },
	{ id: 0x0C, name: "Somewhere", payload: createPayload(locationPrefix, [0x04, 0x02, 0xA6, 0x01]) }	
];

// Define droid beacons with payloads
notify.blink("blue", "long");
print("  - droids...");
let droidPrefix = [0x03, 0x04, 0x44, 0x81];
let droidBeacons = [
	{ id: 0x00, name: "R2-D2", payload: createPayload(droidPrefix, [0x82, 0x01]) },
	{ id: 0x01, name: "BB-8", payload: createPayload(droidPrefix, [0x82, 0x02]) },
	{ id: 0x02, name: "C1-10P", payload: createPayload(droidPrefix, [0x8A, 0x0B]) },
	{ id: 0x03, name: "D-O", payload: createPayload(droidPrefix, [0x8A, 0x0C]) },
	{ id: 0x04, name: "BD-1", payload: createPayload(droidPrefix, [0x8A, 0x0E]) },	
	{ id: 0x05, name: "Drum Kit", payload: createPayload(droidPrefix, [0x82, 0x10]) },
];

// Define personality chip beacons with payloads
notify.blink("blue", "long");
print("  - personality chips...");
let personalityChipBeacons = [
	{ id: 0x00, name: "Blue (R5-D4)", payload: createPayload(droidPrefix, [0x8A, 0x03]) },
	{ id: 0x01, name: "Gray (U9-C4)", payload: createPayload(droidPrefix, [0x82, 0x04]) },
	{ id: 0x02, name: "Red 1 (QT-KT)", payload: createPayload(droidPrefix, [0x92, 0x05]) },
	{ id: 0x03, name: "Orange (R4-P17)", payload: createPayload(droidPrefix, [0x8A, 0x06]) },
	{ id: 0x04, name: "Purple (M5-BZ)", payload: createPayload(droidPrefix, [0x82, 0x07]) },
	{ id: 0x05, name: "Black (BB-9E)", payload: createPayload(droidPrefix, [0x92, 0x08]) },
	{ id: 0x06, name: "Red 2 (CB-23)", payload: createPayload(droidPrefix, [0x82, 0x09]) },
	{ id: 0x07, name: "Yellow (CH-33P)", payload: createPayload(droidPrefix, [0x8A, 0x0A]) },
	{ id: 0x08, name: "Navy (RG-G1)", payload: createPayload(droidPrefix, [0x82, 0x0D]) },
];

notify.blink("cyan", "long");
print("Starting...");
delay(1200);
clearScreen();

function mainMenu() {
	while (true) {
        submenu.setHeader("Beacon Types:");
        submenu.addItem("Droids", 0);
        submenu.addItem("Locations", 1);
        submenu.addItem("Personality Chips", 2);

        let selectedMenu = submenu.show();

        if (selectedMenu === undefined) {
            break; // Exit the loop if the back button is pressed
        } else if (selectedMenu === 0) {
            showSubmenu(droidBeacons);
        } else if (selectedMenu === 1) {
            showSubmenu(locationBeacons);
        } else if (selectedMenu === 2) {
            showSubmenu(personalityChipBeacons);
        }
    }
}

function showSubmenu(beacons) {
    while (true) {
        submenu.setHeader("Select a Beacon:");

        for (let i = 0; i < beacons.length; i++) {
            let beacon = beacons[i];
            submenu.addItem(beacon.name, i);
        }

        let selectedId = submenu.show();

        if (selectedId === undefined) {
            break; // Go back to previous menu if the back button is pressed
        } else {
            let selectedBeacon = beacons[selectedId];
            broadcastBeacon(selectedBeacon.payload);

            let dialogParams = {
                header: "Broadcasting\n" + selectedBeacon.name,
                text: "0x" + uint8ArrayToHexString(selectedBeacon.payload, 5) + "\nPress OK to stop.",
                button_center: "Stop"
            };
            dialog.custom(dialogParams);

            stopBroadcast();
        }
    }
}

stopBroadcast();
mainMenu();
showAboutMessage();
print("Press back to exit.");
