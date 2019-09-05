class Despesa {
	constructor(ano,mes,dia,tipo,descricao,valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo 
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this [i] == null){
				return false
			}
		}
		return true
	}
}

class BD {
	constructor() {
		let id = localStorage.getItem('id')
		if(id===null){
			localStorage.setItem('id',0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id') // null
		return parseInt(proximoId) + 1
	}

	gravar(despesa) {
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(despesa))
		localStorage.setItem('id', id)
	}

	totalDeDespesas() {
		let total = 0
		let keys = Object.keys(localStorage)
		let quantidadeDeChaves = keys.length

		for (let i = 1; i < quantidadeDeChaves; i++ ) {
			let despesa = JSON.parse(localStorage.getItem(i))
			total = total + parseFloat(despesa.valor)
		}
		return total
	}

	recuperarTodosRegistros() {
		let despesas = Array()
		let id =localStorage.getItem('id')
		//Recuperar todas as dispesas
		for(let i = 1; i <= id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))

			//Existe a possibilidade de haver indices que foram pulados/removidos

			if(despesa === null){
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array()

		despesasFiltradas =	this.recuperarTodosRegistros()
		//console.log(despesa)
		//console.log(despesasFiltradas)
		//ano
		if (despesa.ano != '') {
			console.log('Filtro de ano');
		despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}	
		 //mes
		 if (despesa.mes != '') {
		 	//console.log('filtro mes');
		 	despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		 }
		 //dia
		 if (despesa.dia != '') {
		 //	console.log('filtro dia');
		despesasFiltradas = despesasFiltradas.filter(d=> d.dia == despesa.dia)
		 }
		 //tipo
		if (despesa.tipo != '') {
		//	console.log('filtro tipo');
			despesasFiltradas = despesasFiltradas.filter(d=>d.tipo== despesa.tipo)
		}
		//descricao
		if (despesa.descricao != '') {
		//	console.log('filtro descricao');
			despesasFiltradas = despesasFiltradas.filter(d=>d.descricao==despesa.descricao)
		}
		//valor
		if(despesa.valor != ''){
		//	console.log('filtro valor');
			despesasFiltradas = despesasFiltradas.filter(d=>d.valor == despesa.valor)
		 
		}
		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}


let bd = new BD() 

function cadastrarDespesa () {
	let ano = document.getElementById('ano')
	let mes =document.getElementById('mes')
	let dia =document.getElementById('dia')
	let tipo =document.getElementById('tipo')
	let descricao =document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value)

	if(despesa.validarDados()) {
	    bd.gravar(despesa)               
	    //innerHTML - Representa o elemento interno
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = ' Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML='Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	} else {		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do resgistro'
		document.getElementById('modal_titulo_div').className ='modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente !'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className ='btn btn-danger'
		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(),filtro = false) {

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	// selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')

	listaDespesas.innerHTML= ''

	despesas.forEach(function (d) {
		//console.log(d)
		//criando a linha (tr)
		let linha =listaDespesas.insertRow()
		//criar as colunas (td)
		linha.insertCell(0).innerHTML =`${d.dia}/${d.mes}/${d.ano}` 

		//ajustar o tipo
		switch (d.tipo) {
			case '1':d.tipo = 'Alimentação'
			break;
			case '2':d.tipo = 'Educação'
			break;
			case '3':d.tipo = 'Lazer'
			break;
			case '4':d.tipo = 'Saude'
			break;
			case '5':d.tipo = 'Transporte'
			break;			
		}

		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//Criar o botao de exclusao
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML ='<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick=function () { 
		// remover a despesa
		
			let id = this.id.replace('id_despesa_', '')
			
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
	})

	document.getElementById('totalDespesas').innerText = bd.totalDeDespesas()
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

	let despesas = bd.pesquisar(despesa)

	this.carregaListaDespesas(despesas,true)
}

//Mascara de Valor
function moeda(a, e, r, t) {
    let n = ""
      , h = j = 0
      , u = tamanho2 = 0
      , l = ajd2 = ""
      , o = window.Event ? t.which : t.keyCode;
    if (13 == o || 8 == o)
        return !0;
    if (n = String.fromCharCode(o),
    -1 == "0123456789".indexOf(n))
        return !1;
    for (u = a.value.length,
    h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
        ;
    for (l = ""; h < u; h++)
        -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
    if (l += n,
    0 == (u = l.length) && (a.value = ""),
    1 == u && (a.value = "0" + r + "0" + l),
    2 == u && (a.value = "0" + r + l),
    u > 2) {
        for (ajd2 = "",
        j = 0,
        h = u - 3; h >= 0; h--)
            3 == j && (ajd2 += e,
            j = 0),
            ajd2 += l.charAt(h),
            j++;
        for (a.value = "",
        tamanho2 = ajd2.length,
        h = tamanho2 - 1; h >= 0; h--)
            a.value += ajd2.charAt(h);
        a.value += r + l.substr(u - 2, u)
    }
    return !1
}

// // Somatorio dos resultados 
// function calcular(column = 4){
// let	total = 0
// let valor = parseInt(document.getElementById('valor').value)
// total+=valor
// document.getElementById('resul').value = total

// }
// funcao somatoria
// despesas.forEach(function(a)){
// 	console.log(a)
// total = 0
// let linha = resul.insertRow()
// let resul = document.getElementById('resul')
// total+=d.valor
// linha.insertCell(2).innerHTML = a.total
// }