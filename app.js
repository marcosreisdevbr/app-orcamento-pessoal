// Variaveis Escopo Global
function setCurrentYearValue(){
	let currentYear = new Date().getFullYear()
	const selectYear = document.querySelector('#ano')
	selectYear[1].innerHTML = currentYear
	selectYear[1].value = currentYear
}

setCurrentYearValue()

class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao =  descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}

		return true
	}	
}

class Bd {
	constructor(){
		let id = localStorage.getItem('id')
		if(id === null){
				localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d){		
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){

		let despesas = []

		let id = localStorage.getItem('id')
		for(let i=1; i<=id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))
			if(despesa === null){continue}
			despesa.id = i			
			despesas.push(despesa)			
		}

		return despesas
	}

	pesquisar(despesa){

		let despesasFiltradas = []
		despesasFiltradas = this.recuperarTodosRegistros()

		// Ano
		if(despesa.ano !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.ano == despesa.ano)
		}

		// Mes
		if(despesa.mes !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.mes == despesa.mes)
		}

		// Dia
		if(despesa.dia !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.dia == despesa.dia)
		}

		// Tipo
		if(despesa.tipo !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.tipo == despesa.tipo)
		}

		// Descrição
		if(despesa.descricao !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.descricao == despesa.descricao)
		}

		// Valor
		if(despesa.valor !== ''){			
			despesasFiltradas = despesasFiltradas.filter(d=>d.valor == despesa.valor)
		}		
		
		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa(){
	let ano = document.querySelector('#ano')
	let mes = document.querySelector('#mes')
	let dia = document.querySelector('#dia')
	let tipo = document.querySelector('#tipo')
	let descricao = document.querySelector('#descricao')
	let valor = document.querySelector('#valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)
	
	if(despesa.validarDados()){
		bd.gravar(despesa)
		console.log('dados Validos')
		showModalSuccess()
		limpaCamposDadosSalvos()
	}else{
		console.log('dados invalidos')
		showModalError()
	}
}

const modalTitle = document.querySelector('#gravarDadosLabel')
const modalBody = document.querySelector('#modal-body')
const button = document.querySelector('#button')

function showModalSuccess(){
	modalTitle.textContent = 'Registro salvo com sucesso'
	modalTitle.classList.add('text-success')
	modalBody.innerHTML = 'Despesa foi cadastrada com sucesso!'
	button.classList.add('bg-success')
	button.innerHTML = 'Voltar'
	let modal = new bootstrap.Modal(document.querySelector('#gravarDados'))
	modal.show()
}

function showModalError(){	
	modalTitle.innerHTML = 'Erro na gravação'
	modalTitle.classList.add('text-danger')
	modalBody.innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
	button.classList.add('bg-danger')
	button.innerHTML = 'Voltar e corrigir'
	let modal = new bootstrap.Modal(document.querySelector('#gravarDados'))
	modal.show()
}

if(button){
	button.addEventListener('click', ()=>{
		modalTitle.innerHTML = ''
		modalBody.innerHTML = ''
		modalTitle.classList.remove('text-danger','text-success')
		button.classList.remove('bg-danger','bg-success')
		button.innerHTML = ''
	})
}

function limpaCamposDadosSalvos(){
	document.querySelectorAll('select, input').forEach((element)=>{element.value = ''})
}

function limparCampos(){
	window.location.reload()
}

function excluirTodos(){
	localStorage.clear()
	window.location.reload()
}

function carregaListaDespesas(despesas = [], filtro = false){
	

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}	
	
	let listaDespesas = document.querySelector('#listaDespesas')	
	listaDespesas.innerHTML = '';

	despesas.forEach((d)=>{
		let linha = listaDespesas.insertRow()

		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		linha.insertCell(1).innerHTML =  verificaTipo(d.tipo)
		linha.insertCell(2).innerHTML = `${d.descricao}`
		linha.insertCell(3).innerHTML = `${d.valor}`	
		
		let btn = document.createElement("button")
		btn.classList.add('btn-danger','btn','btn-md')
		btn.innerHTML = `<i class="fa-solid fa-x"></i>`
		btn.id = `id_despesa_${d.id}`
		btn.onclick = () =>{			
			let id = btn.id.replace('id_despesa_', '')
			bd.remover(id)
			window.location.reload()		
		}
		linha.insertCell(4).append(btn)
	})
}

function verificaTipo(tipo){
	switch(tipo){
		   case '1' : tipo = 'Alimentação'
		break;
		   case '2' : tipo = 'Educação'
		break;
		   case '3' : tipo = 'Lazer'
		break;
		   case '4' : tipo = 'Saúdee'
		break;
		   case '5' : tipo = 'Transporte'
	}
	return tipo
}

function pesquisarDespesa(){
	
	let ano = document.querySelector('#ano').value
	let mes = document.querySelector('#mes').value
	let dia = document.querySelector('#dia').value
	let tipo = document.querySelector('#tipo').value
	let descricao = document.querySelector('#descricao').value
	let valor = document.querySelector('#valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}


const buttonSearch = document.querySelector('#button-search')

if(buttonSearch){
	buttonSearch.addEventListener('click',()=>{	
		let todosCampos = document.querySelectorAll('select, input')
			todosCampos.forEach((campo)=>{
					campo.value = ''
					if(campo.value == ''){
						document.querySelector('#listaDespesas').innerHTML = ''
					}
			})
		
	})
}


