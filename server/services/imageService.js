
 // ==========================================
 // AUTOMATIC ITEM IMAGE SERVICE
 // Original links preserved + extra image links
 // ==========================================

function chooseImage(searchText, images) {
    // Stable selection: the same item/category gets the same image.
    let hash = 0;

    for (let i = 0; i < searchText.length; i++) {
        hash = (hash * 31 + searchText.charCodeAt(i)) | 0;
    }

    return images[Math.abs(hash) % images.length];
}

function getItemImage(name, category) {
    const itemName = String(name || "").toLowerCase().trim();
    const itemCategory = String(category || "").toLowerCase().trim();
    const searchText = `${itemName} ${itemCategory}`;
    const pick = (images) => chooseImage(searchText, images);

    // ==========================================
    // ELECTRONICS
    // ==========================================

    if (
        searchText.includes("laptop") ||
        searchText.includes("computer") ||
        searchText.includes("macbook")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo- laptop-placeholder?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
        ].filter(url => !url.includes("placeholder")));
    }

    if (
        searchText.includes("mobile") ||
        searchText.includes("phone") ||
        searchText.includes("iphone") ||
        searchText.includes("smartphone")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (
        searchText.includes("tablet") ||
        searchText.includes("ipad")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (
        searchText.includes("camera") ||
        searchText.includes("dslr")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1510127034890-7b7b6c4c3c8f?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (
        searchText.includes("headphone") ||
        searchText.includes("headset") ||
        searchText.includes("earphone")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("keyboard")) {
        return pick([
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("mouse")) {
        return pick([
            "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("speaker")) {
        return pick([
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (
        searchText.includes("television") ||
        searchText.includes(" tv ")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("printer")) {
        return pick([
            "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // WATCHES
    // ==========================================

    if (searchText.includes("watch") || searchText.includes("smartwatch")) {
        return pick([
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // BOOKS
    // ==========================================

    if (
        searchText.includes("book") ||
        searchText.includes("textbook") ||
        searchText.includes("novel") ||
        itemCategory.includes("book")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // SPORTS
    // ==========================================

    if (searchText.includes("cricket bat") || searchText.includes("bat")) {
        return pick([
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("football") || searchText.includes("soccer")) {
        return pick([
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("basketball")) {
        return pick([
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518065896235-a4c93e088e7b?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("tennis racket") || searchText.includes("tennis")) {
        return pick([
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("badminton")) {
        return pick([
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613918431703-aa50889e3be3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("volleyball")) {
        return pick([
            "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1562552052-3e9c6b2b7e6f?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("gym") || searchText.includes("dumbbell")) {
        return pick([
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // VEHICLES
    // ==========================================

    if (
        searchText.includes("bicycle") ||
        searchText.includes("bike") ||
        searchText.includes("cycle")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("scooter")) {
        return pick([
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("car")) {
        return pick([
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // CLOTHING
    // ==========================================

    if (
        searchText.includes("shirt") ||
        searchText.includes("t-shirt") ||
        searchText.includes("tshirt")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("jeans") || searchText.includes("pants")) {
        return pick([
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("dress")) {
        return pick([
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("jacket") || searchText.includes("coat")) {
        return pick([
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (
        searchText.includes("shoe") ||
        searchText.includes("shoes") ||
        searchText.includes("sneaker")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("bag") || searchText.includes("backpack")) {
        return pick([
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // FURNITURE
    // ==========================================

    if (searchText.includes("chair")) {
        return pick([
            "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598300053653-4e9b8d0d4d3c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("table")) {
        return pick([
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("sofa") || searchText.includes("couch")) {
        return pick([
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80"
        ].filter((url, index, arr) => arr.indexOf(url) === index));
    }

    if (searchText.includes("bed")) {
        return pick([
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
        ].filter((url, index, arr) => arr.indexOf(url) === index));
    }

    if (searchText.includes("desk")) {
        return pick([
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6a7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // TOOLS
    // ==========================================

    if (searchText.includes("hammer") || searchText.includes("drill")) {
        return pick([
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581147036324-c17ac41e8b55?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("tool") || itemCategory.includes("tool")) {
        return pick([
            "https://images.unsplash.com/photo-1581147036324-c17ac41e8b55?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // MUSICAL INSTRUMENTS
    // ==========================================

    if (searchText.includes("guitar")) {
        return pick([
            "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("piano")) {
        return pick([
            "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("drum")) {
        return pick([
            "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // TRAVEL
    // ==========================================

    if (
        searchText.includes("suitcase") ||
        searchText.includes("luggage")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1565026057447-bc90a039085d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1553531384-397f9c2f4f16?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("tent")) {
        return pick([
            "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // KITCHEN
    // ==========================================

    if (
        searchText.includes("coffee maker") ||
        searchText.includes("coffee machine")
    ) {
        return pick([
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("blender")) {
        return pick([
            "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    if (searchText.includes("kitchen") || itemCategory.includes("kitchen")) {
        return pick([
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // TOYS
    // ==========================================

    if (searchText.includes("toy") || searchText.includes("teddy")) {
        return pick([
            "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&w=800&q=80"
        ]);
    }

    // ==========================================
    // DEFAULT IMAGE — ORIGINAL PRESERVED
    // ==========================================

    return "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80";
}

module.exports = {
    getItemImage
};
