// serve para mostrar a div "balao",que mostra onde deverá ser clicado.
const balaoPikachu = document.querySelector('.balaoFala');
const balaoUmbreon = document.querySelector('.balaoFala-dark');
const container = document.querySelector('.container');

//serve para trocar os estilos conforme o click do usuário 
function alternarModo() {
    container.classList.toggle('modo-login');
}
// vê se o usuário trocou de modo através do click

balaoPikachu.addEventListener('click', alternarModo);
balaoUmbreon.addEventListener('click', alternarModo);

 // serve para identificar os botões 
 
const cadastroForm = document.querySelector('.cadastroForm');

const loginForm = document.querySelector('.loginform');

// serve para criar uma função para trocar de pagina quando os botões forem acionados e armazenamento do nome do usuário.

function UsuarioLogado() {
  const nomeDigitado = document.getElementById('nome').value || document.getElementById('nomeLogin').value
  localStorage.setItem('NomeDoUsuario', nomeDigitado)
  const tl = gsap.timeline();
  tl.to(".container, .apresentacao", {
    opacity:0,
    duration:3,
    scale: 0.0
  })
  .add(() => {
    window.location.href = "corpoPrincipal.html"
  })
  
}
    
  //verifica se os botões foram acionados
cadastroForm.addEventListener('submit',(event) => {
  event.preventDefault();
  UsuarioLogado();
});
loginForm.addEventListener('submit',(event) => {
  event.preventDefault();
  UsuarioLogado();
});


//GSAP códigos 

 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger,ScrollSmoother)
    const tl1 = gsap.timeline();
    tl1.from(".container", {
      transformOrigin: "center left",
      width: "15%",
      opacity: 0,
      duration: 5,
      
    })
 });
