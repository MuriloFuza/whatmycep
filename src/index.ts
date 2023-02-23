const enderecoInput = document.getElementById("endereco") as HTMLInputElement;
const botaoLimpar = document.querySelector("#limpar");
const enviarButton = document.getElementById("enviar")!;

enviarButton.addEventListener("click", () => {
	const endereco = enderecoInput.value;
	// Adicione aqui a lógica para enviar o endereço para algum lugar
});
