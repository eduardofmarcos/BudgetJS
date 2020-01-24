# BudgetJS

Budget application with JavaScript

Simple budget application

in collaboration with Jonas Schmedtmann

some instructions below:

### Documentation

#### GLOBAL APP CONTROLER
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
    
    #### Screenshot
