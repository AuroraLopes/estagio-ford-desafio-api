const NomeCompromisso = document.getElementById('nome__compromisso');
const DescCompromisso = document.getElementById('descricao__compromisso');
const DataCompromisso = document.getElementById('data__compromisso');
const EditarNome = document.getElementById('nome__compromisso__editar');
const EditarDesc = document.getElementById('descricao__compromisso__editar');
const EditarData = document.getElementById('data__compromisso__editar');
const ButtonMostrarAddCompromisso = document.getElementById('button__adicionar__compromisso');
const FormularioEdit = document.querySelector('.main__agenda__content__editar__compromisso');
const FormularioAdd = document.querySelector('.main__agenda__content__adicionar_compromisso');
const ButtonEditCompromisso = document.getElementById('button__editar__compromisso');
const ButtonAddCompromissoForm = document.getElementById('button__adicionar__compromisso__form');
const ButtonEditCompromissoForm = document.getElementById('button__editar__compromisso__form');
const ButtonDelCompromisso = document.getElementById('button__deletar__compromisso');
const ContentEventos = document.getElementById('main__agenda__content__compromissos');
let EventoSelecionado = null;
let ElementoSelecionado = null;
let ControlForm = false;
let ControlEditorForm = false;

ButtonAddCompromissoForm.addEventListener('click', adicionarEvento);
ButtonDelCompromisso.addEventListener('click', deletarEvento);
ButtonMostrarAddCompromisso.addEventListener('click', abrirForm);
ButtonEditCompromisso.addEventListener('click', abrirEditor);
ButtonEditCompromissoForm.addEventListener('click',editandoDados);


buscarEventos()



/*Criei uma funtion para o meu botão de adicionar evento, onde criei uma variavel para fazer o controle de abertura onde o valor
inicial é falso para manter o form escondido, utilizando um if e um else para fazer a troca do valor da propriedade style display*/
function abrirForm(){

    if (ControlForm){
        ControlForm = false;
        FormularioAdd.style.display = "none"
        ButtonMostrarAddCompromisso.innerText = "Adicionar"
    } else {
        ControlForm = true;
        FormularioAdd.style.display = "block";
        ButtonMostrarAddCompromisso.innerText = "Sair"
    }
    
}

/* Criei uma function para adicionar eventos ao no banco de dados utilizando o metodo de POST*/ 
async function adicionarEvento() {

    let UrgenciaCompromisso = document.getElementById('urgencia__compromisso__lista');

    const response = await fetch('http://localhost:3000/compromissos', {
        headers: {
            "Content-Type" : "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            nome: NomeCompromisso.value.toUpperCase(),
            descricao: DescCompromisso.value,
            data:DataCompromisso.value,
            urgencia: UrgenciaCompromisso.value
        })
    });

    console.log(UrgenciaCompromisso.value)
    buscarEventos()
}
/* Utilizando o metodo GET do Fetch crieu essa function que busca os eventos que foram adicionados ao banco de dados e atualiza 
a pagina para que o evento recem adicionada seja mostrado na aba de "Seus Compromissos:" utilizando o creatElement e o appendChild para criar
um nó no elemento pai e fazer com que eles não saissem do mesmo.*/
async function buscarEventos() {
    const response = await fetch('http://localhost:3000/compromissos')
    const data = await response.json()

    let eventos = data;
    ContentEventos.replaceChildren(); //serve para limpar todos os filhos em uma lista vazia para que não se repita o que ja foi passado antes.

    for (let n = 0; n < eventos.length; n++) {
        let evento = document.createElement('div');
        evento.classList.add('evento');
        evento.setAttribute('data-id', eventos[n].id);
         

        let titulo = document.createElement('h3');
        titulo.classList.add('evento-titulo'); 
        titulo.textContent = eventos[n].nome.toUpperCase();

        let subTitulo = document.createElement('h4');
        subTitulo.classList.add('evento-titulo');
        subTitulo.textContent = eventos[n].urgencia;

        
        let data = document.createElement('p');
        data.classList.add('evento-data');
        data.textContent = `Data: ${eventos[n].data}`;

        
        let descricao = document.createElement('p');
        descricao.classList.add('evento-descricao'); 
        descricao.textContent = eventos[n].descricao;

    
        evento.appendChild(titulo);
        evento.appendChild(subTitulo)
        evento.appendChild(data);
        evento.appendChild(descricao);

        evento.addEventListener('click', selecionarElemento)
        ContentEventos.append(evento);
    }

}

/* S */
async function selecionarElemento(evento) {
    let itemsId;
    let element = evento.srcElement;
    if (element.classList.contains('evento')) {
        itemsId = element.getAttribute('data-id');
    }else {
        element = element.parentElement;
        itemsId = element.getAttribute('data-id');
    }

    console.info(element)
    console.info(ElementoSelecionado)
    console.info(EventoSelecionado)

    if(element.classList.contains('selecionado')) {
        element.classList.remove('selecionado')
    } else {
        element.classList.add('selecionado')
    }

    if(ElementoSelecionado != null && ElementoSelecionado.classList.contains('selecionado')) {
        ElementoSelecionado.classList.remove('selecionado')
    }

    EventoSelecionado = itemsId;
    ElementoSelecionado = element;

    popularEditor()
}

async function  deletarEvento() {

    if (EventoSelecionado) {
        alert('Deseja mesmo deletar esse evento?')
        const id = EventoSelecionado;
        const url = 'http://localhost:3000/compromissos'
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        }).then(alert('Deleted'));
        
        buscarEventos()
    } else {
        alert('Selecione um evento')
    }
}

async function  editandoDados() {
    
    if (EventoSelecionado){

    let EditarUrgenciaCompromisso = document.getElementById('urgencia__compromisso__lista__editar');
    const atualizacao = {
        method: 'PUT', 
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: EditarNome.value.toUpperCase(),
            descricao: EditarDesc.value,
            data:EditarData.value,
            urgencia:EditarUrgenciaCompromisso.value
        })
    };
    
    const id = EventoSelecionado; // needs the id to update it
    const url = 'http://localhost:3000/compromissos'
    
    fetch(`${url}/${id}`, atualizacao) // passing options
        .then(alert('Updated'));
   }
    
}

async function abrirEditor(){

    console.info(EventoSelecionado);
    if (ControlEditorForm){
        console.info('Entrei aqui')
        ControlEditorForm = false;
        FormularioEdit.style.display = "none"
        ButtonEditCompromisso.innerText = "Editar"
    } else {
        ControlEditorForm = true;
        FormularioEdit.style.display = "block";
        ButtonEditCompromisso.innerText = "Sair"

        popularEditor()
    }
}

async function popularEditor() {
    let EditarUrgenciaCompromisso = document.getElementById('urgencia__compromisso__lista__editar');

    const response = await fetch('http://localhost:3000/compromissos/' + EventoSelecionado)
    const data = await response.json();

    EditarNome.value = data.nome
    EditarDesc.value = data.descricao
    EditarData.value = data.data
    EditarUrgenciaCompromisso.value = data.urgencia
}