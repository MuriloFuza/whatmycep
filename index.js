
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
var botaoDoBiscoito = document.getElementById("cookie-popup__button");

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

    
    
    url = "http://cep.la/"+estado+"/";
    
    if(cidade){
        url += cidade.replace(" ","-")+"/";
        if(bairro){
            url += bairro.replace(" ","-")+"/";
        }
    }

    console.log(url)
    var resjson, result

    function paginated_fetch(
        url,page = 1,
        previousResponse = []
      ) {

        return fetch(`${url}${page}`, {
            headers: {
                "Accept": "application/json"
            },
            referrer: "unsafe_url" 
        }) // Append the page number to the base URL
          .then(response => response.json())
          .then(newResponse => {
            const response = [...previousResponse, ...newResponse]; // Combine the two arrays
      
            if (newResponse.length !== 0) {
              page++;
      
              return paginated_fetch(url, page, response);
            }
      
            return response;
          });
      }

    loader.style.display = "block"
    paginated_fetch(url).then((data) => {
        loader.style.display = "none"
        console.log(data)
        resjson = data;
        result = resjson.filter( obj => obj.nome.split("-")[0].trim().includes(rua))

        for(const i of result){
            
            const obj = i.nome.split("-")[1].trim()

            const de = obj.startsWith("de")
           

            if(de){
                const defim = obj.endsWith("ao fim")
                if(defim){
                    console.log("entrou no defim")
                    //se for de ----/---- ao fim
                    //exemplo de 2436/2437 ao fim
                    //1949
                    const num = obj.split("/")[0].split(" ")[1]
                    if(num < numero){}//fora da rua
                    else{
                        span.innerHTML = "Seu CEP é: " + i.cep
                        console.log(numero,"Dentro da rua",i)
                        break;
                    }//dentro da rua
                    
                    
                }else{
                    console.log("Não entrou no defim")
                    //se for de ----/---- a ----/----
                    const numMenor = obj.split("/")[0].split(" ")[1]
                    const numMaior = obj.split("/")[2]

                    if( (numero < numMenor) || (numero > numMaior) ){}//fora da rua
                    else{
                        //dentro da rua
                        span.innerHTML = "Seu CEP é: " + i.cep
                        console.log(numero,"Dentro da rua",i)
                        break;
                    }
                }
            }else{
                console.log("entrou no até")
                //se for até ----/----
                const num = obj.split("/")[1]
                console.log(num,numero)
                if(numero > num){}//fora da rua
                else{
                    //dentro da rua
                    span.innerHTML = "Seu CEP é: " + i.cep
                    console.log(numero,"Dentro da rua",i)
                    break;
                }
            }
            

        }
    })

})

botaoLimpar.addEventListener("click", function () {
    estadoSelect.value = ""
    cidadeInput.value = "";
    bairroInput.value = "";
    ruaInput.value = "";
    numeroInput.value = "";    
});
