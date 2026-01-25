document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger,ScrollSmoother)
    //GSAP códigos 
    const smoother =
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effect: true,
      normalizeScroll: true
    });
     ScrollTrigger.config({ 
  ignoreMobileResize: true 
    });
    ScrollTrigger.normalizeScroll(true); 
const tl1 = gsap.timeline({
    scrollTrigger: {
        trigger: ".container",
        pin: true,
        scrub: 2,
        start: "top top",
        end: "+=1500",
    }
});

tl1.to(".mascara", {
    backgroundSize: "25000vh",
    backgroundPosition: "50% 48%",
    ease: "none"
});

tl1.from(".content h1, .content p", {
    opacity: 0,
    y: 50,
    stagger: 0.8,
    duration: 1
}, "-=0.5");

tl1.add("subida");

tl1.to(".container", {
    transformOrigin: "top top",
    height: "50%",
    opacity: 0.6,
    duration: 5,
}, "subida");

tl1.to(".content h1, .content p", {
    x: "30%",
    opacity: 0,
    stagger: 0.5
}, "<");

tl1.to(".AreaPoke", {
    y: "-75vh"
}, "subida");

tl1.from(".registroPoke", {
    opacity: 0,
    y: 30,
    duration: 2,
}, "-=1");

tl1.from(".registroPoke", {
    height: "5%",
    duration: 2,
    ease: "power2.inOut" 
}, "+=0.5"); 

tl1.from(".registroPoke form > *", {
    opacity: 0,
    y: 20,
    duration: 1,
    stagger: 0.2
}, "-=1.5"); 
tl1.from(".equipePoke", {
    opacity: 0,
    y: 50,
    duration: 2,
}, "-=0.5"); 

tl1.from(".equipePoke", {
    width: "0%", 
    duration: 1.5,
    ease: "power2.inOut" 
}, );

tl1.from(".equipePoke > div", {
    scale: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "back.out(1.7)"
}, "-=1"); 

// Animações de onda do SVG (Independentes)
gsap.to(".custom-shape-divider-bottom-1767561287 path:nth-child(1)", {
    y: -30,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".custom-shape-divider-bottom-1767561287 path:nth-child(2)", {
    x: 100,
    scaleX: 1.1,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".custom-shape-divider-bottom-1767561287 path:nth-child(3)", {
    x: -60,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

})
const EquipePokeRegister = document.getElementById('EquipePokeRegister');

 // variável global para a edição funcionar
 let slotEmEdicao = null
// escopo global para exportar as equipes
 let DadosDasEquipes = []
//  Função  para buscar os dados na PokeAPI
async function fetchPokemonData(nome, slotAlvo = null) {
    return new Promise(async (resolve, reject) => {
        
    const pokemon = nome.toLowerCase().trim();
    if (!pokemon) return;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!response.ok) throw new Error("Pokémon não encontrado");
        
        const data = await response.json(); 
        const spriteAnimado = data.sprites.versions['generation-v']['black-white'].animated.front_default 
              || data.sprites.front_default;

        if (slotAlvo) {
        slotAlvo.innerHTML = `<img src="${spriteAnimado}" class="sprite-pokemon">`;
        slotAlvo.classList.add('ocupado');
        slotAlvo.dataset.pokemon = data.name;
        } 
        else {
        document.getElementById('SpritePoke').src = spriteAnimado;

        const containerTipos = document.querySelector('.tipoPoke');
        containerTipos.innerHTML = ""; 
        data.types.forEach(item => {
        const nomeTipo = item.type.name;
        const divTipo = document.createElement('div');
        const pTipo = document.createElement('p');

        pTipo.textContent = nomeTipo.toUpperCase();
        divTipo.classList.add('box-tipo', nomeTipo); 
                        
        divTipo.appendChild(pTipo);
        containerTipos.appendChild(divTipo);
        });
        const selectsAtaques = document.querySelectorAll('.move-select');

            if (selectsAtaques.length > 0 && data.moves) {
        const listaAtaques = data.moves.map(m => m.move.name).sort();
        
        selectsAtaques.forEach(select => {
        select.innerHTML = '<option value="" disabled selected>Escolha um ataque</option>';
        listaAtaques.forEach(nomeAtaque => {
        const option = document.createElement('option');
        option.value = nomeAtaque;
                        
         option.textContent = nomeAtaque.replace(/-/g, ' ').toUpperCase();
        select.appendChild(option);
            });
        });
    }
}
    // --- Preenchimento de Habilidades ---
const selectHabilidade = document.getElementById('PokeHability');

if (data.abilities && data.abilities.length > 0) {
    selectHabilidade.innerHTML = '<option value="" disabled selected>ESCOLHA A HABILIDADE</option>';
    
    data.abilities.forEach(item => {
        const option = document.createElement('option');
        option.value = item.ability.name;
        option.textContent = item.ability.name.replace(/-/g, ' ').toUpperCase();
        selectHabilidade.appendChild(option);
    });
        resolve()
}

    } catch (error) {
        console.error("Erro na busca:", error);
        
        if (!slotAlvo) {
        document.getElementById('SpritePoke').src = "";
        document.querySelector('.tipoPoke').innerHTML = "<p>Não encontrado</p>";
        document.querySelectorAll('.move-select').forEach(sel => {
                sel.innerHTML = '<option value="" disabled selected>Erro na busca</option>';
            });
        }
    }
  }
 )}
// está função serve para mostrar o ícone do tipo do ataque
async function updateMoveType(selectElement, badgeId) {
    const moveName = selectElement.value;
    const badge = document.getElementById(badgeId);
    
    if (!moveName) {
        badge.innerHTML = "";
        return;
    }

    try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    const data = await response.json();
    const type = data.type.name;
    badge.innerHTML = `<span class="badge ${type}">${type.toUpperCase()}</span>`;
    } catch (error) {
        console.error("Erro ao buscar tipo do move:", error);
    }
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('move-select')) {
    const idNumber = e.target.id.replace('Ataque', '');
    updateMoveType(e.target, `TypeIcon${idNumber}`);
    }
});


document.getElementById('PokeName').addEventListener('blur', (event) => {
    fetchPokemonData(event.target.value);
});

// logica para o botão de registro pokémon
const btnConfirmar = document.getElementById('RegistradoBNT');

const formulario = document.querySelector(".registroPoke form");

btnConfirmar.addEventListener('click', (e) => {
    e.preventDefault(); 

    const nome = document.getElementById('PokeName').value;
    const spriteUrl = document.getElementById('SpritePoke').src;
    
    // Verificações básicas
    if (!nome || !spriteUrl || spriteUrl === "" || spriteUrl.includes("window.location.href")) {
        alert("Por favor, informe o nome e busque um Pokémon válido!");
        return;
    }

    // Identifica onde vamos salvar (Edição ou Novo Slot)
    let alvo = null;
    if (slotEmEdicao) {
        alvo = slotEmEdicao;
    } else {
        const slots = document.querySelectorAll('.equipePoke > div');
        for (let slot of slots) {
            if (!slot.classList.contains('ocupado')) {
                alvo = slot;
                break; 
            }
        }
    }

    if (alvo) {
        const dadosCompletos = {
        nome: nome,
        sprite: spriteUrl,
        natureza: document.getElementById('PokeNature').value,
        habilidade: document.getElementById('PokeHability').value,
        item: document.getElementById('PokeItem').value,
        ataques: [
        document.getElementById('Ataque1').value,
        document.getElementById('Ataque2').value,
        document.getElementById('Ataque3').value,
        document.getElementById('Ataque4').value
        ]
 };
    alvo.innerHTML = `<img src="${spriteUrl}" alt="${nome}" class="sprite-pokemon">`;
    alvo.classList.add('ocupado');
    alvo.dataset.pokemon = nome;
    alvo.dataset.infoCompleta = JSON.stringify(dadosCompletos);

    alert(slotEmEdicao ? `${nome.toUpperCase()} atualizado!` : `${nome.toUpperCase()} adicionado!`);
    formulario.reset(); 
    document.getElementById('SpritePoke').src = "";
    document.querySelector('.tipoPoke').innerHTML = ""; 
        
    document.querySelectorAll('.type-badge').forEach(span => span.innerHTML = "");
        
        slotEmEdicao = null; 
        
    } else {
        alert("Sua equipe já está cheia! Clique em um Pokémon para editá-lo.");
    }
});



//Lógica para criar uma área com as equipes Pokémon dos usuários.
const BotaoEquipePoke = document.getElementById('EquipePokeRegister')
 
BotaoEquipePoke.addEventListener(
    "click", (e) => {
        let Equipe = []
        e.preventDefault();
       const slotsOcupados = document.querySelectorAll('.equipePoke > div.ocupado');
       slotsOcupados.forEach(slot => {
        const imagem = slot.querySelector('img');
        const dadosPokemon = {
            nome: slot.dataset.pokemon,
            foto: imagem.src,
            info: slot.dataset.infoCompleta
        };
        Equipe.push(dadosPokemon);
     })
     const nomeTreinador = localStorage.getItem('NomeDoUsuario')
             // tentativa de resolver um BUG de duplicação na hora de criação do card.
    if (nomeTreinador === "" || Equipe.length === 0) {
        console.log("Bloqueado: Tentativa de registro sem Pokémons ou sem nome.");
        alert("Ops! Você precisa de um nome e pelo menos um Pokémon na equipe.");
        return; 
    }
     const equipeCadastrada = document.createElement('div')
     equipeCadastrada.classList.add('card-treinador')

    const fotosHtml = Equipe.map((p) => {
        return `<img src="${p.foto}" class="mini-sprite">`;
    }).join('');
    
    // vai servir para identificar cada equipe para o CSV
    
    const novaEquipe = {
            id: Date.now(),
            treinador: nomeTreinador,
            pokemons: Equipe,
        }
        DadosDasEquipes.push(novaEquipe)
        
// região para observar se o usuário que está logado pode excluir equipes e editar.
    const usuarioAtual = localStorage.getItem("NomeDoUsuario");
    
    const nomeDoTreinador = localStorage.getItem("NomeDoUsuario");
    let botoesHTML = "";
    if (usuarioAtual === nomeDoTreinador) {
        botoesHTML = `<button class="btn-editar" data-id="${novaEquipe.id}">Editar</button>
        <button class="btn-excluir" data-id="${novaEquipe.id}">Excluir</button>`;
    }
// região onde se monta a estrutura para guardar os dados visualmente.
    equipeCadastrada.innerHTML = `
        <h3>Treinador: ${nomeTreinador}</h3>
        <div class="fotos-lista">
            ${fotosHtml}
        </div>
        <div class="area-botoes">
        ${botoesHTML}
        </div>
    `;
    
    const listaJogadores = document.querySelector('.Jogadores');
    
    listaJogadores.appendChild(equipeCadastrada);
    
    slotsOcupados.forEach(slot => {
        slot.innerHTML = ""; 
        slot.classList.remove('ocupado'); 
        delete slot.dataset.pokemon;
    });
        
    alert("Sua equipe foi registrada no torneio!");
});

// serve para gerar o CSV das equipes!
    function baixarCSV() {
        
    if (DadosDasEquipes.length === 0) {
        alert("Não há equipas para exportar!");
        return;
    }

    let csvCabecario = "ID,Treinador,Pokemons\n";

    DadosDasEquipes.forEach(equipe => {
        let ListaNomesPoke = equipe.pokemons.map(p => p.nome).join(",");
        
        let IdJogador = equipe.id;
        let NomeDoTreinador = equipe.treinador;
        
        let fraseCSV = `${IdJogador},${NomeDoTreinador},${ListaNomesPoke}\n`;
        
        csvCabecario += fraseCSV; 
    });
    const blob = new Blob([csvCabecario], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'equipes_torneio.csv');
        a.click();
        window.URL.revokeObjectURL(url);
}   
    const bntExportar = document.getElementById('bntExportar');
    bntExportar.addEventListener('click', baixarCSV);
    // Seleciona o container que guarda todos os cards
const listaJogadores = document.querySelector('.Jogadores');

    // esta parte servirá para excluir e editar os arrays das equipes do HTML.
listaJogadores.addEventListener('click', (e) => {

    if (e.target.classList.contains('btn-excluir')) {

        const idParaRemover = Number(e.target.dataset.id);

        DadosDasEquipes = DadosDasEquipes.filter(equipe => equipe.id !== idParaRemover);

        const cardParaRemover = e.target.closest('.card-treinador');
        cardParaRemover.remove();

        alert("Equipe removida com sucesso!");
    }
    if (e.target.classList.contains('btn-editar')) {
        const idSelecionado = Number(e.target.dataset.id)
        let equipeEncontrada = DadosDasEquipes.find(equipe => equipe.id === idSelecionado)
        // Seleciona todos os slots dentro da equipePoke
        const todosOsSlots = document.querySelectorAll('.equipePoke > div');
        
        todosOsSlots.forEach(slot => todosOsSlots.forEach(slot => {
        slot.addEventListener('click', async () => {
        const nomeDoPoke = slot.dataset.pokemon;
        if (nomeDoPoke) {
            slotEmEdicao = slot; 
            
            
        fetchPokemonData(nomeDoPoke, slot).then(() => {
                
        if (slot.dataset.infoCompleta) {
        const info = JSON.parse(slot.dataset.infoCompleta);
                    
        // aqui o sistema reaplica tudo de volta
        document.getElementById('PokeNature').value = info.natureza || "";
        document.getElementById('PokeHability').value = info.habilidade || "";
        document.getElementById('Ataque1').value = info.ataques[0] || "";
        document.getElementById('Ataque2').value = info.ataques[1] || "";
        document.getElementById('Ataque3').value = info.ataques[2] || "";
        document.getElementById('Ataque4').value = info.ataques[3] || "";
                    
        console.log("Valores recuperados do slot com sucesso!");
                }
            });
        }
    });
}));
        equipeEncontrada.pokemons.forEach((pokemon, index) => {
            
            // 1. Criamos o nome da classe do slot alvo
        let numeroDoSlot = index + 1;
        let seletor = `.poke${numeroDoSlot}`;
        let slotAlvo = document.querySelector(seletor);
        
         if (slotAlvo) {
        slotAlvo.innerHTML = `<img src="${pokemon.foto}" class="sprite-pokemon">`;
         slotAlvo.classList.add('ocupado');
        slotAlvo.dataset.pokemon = pokemon.nome;
            }
        });
        // Dizemos: O novo valor de DadosDasEquipes será ele mesmo filtrado
        DadosDasEquipes = DadosDasEquipes.filter(equipe => equipe.id !== idSelecionado);
       // Salva a lista atualizada (sem a equipe que foi para o editor)
        localStorage.setItem('EquipesCadastradas', JSON.stringify(DadosDasEquipes));

        const cardVisual = e.target.closest('.card-treinador');
        cardVisual.remove();
        window.scrollTo({
            top: 100, 
            behavior: 'smooth'
        });
        
        console.log("Equipe enviada para edição e versão antiga removida!");

    }
});
// --- COLE AQUI A FUNÇÃO DE TRANSFERÊNCIA ---
    function transferirParaBusca(nomePokemon) {
        if (!nomePokemon) return;
        const inputBusca = document.getElementById('PokeName'); 
        if (inputBusca) {
            inputBusca.value = nomePokemon;
            return fetchPokemonData(nomePokemon); 
        }
    }

    // --- COLE AQUI O OUVINTE DE CLIQUE NOS SLOTS ---
    const slotsEquipe = document.querySelectorAll('.equipePoke > div');
slotsEquipe.forEach(slot => {
    slot.style.cursor = "pointer"; 
    
    slot.addEventListener('click', async () => {
        const nomeDoPoke = slot.dataset.pokemon; 
        
        if (nomeDoPoke) {
            slotEmEdicao = slot; 
        await transferirParaBusca(nomeDoPoke);

//recupera os valores salvos após a definição dos selects.
        if (slot.dataset.infoCompleta) {
        const info = JSON.parse(slot.dataset.infoCompleta);
        
//reaplica os valores!(estou ficando louco)
        document.getElementById('PokeNature').value = info.natureza || "";
        document.getElementById('PokeHability').value = info.habilidade || "";
        document.getElementById('PokeItem').value = info.item || ""; 
        // Reaplicando ataques (com verificação de segurança)
        const selects = [
        document.getElementById('Ataque1'),
        document.getElementById('Ataque2'),
        document.getElementById('Ataque3'),
        document.getElementById('Ataque4')
                ];

        selects.forEach((sel, i) => {
        if(info.ataques[i]) {
        sel.value = info.ataques[i];
    // Atualiza o ícone do tipo manualmente após setar o valor
        const badgeId = `TypeIcon${i + 1}`;
        updateMoveType(sel, badgeId);
        }
    });

        console.log(`Edição iniciada para: ${nomeDoPoke}`);
            }
        }
    });
});


// aqui irá ter o necessário para o sistema conseguir ler um arquivo CSV para tranformar em uma equipe.
    const fileCSV = document.getElementById('inputCSV');

    fileCSV.addEventListener('change', (event) => {
    const arquivo = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
    const conteudoCompleto = e.target.result;
    const linhas = conteudoCompleto.split("\n");
    const linhasDeDados = linhas.slice(1); 
    const todosOsSlots = document.querySelectorAll('.equipePoke > div');
    todosOsSlots.forEach(slot => {
    slot.innerHTML = "";
    slot.classList.remove('ocupado');
        delete slot.dataset.pokemon;
});
    
    linhasDeDados.forEach(linha => {
        if (linha.trim() === "") return;
    const colunas = linha.split(",");
    const nomeTreinadorImportado = colunas[1];
    const nomesPokemons = colunas.slice(2); 
    localStorage.setItem('NomeDoUsuario', nomeTreinadorImportado);
    nomesPokemons.forEach((nomePoke, index) => {
        if (nomePoke.trim() !== "" && todosOsSlots[index]) {
        console.log("Buscando Pokémon:", nomePoke.trim());
        fetchPokemonData(nomePoke.trim(), todosOsSlots[index]);
     }
});

    console.log(`Equipe de ${nomeTreinadorImportado} carregada!`);
        }); 
    }; 

    if (arquivo) {
        reader.readAsText(arquivo);
    }
});

// isso aqui serve para a função de edição, para salvar as informações de um pokémon quando vc troca para outro.
// Função para salvar as seleções atuais no slot em edição
const salvarEscolhasTemporarias = () => {
    if (!slotEmEdicao) return;

    const dados = {
        nome: slotEmEdicao.dataset.pokemon,
        natureza: document.getElementById('PokeNature').value,
        habilidade: document.getElementById('PokeHability').value,
        ataques: [
        document.getElementById('Ataque1').value,
        document.getElementById('Ataque2').value,
        document.getElementById('Ataque3').value,
        document.getElementById('Ataque4').value
        ]
    };

    // Guarda no dataset para não perder ao trocar de slot
    slotEmEdicao.dataset.infoCompleta = JSON.stringify(dados);
};
// Adiciona ouvintes de mudança em todos os selects do formulário
    document.querySelectorAll('.move-select, #PokeNature, #PokeHability').forEach(select => {
    select.addEventListener('change', salvarEscolhasTemporarias);
});

