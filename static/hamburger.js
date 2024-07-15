// const hamburger = document.querySelector(".hamburger");
// const navMenu = document.querySelector(".nav-menu");

// hamburger.addEventListener("click", () => {
//     hamburger.classList.toggle("active");
//     navMenu.classList.toggle("active");
// })

// document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
//     hamburger.classList.remove("active");
//     navMenu.classList.remove("active");
// }))


const menuToggle = document.getElementById("menu-toggle");
const navigation = document.querySelector("nav");

menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) {
        navigation.style.display = "block";
    } else {
        navigation.style.display = "none";
    }
});
