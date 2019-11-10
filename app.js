// *********************************** BUDGET CONTROLLER ***************************************************** 
var budgetController = (function(){
    
    // construtor de Expenses (despesas)
    var Expenses = function(idconstrutor, description, value){        
        this.idconstrutor = idconstrutor;
        this.description = description;
        this.value = value;
        this.porcentage = -5;
    }
    
    // construtor de Incomes (receitas)
    var Income = function(idconstrutor, description, value){           
        this.idconstrutor = idconstrutor;
        this.description = description;
        this.value = value;
    }

    // dados do aplicativo
    var dados = {          
        todosItems: {      // items criados a partir do construtor e colocados dentro de um array de acordo com tipo
            exp: [],
            inc: [],
        },

        totals: {          // total dos items de acordo com seu tipo
            exp: 0,
            inc: 0,
        },

        orcamento: 0,      // total do orcamento
        porcentagem: -1,
    };
    
    // Metodo que pegam a porcentagem individual dentro de cada objeto 
    Expenses.prototype.calcPorcentagemUnica = function(totalIncome){
        
        if(totalIncome > 0){
            this.porcentage = Math.round((this.value / totalIncome) * 100);
            }else{
                this.porcentage = -1;
            };
    };
    // metodo que retorna a porcentagem unica
    Expenses.prototype.getPorcentage = function(){
        return this.porcentage;
    };

    // calculando o orcamento
    var calcularOrcamento = function(type){
        var soma = 0;
        
        dados.todosItems[type].forEach(function(cur) {
            soma = soma + cur.value;
        });
        dados.totals[type] = soma;
        return dados.totals[type];
    };

    return { // inicio do API do budgetController
        
        // retornando a porcentagem total do income (receita)
        totalPorcentage: function(){  
            return dados.porcentagem;
        },
        
        // retornando o orcamento
        totalsBudget: function(type){  
            return calcularOrcamento(type);
        },
        
        // calculando o orcamento total e a porcentagem total 
        calculaTotal: function(){  
            calcularOrcamento('inc');
            calcularOrcamento('exp');
            dados.orcamento = dados.totals.inc - dados.totals.exp;
            
            if(dados.totals.inc > 0){  
            dados.porcentagem = Math.round((dados.totals.exp / dados.totals.inc) * 100);
            }else{
                dados.porcentagem = -1;
            };
            return dados.orcamento;
        },

        // adicionando um novo item na lista
        addItem: function(type, des, val){  
        var novoItem, ID, type;
        //criando um novo ID
        if(dados.todosItems[type].length > 0){  

            ID = dados.todosItems[type][dados.todosItems[type].length-1].idconstrutor + 1;
        }else{
            ID = 0;
        };

        //criando um novo item de acordo com o tipo (inc ou exp)
        if(type === 'exp'){
            novoItem = new Expenses(ID, des, val);
        }else if(type === 'inc'){
            novoItem = new Income(ID, des, val);
        };

        //colocando na estrutura de dados (array)
        dados.todosItems[type].push(novoItem);
        return novoItem;
    }, 

        // deletando da estrutura de dados
        delItem: function(type, id){
            var ids, idconstrutor;
            
            ids = dados.todosItems[type].map(function(current) {
                return current.idconstrutor;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
            dados.todosItems[type].splice(index, 1)
            };
        },

        // calculando as porcentagens unicas
        calculandoPorcentagem: function(){
            
            dados.todosItems.exp.forEach(function(cur){
                cur.calcPorcentagemUnica(dados.totals.inc);
            });
        },

        // criando um array para colocar todas as porcentagens unicas
        todasPorcentagens: function(){
            
            todasPor = dados.todosItems.exp.map(function(cur){
            return cur.getPorcentage();
            });

            return todasPor;
        },
    };
}());

// ********************************** USER INTERFACE CONTROLLER ***********************************************
var UIController = (function(){

    //objeto que lista as classes do HTML
    var DOMStrings = {                                          
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        income: '.income__list',
        expense: '.expenses__list',
        showDescription: '.item__description',
        showValue: '.item__value',
        showOrcamento: '.budget__value',
        showIncome: '.budget__income--value',
        showExpense: '.budget__expenses--value',
        showPorcentagem: '.budget__expenses--percentage',
        deleteDelegation: '.container',
        itemPorcentage: '.item__percentage',
        showData: '.budget__title--month',
    };

    // criando um forEach personalizado para looping the dados da nodelist(lista que retorna quando usa o query selectorAll)
    var nodeForeach = function(lista, callback){
        
        for(var i=0; i<lista.length; i++) {
            callback(lista[i], i)};
    };

    // formatando o numero 
    var formatNumero = function(type, num){
        var num, int, numSplit, decimal;
        num = Math.abs(num);
        num = num.toFixed(2);              //overwriting variavel num
        numSplit = num.split('.');
        int = numSplit[0];
        
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        };
        
        decimal = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;
    };
    
    // criando um array pra incluir os nomes do mes do ano
    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julhor', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    // funcao para pegar as datas correntes
    var currentMonth = function(){
        var m, ano;
        mes = new Date;
        m = mes.getMonth();
        ano = mes.getFullYear();
        return meses[m] + ' de ' + ano;
    };

    return {         // inicio do API do UIController
        meses,     
        // funcao que pega os dados dos inputs colocados pelo usuario
        getInput: function(){
            return{
            type: document.querySelector(DOMStrings.inputType).value, //will be either + or -
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
        },

        // funcao que retorna os DOMStrings
        getDOMStrings: function(){        
            return DOMStrings;
        },

        // funcao que adiciona os item na interface dos usuarios
        additemLista: function(obj, type){
            var element, html, novoHtml;
            
            if(type === 'inc'){
                element = DOMStrings.income,
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expense,
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };
    
            novoHtml = html.replace('%id%', obj.idconstrutor);
            novoHtml = novoHtml.replace('%description%', obj.description);
            novoHtml = novoHtml.replace('%value%', formatNumero(type, obj.value));
            document.querySelector(element).insertAdjacentHTML('beforeend', novoHtml);
        },

        //mostra a data corrente a interface do usuario
        mostraData: function(){
            document.querySelector(DOMStrings.showData).textContent = currentMonth();
        },    

        //mostrar orcamento a interface do usuario
        mostraorcamento(){
            newexpense = budgetController.totalsBudget('exp');
            newincome = budgetController.totalsBudget('inc');
            newPorcentage = budgetController.totalPorcentage();
            newItemPercentagem = budgetController.totalPorcentage();
            neworcamento = budgetController.calculaTotal();
            neworcamento > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.showOrcamento).textContent = formatNumero(type, neworcamento);
            document.querySelector(DOMStrings.showIncome).textContent = formatNumero('inc', newincome);
            document.querySelector(DOMStrings.showExpense).textContent = formatNumero('exp', newexpense);
            
            if(newPorcentage >= 0){
            document.querySelector(DOMStrings.showPorcentagem).textContent = newPorcentage + ' %';
            }else if(newPorcentage < 0){
                document.querySelector(DOMStrings.showPorcentagem).textContent =  '---';
            };
        },

        // deleta um item da lista da interface do usuario
        deleteItemList: function(id){
            var el;
            el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        // zerar o programa quando inicializado
        setZero: function(){
            document.querySelector(DOMStrings.showOrcamento).textContent = '0.00';
            document.querySelector(DOMStrings.showIncome).textContent = '0.00';
            document.querySelector(DOMStrings.showExpense).textContent = '0.00';
            document.querySelector(DOMStrings.showPorcentagem).textContent = '---';
        },

        //mostrar as porcentagens unicas ao usuario
        mostraPorUnica: function(porcentagens){
            var campos = document.querySelectorAll(DOMStrings.itemPorcentage); //return a nodelist
            
            nodeForeach(campos, function(current, index){
                if(porcentagens[index] > 0){
                current.textContent = porcentagens[index] + ' %';
                }else{
                    current.textContent = '---';
                };
            });
        },

        // muda a cor dos inputs da interface do usuario de acordo 'exp' ou 'inc'
        changeType: function(){
            campos = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue);
            
                nodeForeach(campos, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.addButton).classList.toggle('red');
        },
        
        // Limpar campos inputs do usuario
        limpaCampos: function(){
            var campos, campoArray;
            campos = document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue)// quando usa o metodo queryALL retorna um lista
            campoArray = Array.prototype.slice.call(campos);
            
            campoArray.forEach(function(cur, index, array){
                cur.value = "";
            });

            campoArray[0].focus();
        },
    };
}());

//************************************** GLOBAL APP CONTROLER *************************************************
var controller = (function(){
    var addEventlis = function(){                 
        var DOM = UIController.getDOMStrings();
        document.querySelector(DOM.addButton).addEventListener('click', controlAddItem);
        document.addEventListener('keypress', function(event){ 
            
            if(event.keyCode === 13 || event.which === 13){        //which is for older browsers
            controlAddItem();
            };

        });

        document.querySelector(DOM.deleteDelegation).addEventListener('click', deleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UIController.changeType);
    };

    var atualizarBudget = function(){
        total = budgetController.calculaTotal();
        UIController.mostraorcamento();
    };
   
    var updatePorcentages = function(){
        budgetController.calculandoPorcentagem();
        porcetagensUnicas = budgetController.todasPorcentagens();
        UIController.mostraPorUnica(porcetagensUnicas);
    };

    var controlAddItem = function(){
        var input = UIController.getInput();
        console.log(input);
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        var novoItem;
        novoItem = budgetController.addItem(input.type, input.description, input.value);
        mostrarItem = UIController.additemLista(novoItem, input.type);
        UIController.limpaCampos();
        };

        atualizarBudget();
        updatePorcentages();
    };

    var deleteItem = function(event){
        var IDitemToDelete, splitIDtoDelete, typeDelete, IDDelete;
        IDitemToDelete = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (IDitemToDelete){
        splitIDtoDelete = IDitemToDelete.split('-');
        typeDelete = splitIDtoDelete[0];
        IDDelete = parseInt(splitIDtoDelete[1]);
        budgetController.delItem(typeDelete, IDDelete);
        UIController.deleteItemList(IDitemToDelete);
        atualizarBudget();
        updatePorcentages();
        };
    };

    return {
        init: function(){
            UIController.setZero();
            addEventlis();
            UIController.mostraData();
        },
    };



}(budgetController, UIController));
controller.init();

/*
*******DOCUMENTATION********

=> GLOBAL APP CONTROLER

- addEventlis => seleciona os eventos que irao inicializar o programa - :
    - Função de botao de input =>  adiciona item na lista no UI controller - controlAddItem();
    - Função de botão de delete => deleta item na lista no UI controller - deleteItem();
    - Função para mudar a classe CSS nos campos de input => Muda a cor dos inputs - UIController.changeType();

- controlAddItem() => Adiciona a lista um novo item no UI - :
    - To-do list:
        1 - Pega os valores de input da UI:
            - UIController.getInput() - pega os valores de input da UI;
        2 - Atualiza os valores do Budget Controller:
            - budgetController.addItem() - chama a funcao para criar novo item;
        3 - Mostra o novo item para a UI:
            - UIController.additemLista() - chama a funcao para mostrar novo item na UI;
        4 - Deleta os campos input após pressionar o evento:
            - UIController.limpaCampos() - chama a funcao para limpar os valores input;
        5 - Atualiza o orçamento:
            - atualizarBudget() - chama a funcao para atualizar os valores do orçamento;
        6 - Atualiza as porcentagens:
            - updatePorcentages() - atualiza as porcentagens dos items.

- deleteItem() => Deleta um item do UI:
    - To-do list:
        1 - Seleciona o elemento HTML para deletar;
        2 - Deleta o item da estrutura de dados:
            - budgetController.delItem() - chama a funcao para deletar o item da estrutura de dados;
        3 - Deleta o item da UI:
            - UIController.deleteItemList() - chama a funcao pra deletar o item da lista do UI;
        4 - Atualiza o orçamento:
            - atualizarBudget() - chama a funcao para atualizar os valores do orçamento;
        5 - Atualiza as porcentagens:
            - updatePorcentages() - atualiza as porcentagens dos items.

- atualizarBudget() => função que chama outras funções para atualização do orcamento:
    - To-do list:
        1 - Calcula o orcamento:
            - budgetController.calculaTotal() - chama a funcao que calcula o orcamento;
        2 - Mostra o orcamento no UI:
            - UIController.mostraorcamento() - chama a funcao que mostra o orcamento no UI;

- updatePorcentages() => funcao que atualiza as porcentagens:
    - To-do list:
        1 - Calcula as porcentagens:
            - budgetController.calculandoPorcentagem() - chama a funcao que calcula as porcentagens;
        2 - Colocando as porcentagens num array:
            - budgetController.todasPorcentagens() - coloca as porcentagens de cada item num array;
        3 - Mostra as porcentagens pro UI:
            - UIController.mostraPorUnica() - chama a funcao que atualiza e mostra as porcentagens unicas;

- return => funçoes que retornam pro objeto global:
    init: function(){ // função que inicializa o aplivativo (chamada do objeto global);
            UIController.setZero(); // zera os dados assim que o aplicativo é inicializado;
            addEventlis(); // funcao que inicia os event listeners quando o aplicativo é inicializado;
            UIController.mostraData() // funcao que atualiza data quando o aplicativo é inicializado;

    - controller.init();(global object) - chama funcao init para inicializar o aplicativo.
*/