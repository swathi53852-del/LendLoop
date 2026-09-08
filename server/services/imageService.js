// ==========================================
// AUTOMATIC ITEM IMAGE SERVICE
// ==========================================

function getItemImage(name, category) {

    const itemName = String(name || "").toLowerCase().trim();
    const itemCategory = String(category || "").toLowerCase().trim();

    const searchText = `${itemName} ${itemCategory}`;


    // ==========================================
    // ELECTRONICS
    // ==========================================

    if (
        searchText.includes("laptop") ||
        searchText.includes("computer") ||
        searchText.includes("macbook")
    ) {
        return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("mobile") ||
        searchText.includes("phone") ||
        searchText.includes("iphone") ||
        searchText.includes("smartphone")
    ) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("tablet") ||
        searchText.includes("ipad")
    ) {
        return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("camera") ||
        searchText.includes("dslr")
    ) {
        return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("headphone") ||
        searchText.includes("headset")
    ) {
        return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("keyboard")) {
        return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("mouse")) {
        return "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("speaker")) {
        return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("television") ||
        searchText.includes(" tv ")
    ) {
        return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("printer")) {
        return "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // WATCHES
    // ==========================================

    if (
        searchText.includes("watch") ||
        searchText.includes("smartwatch")
    ) {
        return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
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
        return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // SPORTS
    // ==========================================

    if (
        searchText.includes("cricket bat") ||
        searchText.includes("bat")
    ) {
        return "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("football") ||
        searchText.includes("soccer")
    ) {
        return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("basketball")) {
        return "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("tennis racket") ||
        searchText.includes("tennis")
    ) {
        return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("badminton")) {
        return "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("volleyball")) {
        return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("gym") ||
        searchText.includes("dumbbell")
    ) {
        return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // VEHICLES
    // ==========================================

    if (
        searchText.includes("bicycle") ||
        searchText.includes("bike") ||
        searchText.includes("cycle")
    ) {
        return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("scooter")) {
        return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("car")) {
        return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // CLOTHING
    // ==========================================

    if (
        searchText.includes("shirt") ||
        searchText.includes("t-shirt") ||
        searchText.includes("tshirt")
    ) {
        return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("jeans") ||
        searchText.includes("pants")
    ) {
        return "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("dress")) {
        return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("jacket") ||
        searchText.includes("coat")
    ) {
        return "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("shoe") ||
        searchText.includes("shoes") ||
        searchText.includes("sneaker")
    ) {
        return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("bag") ||
        searchText.includes("backpack")
    ) {
        return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // FURNITURE
    // ==========================================

    if (searchText.includes("chair")) {
        return "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("table")) {
        return "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("sofa") ||
        searchText.includes("couch")
    ) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("bed")) {
        return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("desk")) {
        return "https://images.unsplash.com/photo-1518455027359-f3f8164ba6a7?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // TOOLS
    // ==========================================

    if (searchText.includes("hammer")) {
        return "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("drill")) {
        return "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("tool") ||
        itemCategory.includes("tool")
    ) {
        return "https://images.unsplash.com/photo-1581147036324-c17ac41e8b55?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // MUSICAL INSTRUMENTS
    // ==========================================

    if (searchText.includes("guitar")) {
        return "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("piano")) {
        return "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("drum")) {
        return "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // TRAVEL
    // ==========================================

    if (
        searchText.includes("suitcase") ||
        searchText.includes("luggage")
    ) {
        return "https://images.unsplash.com/photo-1565026057447-bc90a039085d?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("tent")) {
        return "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // KITCHEN
    // ==========================================

    if (
        searchText.includes("coffee maker") ||
        searchText.includes("coffee machine")
    ) {
        return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80";
    }

    if (searchText.includes("blender")) {
        return "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80";
    }

    if (
        searchText.includes("kitchen") ||
        itemCategory.includes("kitchen")
    ) {
        return "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // TOYS
    // ==========================================

    if (
        searchText.includes("toy") ||
        searchText.includes("teddy")
    ) {
        return "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80";
    }


    // ==========================================
    // DEFAULT IMAGE
    // ==========================================

    return "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80";
}


module.exports = {
    getItemImage
};