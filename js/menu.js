// ================= MOBILE MENU =================
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");
  if (nav) {
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open", nav.classList.contains("active"));
  }
  if (menuIcon) menuIcon.style.display = nav && nav.classList.contains("active") ? "none" : "block";
  if (closeIcon) closeIcon.style.display = nav && nav.classList.contains("active") ? "block" : "none";
}

document.addEventListener("click", function(e) {
  const nav = document.getElementById("navLinks");
  if (nav && nav.classList.contains("active") && e.target.closest(".nav-links a")) toggleMenu();
});

export { toggleMenu };
