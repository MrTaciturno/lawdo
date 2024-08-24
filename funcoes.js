// function criarTabelaDuasColunas() {
//     return new docx.Table({
//         width: {
//             size: 100,
//             type: docx.WidthType.PERCENTAGE,
//            layout: verificar e lembrar do 'docx.'
//         },
//         rows: [
//             new docx.TableRow({
//                 children: [
//                     new docx.TableCell({
//                         width: {
//                             size: '75%',
//                             type: docx.WidthType.CENTIMETERS,
                        
//                         },

//                         children: [new docx.Paragraph("")]
//                     }),
//                     new docx.TableCell({
//                         width: {
//                             size: '25%',
//                             type: docx.WidthType.CENTIMETERS,
// //cade?
//                         },
//                         children: [new docx.Paragraph("")]
//                     }),
//                 ],
//             }),
//         ],
//     });
// }


// function criarTabelaDOCX(numLinhas, numColunas) {
//     const rows = [];
    
//     for (let i = 0; i < numLinhas; i++) {
//         const cells = [];
//         for (let j = 0; j < numColunas; j++) {
//             cells.push(new docx.TableCell({
//                 children: [new docx.Paragraph({
//                     children: [new docx.TextRun({
//                         text: `Célula ${i+1},${j+1}`,
//                         font: 'Arial',
//                         size: 24
//                     })]
//                 })],
//             }));
//         }
//         rows.push(new docx.TableRow({ children: cells }));
//     }

//     return new docx.Table({
//         rows: rows
//     });
// }

function criaTesteDOCX(textoLaudo, formatacao, nome){
    fetch('cabecalho.png')
    .then(res => res.arrayBuffer())
    .then(buffer => {
        // Criar o documento DOCX com cabeçalho
        var numTotalPage = 1;
        var arrParagraf = [];
        var textoFinal = new docx.Paragraph({
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing:{
                line: 250,
                before: 20 * 72 * 0.01,
                after: 20 * 72 * 0.01
            },
            children: [
                new docx.TextRun({
                    text:"\rEste laudo foi elaborado em "+ docx.PageNumber.TOTAL_PAGES +" páginas com cópia digital arquivada no Sistema Gestor de Documentos e Laudos da Superintendência da Polícia Técnico-Científica do Estado de São Paulo (Portaria SPTC 145/2012).",
                    font: 'Arial',
                    size: 24,
                    bold: false,
                }),
            ],
        });
        for (var i=0; i< textoLaudo.length; i++){
           //default '0':
            var alinhamentoDX = docx.AlignmentType.JUSTIFIED;
            var linhaDX = 250;
            var antesDX = 20 * 72 * 0.01;
            var depoisDX = 20 * 72 * 0.01;
            var tamanhoDX = 24;
            var negritoDX = false;

            switch(formatacao[i]){
                case 1: //titulo
                    alinhamentoDX = docx.AlignmentType.LEFT;
                    linhaDX = 276;
                    antesDX = 20 * 72 * 0.1;
                    depoisDX = 20 * 72 * 0.05;
                    tamanhoDX = 26;
                    negritoDX = true;
                break;
                case 2: //assinatura
                    alinhamentoDX = docx.AlignmentType.CENTER;
                    linhaDX = 250;
                    antesDX = 20 * 72 * 0.01;
                    depoisDX = 20 * 72 * 0.01;
                    tamanhoDX = 24;
                    negritoDX = false;
                break;
            }
            
            var propositoGeral = new docx.Paragraph({
                alignment: alinhamentoDX,
                spacing:{
                    line: linhaDX,
                    before: antesDX,
                    after: depoisDX
                },
                children: [
                    new docx.TextRun({
                        text: textoLaudo[i],
                        font:'Arial',
                        size: tamanhoDX,
                        bold: negritoDX,
                    }),
                ],
            });


            arrParagraf.push(propositoGeral);
            
        }

        arrParagraf.push(textoFinal);

        const doc = new docx.Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 2000, // Ajuste conforme necessário
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
                footers: {
                    default: new docx.Footer({
                        alignment: docx.AlignmentType.CENTER,
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        children: ["Page Number ", docx.PageNumber.CURRENT],
                                    }),
                                    new docx.TextRun({
                                        children: [" to ", docx.PageNumber.TOTAL_PAGES],
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: 
                    arrParagraf
            }],
        });
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, nome+".docx");
        });
    });
}



function montaLaudo(e){
    var mesExtenso = ["janeiro", "fevereiro", "março", "abril", "maio","junho","julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    
    let data =	
	'\r\n\tEm '+ document.getElementById("cDataAciona").value.slice(-2) + " de "+mesExtenso[document.getElementById("cDataAciona").value.substring(5,7)-1]+" de "+document.getElementById("cDataAciona").value.slice(0,4) +' no Núcleo de Perícias Criminalística de Americana, do Instituto de Criminalística, da Superintendência da Polícia Técnico-Científica, da Secretaria de Segurança Pública do Estado de São Paulo, em conformidade com o disposto no Decreto-Lei n.º 3.689/41, o Diretor deste instituto designou o Perito Criminal '+document.getElementById('cPerito').value+' para proceder a este exame pericial, em atendimento à requisição da autoridade de polícia judiciária da '+ document.getElementById('cDelegacia').value + ', ' +document.getElementById('cAutoridade').value+ '.';
    //incluir o nome do diretor?


    var aL = [""]; // array de laudo
	var nF = [0]; // array de formatacao
    let iT = 0; // indice do titulo

    aL[0] = data; iT++; aL.push(iT + " - Disposições Preliminares"); nF[aL.length-1]=1; //título de disposições preliminares

    data = (document.getElementById('cProtSAEP').value ? "Protocolo: "+document.getElementById('cProtSAEP').value+"." : ""); if(data != ""){ aL.push(data); nF[aL.length-1]=1;}

    data = (document.getElementById('cREP').value ? "Laudo Número: "+document.getElementById('cREP').value+"." : ""); if(data != ""){ aL.push(data); nF[aL.length-1]=1;}

    if (document.getElementById('cBO').value){
        data = "Boletim de Ocorrência: "+document.getElementById('cBO').value.toUpperCase()+".";
        aL.push(data); nF[aL.length-1]=1;
    }else{
        data = "\tBoletim de Ocorrência não informado, em descumprimento à Resolução SSP-26 de 17/04/2019.";
        aL.push(data); nF[aL.length-1]=0;
    }

    data =
    '\tEquipe pericial acionada para local de '+ (!document.getElementById('cNaturezaExame').value ? "natureza não informada, " : document.getElementById('cNaturezaExame').value).toUpperCase() + ', endereço '+
    (!document.getElementById('cRua').value ? "não informado" : document.getElementById('cRua').value)+ ", " + document.getElementById('cCidade').value + '/SP. \r\n'; aL.push(data); nF[aL.length-1]=0;

    //inserir Geolocalizacao

    data =
    '\t' + (!document.getElementById('cPreservacao').checked ? "Quando dos exames o local não se encontrava preservado por equipe oficial." : 'Quando dos exames o local estava preservado por equipe oficial, a saber: "'+document.getElementById('taPreservacao').value+'"') + '. \r\n'; aL.push(data); nF[aL.length-1]=0;

    data =
    '\tExames iniciados em '+ document.getElementById("cDataExame").value.slice(-2) + " de "+mesExtenso[document.getElementById("cDataExame").value.substring(5,7)-1]+" de "+document.getElementById("cDataExame").value.slice(0,4) +' às '+document.getElementById('cHoraExame').value+' horas. \r\n'; aL.push(data); nF[aL.length-1]=0;

    data = 
    '\tForam ofertados os seguintes quesitos quando da solicitação do exame: "'+document.getElementById('taQuesitos').value+'". \r\n'; aL.push(data); nF[aL.length-1]=0;

    data =
    '\tQuando do acionamento foi informado o seguinte histórico: "'+document.getElementById('taHistorico').value+'". \r\n'; aL.push(data); nF[aL.length-1]=0;
    

    iT++;aL.push(iT + " - Do Local");  nF[aL.length-1]=1;//título do local

    data=
    '\t' + (!document.getElementById('cDoLocal').checked ? "Detalhes do local não informados. \r\n" : document.getElementById('taDoLocal').value) + '\r\n'; aL.push(data); nF[aL.length-1]=0;

    iT++; aL.push(iT + " - Dos Exames"); nF[aL.length-1]=1;//título dos exames
    
    var iTt = 0;
    
    if (document.getElementById('cDoMaquinas').checked){

        iTt++;aL.push('\t'+iT+'.'+iTt + " - Das Máquinas");  nF[aL.length-1]=1; // título das máquinas

        let maquinasTexto = document.getElementById('taDoMaquinas').value.split('\n');
        console.log(maquinasTexto);
        for (let i = 0; i < maquinasTexto.length; i++) {
            if (maquinasTexto[i].trim() !== '') {
                console.log(maquinasTexto[i]);
                
                if(maquinasTexto[i].includes("Considerações Finais")){
                    iT++; aL.push(iT + " - Considerações Finais"); nF[aL.length-1]=1;//título considerações finais
                }
                else{
                    data = '\t' + maquinasTexto[i] + '\r\n';
                    aL.push(data);
                    nF[aL.length-1] = 0;
                }
            }
        }

    }

    iT++; aL.push(iT + " - Do Levantamento Fotográfico"); nF[aL.length-1]=1;//título do levantamento fotográfico

    if (document.getElementById('cDoMaquinas').checked){
        aL.push("Fachada do estabelecimento."); nF[aL.length-1] = 2;
        aL.push("Acesso às máquinas."); nF[aL.length-1] = 2;
        aL.push("Máquinas quando da chegada da equipe pericial."); nF[aL.length-1] = 2;
        aL.push("Máquinas exibindo jogo eletrônico."); nF[aL.length-1] = 2;
        aL.push("Conteúdo extraído das máquinas."); nF[aL.length-1] = 2;
        aL.push("Noteiros inutilizados."); nF[aL.length-1] = 2;
    }


    //legendas?



    //  finalização do documento
    var currentDate= new Date();
    var day = ("0" + currentDate.getDate()).slice(-2);
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var today = (day)+"-"+(month)+"-"+currentDate.getFullYear();
    var hour = ("0" + currentDate.getHours()).slice(-2);
    var minute = ("0" + currentDate.getMinutes()).slice(-2);
    var hora = hour + "h" + minute+"m";
    var sFileName = today + "_" + hora;

    aL.push("Era o que havia a relatar."); nF[aL.length-1] = 1;
    
    //subir para a função de criação do DOCX acima
    aL.push("\rEste laudo foi elaborado em "+ docx.PageNumber.TOTAL_PAGES +" páginas com cópia digital arquivada no Sistema Gestor de Documentos e Laudos da Superintendência da Polícia Técnico-Científica do Estado de São Paulo (Portaria SPTC 145/2012)."); nF[aL.length-1] = 1;
    aL.push("Americana, "+day+" de "+ mesExtenso[currentDate.getMonth()]+" de "+ currentDate.getFullYear()); nF[aL.length-1] = 2;
    aL.push("-assinado digitalmente-"); nF[aL.length-1] = 2;
    aL.push("Leonardo Reis da Silva"); nF[aL.length-1] = 2;
    aL.push("Perito Criminal"); nF[aL.length-1] = 2;  

    
    //Assinatura.

//  aL.push("testeTabela"); nF[aL.length-1]=3;



    if (document.getElementById('cProtSAEP').value) sFileName = document.getElementById('cProtSAEP').value;
    if (document.getElementById('cREP').value) {sFileName = document.getElementById('cREP').value+'$'+document.getElementById('cNaturezaExame').value;}
    criaTesteDOCX(aL,nF,sFileName);
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

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         document.getElementById("cLatitute").innerHTML = "Geolocation is not supported by this browser.";
//     }
// }

// function dataCerta() {
//     var currentDate= new Date();
//     var day = ("0" + currentDate.getDate()).slice(-2);
//     var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
//     var today = currentDate.getFullYear()+"-"+(month)+"-"+(day) ;

//     var hour = ("0" + currentDate.getHours()).slice(-2);
//     var minute = ("0" + currentDate.getMinutes()).slice(-2);

//     pacoteData = [day, month, currentDate.getFullYear(), today, hour, minute];
//     return pacoteData;

// }

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


function abrirMenuOpcoes(onde) {
    var menu = document.getElementById(onde);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}


function preencherTextarea(onde,ondeTA, texto) {
    document.getElementById(ondeTA).value = document.getElementById(ondeTA).value+texto+"\r\n";
    document.getElementById(onde).style.display = 'none';
}

function criarBotao(onde,ondeTA, texto, acao) {
    var botao = document.createElement('button');
    botao.textContent = texto;
    var novaAcao = acao;

    botao.onclick = function() {
        if (ondeTA == 'taDoMaquinas') {

                novaAcao = acao.replace(/XXXXX/g, document.getElementById('contadorMaquinas').textContent);
                if (document.getElementById('contadorMaquinas').textContent == 1) {
                    
                    novaAcao = novaAcao.replace(/as\b/g, "a");
                    novaAcao = novaAcao.replace("Senha", "Senhas");
                    novaAcao = novaAcao.replace("As ", "A ");
                    novaAcao = novaAcao.replace(" continham ", " continha ");
                    novaAcao = novaAcao.replace(" noteiros ", " noteiros ");
                    novaAcao = novaAcao.replace(" cédula ", " cédulas ");
                    novaAcao = novaAcao.replace(/ foram /g, " foi ");
                    novaAcao = novaAcao.replace(" eram ", " era ");
                    novaAcao = novaAcao.replace(/ os /ig, " o ");
                    novaAcao = novaAcao.replace(/ noteiros /g, " noteiro ");
                    novaAcao = novaAcao.replace(" encontravam-se ", " encontrava-se ");
                    novaAcao = novaAcao.replace(" fechados ", " fechado ");
                    novaAcao = novaAcao.replace(" exibiram ", " exibiu ");
                    novaAcao = novaAcao.replace(" removidos ", " removido ");
                    novaAcao = novaAcao.replace(" seus ", " seu ");
                    novaAcao = novaAcao.replace(" gabinetes ", " gabinete ");
                    novaAcao = novaAcao.replace(" inutilizados ", " inutilizado ");
                    novaAcao = novaAcao.replace(" dispositivos ", " dispositivo ");
                    novaAcao = novaAcao.replace(" cartões ", " cartão ");
                    novaAcao = novaAcao.replace(" discos ", " disco ");
                    novaAcao = novaAcao.replace(" rígidos", " rígido");
                    novaAcao = novaAcao.replace(" pendrives", " pendrive");
                    novaAcao = novaAcao.replace(" placas ", " placa ");
                    novaAcao = novaAcao.replace(" acondicionados ", " acondicionado ");
                    novaAcao = novaAcao.replace(" possuíam ", " possuía ");
                    novaAcao = novaAcao.replace(" possuem ", " possui ");
                    novaAcao = novaAcao.replace(" outra ", " outras ");
                    novaAcao = novaAcao.replace(" poderiam ", " poderia ");
                    
                }

        }
        preencherTextarea(onde,ondeTA, novaAcao);
    };
    return botao;
}

var opcoesDeLocal = [
    { texto: 'Via pública', acao: 'Via pública.' },
    { texto: 'Bar', acao: 'Tratava-se de edificação do tipo estabelecimento comercial, unido de vizinhos em ambos os lados, erguido recuado e ao nível geral da via pública, vedado do passeio público por muro de alvenaria/gradeamento metálico. Internamente era composto por um salão principal, contendo balcão mesas, cadeiras e bancos, bem como geladeiras e prateleiras.'},
    { texto: 'Casa', acao: 'Residência.' },
    { texto: 'C1', acao: 'Residência.' },
    { texto: 'C2', acao: 'Residência.' },
    { texto: 'C3', acao: 'Residência.' }

];
var opcoesDeMaquinas = [
    { texto: 'Máquinas Antigas', acao: 'Máquinas Antigas.' },
    { texto: 'Totem Brasil 1', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totem Brasil I montadas em gabinetes em madeira, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "Proibido o acesso a sites que contenham: 1º Conteúdo pornográfico ou relacionado com pedofilia; 2º Que violem direitos de terceiros ou violem a lei vigente; 3º Jogos de azar que tenham ou envolvam prêmios em dinheiro."' },
    { texto: 'Totem Brasil 2', acao: 'Totem Brasil 2.' },
    { texto: 'World Link', acao: 'World Link.' },
    { texto: 'Kiosk Net', acao: 'Kiosk Net.' },
    { texto: 'Real Web', acao: 'Real Web.' },
    { texto: 'Positivo', acao: 'Quando da chegada desta equipe pericial, os noteiros encontravam-se fechados e as máquinas desligadas. Quando solicitado o funcionamento destas, as máquinas exibiram em suas telas jogo eletrônico. As máquinas foram abertas, encontrando-se a quantia total de R$XXX,00, a qual foi entregue em mãos ao representante da Polícia Civil. Os noteiros foram removidos de seus gabinetes e inutilizados no próprio local. Os dispositivos de armazenamento, a saber, XXXXX cartões de memória, XXXXX discos rígidos, XXXXX pendrives, XXXXX placas contendo memória programável (EPROM) foram removidos e acondicionados em embalagem plástica lacrada sob o número SPTC LACRE.\r\nConsiderações Finais\r\nFoi realizado o exame de funcionamento das referidas máquinas no local, sendo que XXXXX máquinas possuíam jogo eletrônico sorteador de resultados, na qual, o ganho ou perda independe da habilidade física ou mental do agente, ou seja, depende exclusivamente da sorte ("Jogo de Azar").'},
    
    { texto: 'Negativo', acao: 'Durante o exame, esse relator acessou tela que solicitava a inserção de senha para prosseguimento, no entanto, a mesma não foi fornecida pelo responsável e a continuação do exame in loco ficou prejudicada. Não foi possível acessar o histórico de acesso dos navegadores das máquinas.\r\nConsiderações Finais\r\nPor último, cumpre-se consignar que XXXXX máquinas World Link/Totem Brasil possuíam, no momento dos exames periciais, acesso à internet. Dessa forma, não foi possível descartar a hipótese que outrora as máquinas poderiam estar sendo usadas para acessar sites/servidores contendo jogos sorteadores de resultado envolvendo a perda e ganho de dinheiro.\r\nApesar de não ter sido possível constatar o jogo de azar, essas máquinas possuem semelhanças e componentes eletrônicos de mesmas características de outras máquinas que apresentaram esse tipo de jogo em outras ocasiões.\r\nAtendendo a OS-03/2022 - NPC Americana, que revogou a OS-01/2022, os dispositivos de armazenamento, os noteiros e valores porventura existentes nas máquinas deixaram de ser retirados ou apreendidos.' }
    
];

document.addEventListener('DOMContentLoaded', function() {
    opcoesDeLocal.forEach(function(opcao) {
        const menuOpcoesDoLocal = document.getElementById('menuOpcoesDoLocal');
        if (menuOpcoesDoLocal) {
            menuOpcoesDoLocal.appendChild(criarBotao('menuOpcoesDoLocal','taDoLocal',opcao.texto,opcao.acao)); // Or use appendChild as needed
        } else {
            console.error("Element with ID 'menuOpcoesDoLocal' not found.");
        }
    });
    opcoesDeMaquinas.forEach(function(opcao) {
        const menuOpcoesDoMaquinas = document.getElementById('menuOpcoesDoMaquinas');
        if (menuOpcoesDoMaquinas) {
            menuOpcoesDoMaquinas.appendChild(criarBotao('menuOpcoesDoMaquinas','taDoMaquinas',opcao.texto, opcao.acao)); // Or use appendChild as needed
        } else {
            console.error("Element with ID 'menuOpcoesDoMaquinas' not found.");
        }
    });
});
