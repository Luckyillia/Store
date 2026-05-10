/* ===== data/all-items-db.js ===== */
// Master database that combines all item types

// Import all databases
// Note: In your HTML file, include these scripts in order:
// 1. items-db.js (basic items)
// 2. skins-db.js
// 3. accessories-db.js (masks, hats, glasses, backpacks, etc.)
// 4. vinyls-db.js
// 5. frames-db.js
// 6. wheels-db.js
// 7. all-items-db.js (this file)

// Function to get all items combined
function getAllItems() {
    const allItems = [];
    
    // Add basic items
    if (window.itemsDatabase) {
        allItems.push(...window.itemsDatabase);
    }
    
    // Add skins
    if (window.skinsDatabase) {
        allItems.push(...window.skinsDatabase);
    }

    // Add accessories (masks, hats, glasses, backpacks, etc.)
    if (window.accessoriesDatabase) {
        allItems.push(...window.accessoriesDatabase);
    }
    
    // Add vinyls
    if (window.vinylsDatabase) {
        allItems.push(...window.vinylsDatabase);
    }
    
    // Add frames
    if (window.framesDatabase) {
        allItems.push(...window.framesDatabase);
    }
    
    // Add wheels
    if (window.wheelsDatabase) {
        allItems.push(...window.wheelsDatabase);
    }
    
    return allItems;
}

// Function to get items by type
function getItemsByType(type) {
    const allItems = getAllItems();
    return allItems.filter(item => item.type === type);
}

// Function to get item by ID
function getItemById(id) {
    const allItems = getAllItems();
    return allItems.find(item => item.id === id);
}

// Function to get skins (most commonly used)
function getSkins() {
    return window.skinsDatabase || [];
}

// Function to get accessories (masks, hats, glasses, backpacks, etc.)
function getAccessories() {
    return window.accessoriesDatabase || [];
}

// Function to search items by name
function searchItems(query) {
    const allItems = getAllItems();
    return allItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

// Export functions
window.getAllItems = getAllItems;
window.getItemsByType = getItemsByType;
window.getItemById = getItemById;
window.getSkins = getSkins;
window.getAccessories = getAccessories;
window.searchItems = searchItems;
