function criaDOCX(fullText,nome){
    fetch('cabecalho.png')
    .then(res => res.arrayBuffer())
    .then(buffer => {
        // Criar o documento DOCX com cabeçalho
        const doc = new docx.Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1000, // Ajuste conforme necessário
                        },
                    },
                },
                headers: {
                    default: new docx.Header({
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.ImageRun({
                                        data: buffer,
                                        transformation: {
                                            width: 600,
                                            height: 75,
                                        },
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    new docx.Paragraph({
                        children: [new docx.TextRun(fullText)],
                    }),
                ],
            }],
        });

        // Gerar e baixar o arquivo DOCX
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, nome+".docx");
        });
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("cLatitute").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function dataCerta() {
    var currentDate= new Date();
    var day = ("0" + currentDate.getDate()).slice(-2);
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var today = currentDate.getFullYear()+"-"+(month)+"-"+(day) ;

    var hour = ("0" + currentDate.getHours()).slice(-2);
    var minute = ("0" + currentDate.getMinutes()).slice(-2);

    pacoteData = [day, month, currentDate.getFullYear(), today, hour, minute];
    return pacoteData;

}

function transfereData(prOndeData,prOndeHora) {
    var data = dataCerta();
    document.getElementById(prOndeData).value = data[3];
    document.getElementById(prOndeHora).value = data[4] + ":" + data[5];
}

function showPosition(position) {
    document.getElementById("cLatitute").innerHTML = "Latitude: " + position.coords.latitude;
    document.getElementById("cLongitude").innerHTML = "; Longitude: " + position.coords.longitude;
}

function handlePaste(e) {
    var clipboardData, pastedData;
  
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
  
    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
  
    // Do whatever with pasteddata
    document.getElementById('cCampodeColagem').textContent = pastedData;

    fProcessaEmail();
}

function processaPDF(fullText){
    console.log(fullText);
}

function fProcessaEmail(){

    var conteudoEmail = document.getElementById('cCampodeColagem').textContent;
    document.getElementById('cCampodeColagem').textContent = "";
    document.getElementById('cCampodeColagem').placeholder= "OK";

    console.log(conteudoEmail);

    var posProtSAEP = conteudoEmail.search   ("Nº ");

    if(posProtSAEP != -1){
       document.getElementById('cProtSAEP').value = "L"+conteudoEmail.substring(posProtSAEP + 3, posProtSAEP + 13);
       
    }
   
    var posNumLaudo = conteudoEmail.search   ("Laudo:");
    if(posNumLaudo != -1){
        document.getElementById('cREP').value = conteudoEmail.substring(posNumLaudo + 7, posNumLaudo + 18);
    }
    
    var posTipoOrigem = conteudoEmail.search("Tipo de Origem:");
    var geralBO = "";
    if(posTipoOrigem != -1){
        geralBO = conteudoEmail.substring(posTipoOrigem + 16, posTipoOrigem + 18);
    }
    
    var posOrigem = conteudoEmail.search("Número do BO:");
    if(posOrigem != -1){
        document.getElementById('cBO').value = geralBO+":"+conteudoEmail.substring(posOrigem + 14, posOrigem + 20)+"/"+new Date().getFullYear();
    }

    var posDPRequisitante = conteudoEmail.search("DP Requisitante:");
    if(posDPRequisitante != -1){
        // Busca por "|" para separar a delegacia da cidade
        let dpInfo = conteudoEmail.substring(posDPRequisitante + 17).split("|");
        if (dpInfo.length > 1) {
            document.getElementById('cDelegacia').value = dpInfo[0].trim();
        } else {
            document.getElementById('cDelegacia').value = "Delegacia não informada.";
        }
    }

    var posEndereco = conteudoEmail.search("Endereço:");
    var posAutoridade = conteudoEmail.search("Nome do Requisitante:");
    if(posAutoridade != -1){
        
        document.getElementById('cAutoridade').value = "Dr(a). " + conteudoEmail.substring(posAutoridade + 22, posEndereco);
    }

    var posDataFatoInfo = conteudoEmail.search("Data/Hora do Fato:");
    if(posEndereco != -1){
        document.getElementById('cRua').value = conteudoEmail.substring(posEndereco + 11, posDataFatoInfo).toUpperCase();
    }

    var posNaturezaExame = conteudoEmail.search("Natureza:");
    var posNaturezaCrime = conteudoEmail.search("Naturezas Criminais da Ocorrência:");
    if(posNaturezaExame != -1){
        document.getElementById('cNaturezaExame').value = conteudoEmail.substring(posNaturezaExame + 10, posNaturezaCrime);
    }

    var posQuesitos = conteudoEmail.search("Quesitos:");
    if(posNaturezaCrime != -1){
        document.getElementById('cNaturezaCrime').value = conteudoEmail.substring(posNaturezaCrime + 34, posQuesitos);
    }
 
    if(posQuesitos != -1){
        let dpInfo = conteudoEmail.substring(posQuesitos + 11).split("Unidade(s)/Time(s) Designado(s):");
        if (dpInfo.length > 1) {
            document.getElementById('taQuesitos').value = dpInfo[0].trim();
        } else {
            document.getElementById('taQuesitos').value = "Não foram ofertados quesitos."
        }
    }

    var posHistoricoInfo = conteudoEmail.search("Histórico:");
    if(posHistoricoInfo != -1){
        let dpInfo = conteudoEmail.substring(posHistoricoInfo + 11).split("Pessoas Envolvidas:");
        if (dpInfo.length > 1) {
            document.getElementById('taHistorico').value = dpInfo[0].trim();
        } else {
            document.getElementById('taHistorico').value = "Histórico não informado."
        }
    }


    if(posDataFatoInfo != -1){
        let fimString = conteudoEmail.indexOf('\r\n', posDataFatoInfo + 18);
        if (fimString === -1) {
            fimString = conteudoEmail.length;
        }
        
        let datanInfo = conteudoEmail.substring(posDataFatoInfo + 19, fimString);

        if (datanInfo != "Não Informado") {
            let dataFato = datanInfo.substring(0,10);
            let horaFato = datanInfo.substring(11,16);

            var montaData = dataFato.substring(6,10)+"-"+dataFato.substring(3,5)+"-"+dataFato.substring(0,2);

            document.getElementById('cDataFatos').value = montaData;
            document.getElementById('cHoraFatos').value = horaFato;
        }
    }

    var posDataAcionamento = conteudoEmail.search("Protocolo Aberto");
    if(posDataAcionamento != -1){
        
        var dataAcionamento = conteudoEmail.substring(posDataAcionamento - 22, posDataAcionamento-6);
        
        let dataFato = dataAcionamento.substring(0,10);
        let horaFato = dataAcionamento.substring(11,16);
        
        var montaData = dataFato.substring(6,10)+"-"+dataFato.substring(3,5)+"-"+dataFato.substring(0,2);

        document.getElementById('cDataAciona').value = montaData;
        document.getElementById('cHoraAciona').value = horaFato;
    }

    var posDataExame = conteudoEmail.search("Protocolo em Atendimento");
    if(posDataExame != -1){
        var dataExame = conteudoEmail.substring(posDataExame - 22, posDataExame-6);

        let dataFato = dataExame.substring(0,10);
        let horaFato = dataExame.substring(11,16);
        
        var montaData = dataFato.substring(6,10)+"-"+dataFato.substring(3,5)+"-"+dataFato.substring(0,2);

        document.getElementById('cDataExame').value = montaData;
        document.getElementById('cHoraExame').value = horaFato;
    }

    var posCidadeOrigem = conteudoEmail.search("Cidade de Origem:");

    if(posCidadeOrigem != -1){
        // Busca por "|" para separar a cidade
        let dpInfo = conteudoEmail.substring(posCidadeOrigem + 17).split("|");
        if (dpInfo.length > 1) {
            document.getElementById('cCidade').value = dpInfo[0].trim();
        } else {
            document.getElementById('cCidade').value = "Cidade não informada.";
        }
    }

    //adicionar campo de texto livre para complementar as preliminares


    //trecho abaixo - apenas teste, usar e/ou deletar quando pronto
    var posOrgaoCircunscricao = conteudoEmail.search("Órgão Circunscrição:");
    var posDataFatoInfo = conteudoEmail.search("Data/Hora do Fato:");
    var posPessoasEnvolvidas = conteudoEmail.search("Pessoas Envolvidas:");
    var posVeiculoInfo = conteudoEmail.search("Veículos Relacionados:");
    var posPreservaInfo = conteudoEmail.search("Estado de preservação:");
    
    var fullText = "Protocolo:"+posProtSAEP+" Laudo:"+posNumLaudo+" Tipo de Origem:"+posTipoOrigem+" Cidade:"+posCidadeOrigem+" Origem:"+posOrigem+" Órgão Circunscrição: "+posOrgaoCircunscricao+" DP Requisitante:"+posDPRequisitante+" Autoridade:"+posAutoridade+" Endereço:"+posEndereco+" Natureza:"+posNaturezaExame+" Natureza Criminal:"+posNaturezaCrime+" Data/Hora do Fato:"+posDataFatoInfo+" Data/Hora do Acionamento:"+posDataAcionamento+" Data/Hora do Exame:"+posDataExame+" Estado da Preservação:"+posPreservaInfo+" Histórico:"+posHistoricoInfo+" Quesitos:"+posQuesitos+" Pessoas Envolvidas:"+posPessoasEnvolvidas+" Veículos Relacionados:"+posVeiculoInfo; 
    
    document.getElementById('output').textContent = fullText;
    return fullText;


}

function convertePDF(){
    
    const pdfInput = document.getElementById('pdfInput');
    const pdfFile = pdfInput.files[0];
        
    if (pdfFile) {
        const pdfReader = new FileReader();
        pdfReader.onload = function(pdfEvent) {
            const typedarray = new Uint8Array(pdfEvent.target.result);

            pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                let fullText = '';
                const numPages = pdf.numPages;
                let promises = [];

                for (let i = 1; i <= numPages; i++) {
                    promises.push(pdf.getPage(i).then(function(page) {
                        return page.getTextContent();
                    }).then(function(textContent) {
                            return textContent.items.map(item => item.str).join(' ');
                        }));
                }

                Promise.all(promises).then(function(pageTexts) {
                    fullText = pageTexts.join('\n\n');
                    processaPDF(fullText);

                });
            });
        };
        pdfReader.readAsArrayBuffer(pdfFile);
    } else {
        alert('Por favor, selecione um arquivo PDF.');
    }
}