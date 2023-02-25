
var estadoSelect = document.getElementById("estado")
var cidadeInput = document.getElementById("cidade");
var bairroInput = document.getElementById("bairro");
var ruaInput = document.getElementById("rua");
var numeroInput = document.getElementById("numero");
var loader = document.getElementById("loader")
var span = document.getElementById("resposta")
var cookies = document.getElementsByClassName("cookie-popup")

var botaoLimpar = document.getElementById("limpar");
var formEnviar = document.getElementById("form-enviar");
var botaoDoBiscoito = document.getElementById("cookie-button");

botaoDoBiscoito.addEventListener("click", (event) => {
    event.preventDefault();
    cookies[0].style.display = "none";
})


formEnviar.addEventListener("submit", (event) => {
    event.preventDefault();
    
    var estado = estadoSelect.value;
    var cidade = cidadeInput.value;
    var bairro = bairroInput.value;
    var rua = ruaInput.value;
    var numero = numeroInput.value;

    function validateForm() {
        var response = grecaptcha.getResponse();
        if(response.length == 0) {
          // O usuário não preencheu o reCAPTCHA v2
          alert("Por favor, preencha o reCAPTCHA v2.");
          return false;
        } else {
          // O usuário preencheu o reCAPTCHA v2
          return true;
        }
    }

    if(validateForm() === false){
        return
    }

    loader.style.display = "block"

    url = "https://viacep.com.br/ws/"+estado+"/";
    
    if(cidade){
        url += cidade + "/";
        if(rua){
            url += rua + "/json";
        }
    }

    var resjson, result
    
    fetch(`${url}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }) // Append the page number to the base URL
    .then(response => response.json() )
    .then((data) => {
        console.log(data)
        function removerAcentos(texto) {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
        
        resjson = data;

        result = resjson.filter( obj => removerAcentos(obj.bairro).includes(removerAcentos(bairro)))
        
        if(result.length < 1){
            loader.style.display = "none"
            span.innerHTML = "Verifique seu endereço! Infelizmente não encontramos seu CEP"
            return 
        }

        for(const i of result){
            
            const obj = i.complemento.trim()

            const de = obj.startsWith("de")
        

            if(de){
                const defim = obj.endsWith("ao fim")
                if(defim){
                    //se for de ----/---- ao fim
                    //exemplo de 2436/2437 ao fim
                    //1949
                    const num = obj.split("/")[0].split(" ")[1]
                    if(num > numero){}//fora da rua
                    else{
                        span.innerHTML = "Seu CEP é: " + i.cep
                        break;
                    }//dentro da rua
                    
                    
                }else{
                    //se for de ----/---- a ----/----
                    const numMenor = obj.split("/")[0].split(" ")[1]
                    const numMaior = obj.split("/")[2]

                    if( (numero < numMenor) || (numero > numMaior) ){}//fora da rua
                    else{
                        //dentro da rua
                        span.innerHTML = "Seu CEP é: " + i.cep
                        break;
                    }
                }
            }else{
                //se for até ----/----
                const num = obj.split("/")[1]
                if(numero > num){}//fora da rua
                else{
                    //dentro da rua
                    span.innerHTML = "Seu CEP é: " + i.cep
                    break;
                }
            }
            

        }
        limparCampos()
        loader.style.display = "none"
    })
    .catch((error) => {
        console.log(error)
        span.innerHTML = "Verifique seu endereço! Infelizmente não encontramos seu CEP"
    })
    
})

botaoLimpar.addEventListener("click", function () {
    limparCampos()
});

function limparCampos () {
    estadoSelect.value = ""
    cidadeInput.value = "";
    bairroInput.value = "";
    ruaInput.value = "";
    numeroInput.value = "";    
    span.innerHTML = "Você ainda não buscou seu CEP!"
    grecaptcha.reset();
}

function limparCamposConsulta () {
    estadoSelect.value = ""
    cidadeInput.value = "";
    bairroInput.value = "";
    ruaInput.value = "";
    numeroInput.value = "";    
    grecaptcha.reset();
}