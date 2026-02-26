// ================= SEARCH =================
function toggleSearch() {
  var wrap = document.querySelector(".search-wrap");
  var input = document.getElementById("searchInput");
  var inputMobile = document.getElementById("searchInputMobile");
  if (!wrap) return;
  wrap.classList.toggle("open");
  if (wrap.classList.contains("open")) {
    if (input) { input.value = ""; input.focus(); }
    if (inputMobile) inputMobile.value = "";
    handleSearch("");
  } else {
    if (input) input.value = "";
    if (inputMobile) inputMobile.value = "";
    handleSearch("");
  }
}

function syncSearchInputs(value) {
  var input = document.getElementById("searchInput");
  if (input) input.value = value;
}

function clearSearchMobile() {
  var inputMobile = document.getElementById("searchInputMobile");
  if (inputMobile) { inputMobile.value = ""; inputMobile.focus(); }
  handleSearch("");
}

function handleSearch(value) {
  var term = (value || "").trim().toLowerCase();
  var cards = document.querySelectorAll(".category-card, .product-card");
  var noResults = document.getElementById("searchNoResults");
  var visible = 0;
  cards.forEach(function(card) {
    var h3 = card.querySelector("h3");
    var p = card.querySelector(".category-info p, .product-info p");
    var name = card.dataset.name || "";
    var text = ((h3 && h3.textContent) || "") + " " + ((p && p.textContent) || "") + " " + name;
    var show = !term || text.toLowerCase().indexOf(term) !== -1;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  if (noResults) {
    if (term && visible === 0) { noResults.classList.add("visible"); noResults.textContent = 'No results found for "' + value.trim() + '".'; }
    else { noResults.classList.remove("visible"); noResults.textContent = "No results found."; }
  }
}

document.addEventListener("click", function(e) {
  var wrap = document.querySelector(".search-wrap");
  if (wrap && wrap.classList.contains("open") && !wrap.contains(e.target)) toggleSearch();
});

export { toggleSearch, syncSearchInputs, clearSearchMobile, handleSearch };
