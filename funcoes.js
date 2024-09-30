// incluir tanta coisa


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

// Função para realizar OCR em uma imagem
async function realizarOCR(imagem) {
  try {
    // Carrega a biblioteca Tesseract.js
    //const worker = await Tesseract.createWorker('por');
    const worker = await Tesseract.createWorker({
    
        logger: (m) => {console.log(m);},
        errorHandler: (err) => {
          console.log(err)
          
          return err
        }
    });
    await worker.loadLanguage('por');
    await worker.initialize('por');
    // Realiza o OCR na imagem
    const { data: { text } } = await worker.recognize(imagem);
    
    // Encerra o worker
    await worker.terminate();
    
    // Retorna o texto extraído
    return text;
  } catch (erro) {
    console.error('Erro ao realizar OCR:', erro);
    return 'Erro ao processar a imagem';
  }
}


// Exemplo de uso:
// const imagemElement = document.getElementById('minhaImagem');
// const textoExtraido = await realizarOCR(imagemElement);
// console.log(textoExtraido);


function criaTesteDOCX(textoLaudo, formatacao, nome){
    var currentDate= new Date();
    var day = ("0" + currentDate.getDate()).slice(-2);
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var mesExtenso = ["janeiro", "fevereiro", "março", "abril", "maio","junho","julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    fetch('cabecalho.png')
    .then(res => res.arrayBuffer())
    .then(buffer => {
        var arrParagraf = [];

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
        let nomedoPerito = document.getElementById("cPerito");

        const doc = new docx.Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 2000,
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
                        children: [
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                children: [
                                    new docx.TextRun("Superintendência da Polícia Técnico-Científica. Proibida divulgação ou cópia sem autorização. Página "),
                                    new docx.TextRun({
                                        children: [docx.PageNumber.CURRENT]
                                    }),
                                    new docx.TextRun(" de "),
                                    new docx.TextRun({
                                        children: [docx.PageNumber.TOTAL_PAGES]
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

function formatarString(str) {
    // Remover espaços em branco no início e no fim da string
    str = str.trim();
    
    //Substituir a última vírgula por ponto final, se existir

    
    // Encontrar a posição da penúltima vírgula
    let ultimaVirgula = str.lastIndexOf(',');
    let penultimaVirgula = str.lastIndexOf(',', ultimaVirgula - 1);
    
    // Se houver mais de uma vírgula, substituir a penúltima por " e "
    if (penultimaVirgula !== -1) {
        str = str.slice(0, penultimaVirgula) + ' e' + str.slice(penultimaVirgula + 1);
    }
    
    if (str.endsWith(',')) {
        str = str.slice(0, -1) + '.';
    }

    return str;
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

    if (document.getElementById("cQuesitos").checked){
        data = '\tForam ofertados os seguintes quesitos quando da solicitação do exame: "'+document.getElementById('taQuesitos').value+'". \r\n'; aL.push(data); nF[aL.length-1]=0;
    }
    if (document.getElementById("cHistorico").checked){
        data = '\tQuando do acionamento foi informado o seguinte histórico: "'+document.getElementById('taHistorico').value+'". \r\n'; aL.push(data); nF[aL.length-1]=0;
    }

    iT++;aL.push(iT + " - Do Local");  nF[aL.length-1]=1;//título do local


    

    data=
    '\t' + (!document.getElementById('cDoLocal').checked ? "Detalhes do local não informados. \r\n" : formatarString(document.getElementById('taDoLocal').value)); aL.push(data); nF[aL.length-1]=0;

    iT++; aL.push(iT + " - Dos Exames"); nF[aL.length-1]=1;//título dos exames
    
    var iTt = 0;
    
    if (document.getElementById('cDoMaquinas').checked){

        iTt++;aL.push('\t'+iT+'.'+iTt + " - Das Máquinas");  nF[aL.length-1]=1; // título das máquinas

        let maquinasTexto = document.getElementById('taDoMaquinas').value.split('\n');

        for (let i = 0; i < maquinasTexto.length; i++) {
            if (maquinasTexto[i].trim() !== '') {

                
                if(maquinasTexto[i].includes("Considerações Finais")){
                    iT++; aL.push(iT + " - Considerações Finais"); nF[aL.length-1]=1;//título considerações finais
                }
                else{
                    data = '\t' + maquinasTexto[i];
                    aL.push(data);
                    nF[aL.length-1] = 0;
                }
            }
        }

    }

    if (document.getElementById('cDosVestigios').checked){

        iTt++;aL.push('\t'+iT+'.'+iTt + " - Dos Vestígios");  nF[aL.length-1]=1; // título dos vestigios

        let vestTexto = document.getElementById('taDosVestigios').value.split('\n');

        for (let i = 0; i < vestTexto.length; i++) {
            if (vestTexto[i].trim() !== '') {

                data = '\t' + vestTexto[i];
                aL.push(data);
                nF[aL.length-1] = 0;

            }
        }

    }
    if (document.getElementById('cDosVeiculos').checked){

        iTt++;aL.push('\t'+iT+'.'+iTt + " - Dos Veículos");  nF[aL.length-1]=1; // título dos veiculos

        data = document.getElementById('taDosVeiculos').value;
                aL.push(data);
                nF[aL.length-1] = 0;
    }


    iT++; aL.push(iT + " - Do Levantamento Fotográfico"); nF[aL.length-1]=1;//título do levantamento fotográfico

    if (document.getElementById('cDoMaquinas').checked){
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Fachada do estabelecimento."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Acesso às máquinas."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Máquinas quando da chegada da equipe pericial."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Máquinas exibindo jogo eletrônico."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Conteúdo extraído das máquinas."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Noteiros inutilizados."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;
    }

    if (document.getElementById('cDosVestigios').checked){

        aL.push(""); nF[aL.length-1] = 2;
        aL.push("Fachada do imóvel."); nF[aL.length-1] = 2;
        aL.push(""); nF[aL.length-1] = 2;

        let vestTexto = document.getElementById('taDosVestigios').value.split('\n');

        for (let i = 1; i < vestTexto.length; i++) {
            if (vestTexto[i].trim() !== '') {

                data = vestTexto[i].slice(3);
                
                aL.push(""); nF[aL.length-1] = 2;
                aL.push(data);nF[aL.length-1] = 2;
                aL.push(""); nF[aL.length-1] = 2;

            }
        }

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

    aL.push("\tEra o que havia a relatar."); nF[aL.length-1] = 0;
    aL.push(""); nF[aL.length-1] = 0;

    //subir para a função de criação do DOCX acima
    aL.push("\tEste laudo foi elaborado em XXXXXXX páginas com cópia digital arquivada no Sistema Gestor de Documentos e Laudos da Superintendência da Polícia Técnico-Científica do Estado de São Paulo (Portaria SPTC 145/2012)."); nF[aL.length-1] = 0;
    aL.push(""); nF[aL.length-1] = 2;
    aL.push("Americana, "+day+" de "+ mesExtenso[currentDate.getMonth()]+" de "+ currentDate.getFullYear()); nF[aL.length-1] = 2;
    aL.push("-assinado digitalmente-"); nF[aL.length-1] = 2;
    aL.push(document.getElementById("cPerito").value); nF[aL.length-1] = 2;
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

    //console.log(conteudoEmail);

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
    
    if (texto == "LIMPAR"){
        document.getElementById(ondeTA).value = "";
    }
    else {
        if (onde == "menuOpcoesDoLocal" || onde == "menuOpcoesDosVeiculos"){
            document.getElementById(ondeTA).value = document.getElementById(ondeTA).value+texto;
        }
        else if(onde == "menuOpcoesDosVestigios"){
            var textoAtual = document.getElementById(ondeTA).value;

            var linhas = textoAtual.split('\n');



            if (linhas[parseInt(document.getElementById('contadorVestigios').textContent)]){
                linhas[parseInt(document.getElementById('contadorVestigios').textContent)]=linhas[parseInt(document.getElementById('contadorVestigios').textContent)]+texto;
            }else{
                linhas[parseInt(document.getElementById('contadorVestigios').textContent)]=document.getElementById('contadorVestigios').textContent+") "+texto;
            }


            textoAtual = linhas[0];
            for (var i = 1; i < linhas.length; i++) {
                if (linhas[i]){
                    textoAtual = textoAtual + "\n" + linhas[i];
                } else{
                    textoAtual = textoAtual + "\n"+i+"";
                }

            }
            
            document.getElementById(ondeTA).value = textoAtual;

            
        }
        else{
            document.getElementById(ondeTA).value = document.getElementById(ondeTA).value+texto+"\r\n";
        }
    }


    if (onde != "menuOpcoesDosVeiculos" && onde != "menuOpcoesDoLocal" && onde!= "menuOpcoesDosVestigios"){
        document.getElementById(onde).style.display = 'none';
    }
}

function criarBotao(onde,ondeTA, texto, acao) {
    var botao = document.createElement('button');
    botao.textContent = texto;
    
    var novaAcao = "";
    if (onde == 'menuOpcoesDoLocal' || onde == 'menuOpcoesDosVestigios'){
        novaAcao = acao.slice(0, -7);
        botao.style.backgroundColor = acao.slice(-7);
    }else{
        novaAcao = acao;
    }

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
    opcoesDeVestigios.forEach(function(opcao) {
        const menuOpcoesDosVestigios = document.getElementById('menuOpcoesDosVestigios');
        if (menuOpcoesDosVestigios) {
            menuOpcoesDosVestigios.appendChild(criarBotao('menuOpcoesDosVestigios','taDosVestigios',opcao.texto, opcao.acao)); // Or use appendChild as needed
        } else {
            console.error("Element with ID 'menuOpcoesDosVestigios' not found.");
        }
    });

    opcoesDeVeiculos.forEach(function(opcao) {
        const menuOpcoesDosVeiculos = document.getElementById('menuOpcoesDosVeiculos');
        if (menuOpcoesDosVeiculos) {
            menuOpcoesDosVeiculos.appendChild(criarBotao('menuOpcoesDosVeiculos','taDosVeiculos',opcao.texto, opcao.acao)); // Or use appendChild as needed
        } else {
            console.error("Element with ID 'menuOpcoesDosVeiculos' not found.");
        }
    });
    opcoesDoCadaver.forEach(function(opcao) {
        const menuOpcoesDoCadaveres = document.getElementById('menuOpcoesDoCadaveres');
        if (menuOpcoesDoCadaveres) {
            menuOpcoesDoCadaveres.appendChild(criarBotao('menuOpcoesDoCadaveres','taDoCadaveres',opcao.texto, opcao.acao));
        } else {
            console.error("Elemento com ID 'menuOpcoesDoCadaveres' não encontrado.");
        }
    });
});

var opcoesDoCadaver =[
    //descrição
    // cutis
    // parda
    // branca
    // negra
    // vermelha
    // amarela

    //cabelos tamanho
    //curtos
    //longos
    //médios
    //calvo
    //careca

    //cabelos tipo
    //lisos
    //carapinha
    //ondulados
    //encaracolados

    //cabelos cor
    //pretos
    //castanhos
    //louros
    //grisalhos

    //compleição
    //mediana
    //forte
    //magra
    //obesa
    
    //estatura
    //mediana
    //baixa
    //alta


    //tatuagens
    //desenho
        //palhaço
        //cifrão
        //diamante
        //cartas
        //carpa

    //inscrição
        
    //não identificado no local

    //vestimentas
    //camisa
    //camiseta
    //blusa
    //jaqueta
    //vestido

    //calça
    //bermuda
    //short
    //saia

    //tênis
    //chinelo
    //meias
    //botas
    //sandália

    //cueca
    //calcinha

    //cores
    //preta
    //branca
    //vermelha
    //verde
    //amarela
    //azul
    //cinza
    //diversas

    //danos compatíveis com as lesões
    //não apresentavam danos, sujidades ou vestígios de luta e contenção


    {texto: 'alta', acao: ' alta'},

    {texto: 'tatuagem', acao: ' tatuagem'},
    {texto: 'palhaço', acao: ' de palhaço'},
    {texto: 'cifrão', acao: ' de cifrão'},
    {texto: 'diamante', acao: ' de diamante'},
    {texto: 'cartas', acao: ' de cartas'},
    {texto: 'carpa', acao: ' de carpa'},

    {texto: 'inscrição', acao: ' inscrição'},
    
    {texto: 'não identificado', acao: ' não identificado no local'},

    {texto: 'camisa', acao: ' camisa'},
    {texto: 'camiseta', acao: ' camiseta'},
    {texto: 'blusa', acao: ' blusa'},
    {texto: 'jaqueta', acao: ' jaqueta'},
    {texto: 'vestido', acao: ' vestido'},

    {texto: 'calça', acao: ' calça'},
    {texto: 'bermuda', acao: ' bermuda'},
    {texto: 'short', acao: ' short'},
    {texto: 'saia', acao: ' saia'},

    {texto: 'tênis', acao: ' tênis'},
    {texto: 'chinelo', acao: ' chinelo'},
    {texto: 'meias', acao: ' meias'},
    {texto: 'botas', acao: ' botas'},
    {texto: 'sandália', acao: ' sandália'},

    {texto: 'cueca', acao: ' cueca'},
    {texto: 'calcinha', acao: ' calcinha'},

    {texto: 'preta', acao: ' na cor preta'},
    {texto: 'branca', acao: ' na cor branca'},
    {texto: 'vermelha', acao: ' na cor vermelha'},
    {texto: 'verde', acao: ' na cor verde'},
    {texto: 'amarela', acao: ' na cor amarela'},
    {texto: 'azul', acao: ' na cor azul'},
    {texto: 'cinza', acao: ' na cor cinza'},
    {texto: 'diversas', acao: ' em diversas cores'},

    {texto: 'danos compatíveis', acao: ' apresentando danos compatíveis com as lesões'},
    {texto: 'sem danos', acao: ' não apresentavam danos, sujidades ou vestígios de luta e contenção'},


    {texto: 'automóvel', acao: ' AUTOMÓVEL'},
    
    

    
    { texto: 'LIMPAR', acao: 'LIMPAR'}

]

var opcoesDeVeiculos =[
    {texto: 'automóvel', acao: ' AUTOMÓVEL'},
    {texto: 'motociclo', acao: ' MOTOCLICO'},
    {texto: 'caminhão', acao: ' CAMINHÃO'},

    {texto: 'marca', acao: ', marca'},
    {texto: 'FORD', acao: ', marca FORD'},
    {texto: 'VW', acao: ', marca VOLKSWAGEN'},
    
    {texto: 'modelo', acao: ', modelo'},
    {texto: 'GOL', acao: ', modelo GOL'},
  
    {texto: 'cor', acao: ', na cor'},
    {texto: 'CINZA', acao: ', na cor CINZA'},

    {texto: 'fabricação', acao: ', ano de fabricação'},
    {texto: 'placas', acao: 'e placas.\r\n'},
    
    {texto: 'AMOLGAMENTOS', acao: '\tQuando dos exames, referido veículo apresentava-se com danos de aspecto recente: AMOLGAMENTOS'},
    {texto: 'ATRITAMENTOS', acao: '\tQuando dos exames, referido veículo apresentava-se com danos de aspecto recente: ATRITAMENTO'},
    {texto: 'FRATURAS', acao: '\tQuando dos exames, referido veículo apresentava-se com danos de aspecto recente: FRATURAS'},
    
    {texto: 'DE', acao: ', orientados da DIREITA para a ESQUERDA'},
    {texto: 'ED', acao: ', orientados da ESQUERDA para a DIREITA'},
    {texto: 'TF', acao: ', orientados de TRÁS para a FRENTE'},
    {texto: 'FT', acao: ', orientados da FRENTE para a TRÁS'},
    {texto: 'CB', acao: ', orientados de CIMA para a BAIXO'},
    {texto: 'BC', acao: ', orientados da BAIXO para a CIMA'},

    {texto: 'Flanco D', acao: ', sediados no flanco DIREITO'},
    {texto: 'Flanco E', acao: ', sediados no flanco ESQUERDO'},
    {texto: 'Porção A', acao: ', sediados na porção ANTERIOR'},
    {texto: 'Porção P', acao: ', sediados no porção POSTERIOR'},
    {texto: 'Porção S', acao: ', sediados na porção SUPERIOR'},
    {texto: 'Porção I', acao: ', sediados no porção INFERIOR'},
    
    {texto: 'Terço A', acao: ', terço ANTERIOR'},
    {texto: 'Terço P', acao: ', terço POSTERIOR'},

    {texto: 'Terço D', acao: ', terço DIREITO'},
    {texto: 'Terço E', acao: ', terço ESQUERDO'},
    
    
    

    
    { texto: 'LIMPAR', acao: 'LIMPAR'}
]


var opcoesDeVestigios = [

    { texto: 'Escalada sem vestígios', acao: 'Apesar de não ter sido encontrado o ponto exato de entrada, entende-se escalada como modo provável de acesso ao interior da propriedade.#32CD32'},

    { texto: 'Vestígios escalada', acao: 'Vestígios compatíveis com escalada,#32CD32'},
    { texto: 'Sujidades', acao: ' caracterizados por sujidades#DA70D6'},
    { texto: 'calçado', acao: ' típicas de calçado,#EE82EE'},
    { texto: 'pés', acao: ' que ensejam marcas de pés#EE82EE'},
    { texto: 'mãos', acao: ' que ensejam marcas de mãos#EE82EE'},
    { texto: 'terra', acao: ' em terra#EE82EE'},
    
    { texto: 'Fragmentos', acao: ' caracterizados por fragmentos caídos ao solo, a saber,#DA70D6'},
    { texto: 'de cimento', acao: ' de cimento#EE82EE'},
    { texto: 'de telha ', acao: ' de telha#EE82EE'},
    { texto: 'de tijolo', acao: ' de tijolo#EE82EE'},
    { texto: 'de vidro', acao: ' de vidro#EE82EE'},


    { texto: 'Arrombamento', acao: 'Vestígios compatíveis com arrombamento, caracterizados por #32CD32'},
    { texto: 'Danos', acao: ' danos#DA70D6'},
    { texto: 'Amolgamento', acao: ' amolgamentos#DA70D6'},
    { texto: 'Fraturas', acao: ' fraturas#DA70D6'},
    { texto: 'Atritamentos', acao: ' atritamentos#DA70D6'},
    { texto: 'Remoção', acao: ' remoção#DA70D6'},
    
    { texto: 'em porta', acao: ' em porta#EE82EE'},
    { texto: 'em janela', acao: ' em janela#EE82EE'},
    { texto: 'em parede', acao: ' em parede#EE82EE'},
    { texto: 'em telhado', acao: ' em telhado#EE82EE'},
    { texto: 'de forro', acao: ' de forro#EE82EE'},
    { texto: 'moldura de vedação', acao: ' de moldura de vedação#EE82EE'},
    
    { texto: 'de vidro/vidrilho', acao: ' de vidro/vidrilho#FA8072'},
    { texto: 'de metal', acao: ' de metal#FA8072'},
    { texto: 'de vidro e metal', acao: ' de metal#FA8072'},
    { texto: 'de plástico', acao: ' de plástico#FA8072'},
    { texto: 'de madeira', acao: ' de madeira#FA8072'},

    { texto: 'alavanca', acao: ' que ensejam uso de instrumento na forma de alavanca#FA8072'},
    { texto: 'ação percussiva', acao: ' que ensejam uso de instrumento na forma de percussiva#FA8072'},
    { texto: 'força humana', acao: ' que ensejam emprego de força humana desassistida de instrumento#FA8072'},
    { texto: 'alavanca', acao: ' que ensejam uso de instrumento na forma de alavanca#FA8072'},
    { texto: 'mixa', acao: ' que ensejam uso de chave falsa ou mixa#FA8072'},
    { texto: 'inserção de instrumento', acao: ' que ensejam inserção de instrumento incerto#FA8072'},
    
    
    { texto: 'Desordem', acao: 'Desordem típica de busca #32CD32'},
    { texto: 'quartos', acao: ' nos quartos,#EE82EE'},
    { texto: 'quarto', acao: ' no quarto,#EE82EE'},
    { texto: 'closet', acao: ' no closet,#EE82EE'},
    { texto: 'sala ', acao: ' na sala,#EE82EE'},
    { texto: 'cozinha', acao: ' na cozinha,#EE82EE'},
    { texto: 'banheiro', acao: ' no banheiro,#EE82EE'},
    { texto: 'garagem ', acao: ' na garagem,#EE82EE'},
    { texto: 'lavanderia', acao: ' na lavanderia#EE82EE'},
    { texto: 'na área externa', acao: ' na área externa,#EE82EE'},
        
    { texto: 'Situado', acao: 'situado na porção #32CD32'},
    { texto: 'anterior', acao: 'anterior,#EE82EE'},
    { texto: 'média', acao: 'média,#EE82EE'},
    { texto: 'posterior', acao: 'posterior,#EE82EE'},
    { texto: 'esquerda', acao: 'esquerda,#EE82EE'},
    { texto: 'central', acao: 'central,#EE82EE'},
    { texto: 'direita', acao: 'direita,#EE82EE'},
    { texto: 'interna', acao: 'interna,#EE82EE'},
    { texto: 'externa', acao: 'externa,#EE82EE'},
    { texto: 'superior', acao: 'superior,#EE82EE'},
    { texto: 'inferior', acao: 'inferior,#EE82EE'},

    

    // { texto: 'Sangue', acao: 'Vestígios de sangue#32CD32'},
    // { texto: 'em gota', acao: ' em gota#FA8072'},
    // { texto: 'em mancha', acao: ' em mancha#FA8072'},
    // { texto: 'em esfregaço', acao: ' em esfregaço#FA8072'},
    // { texto: 'em poça', acao: ' em poça#FA8072'},
    // { texto: 'no piso', acao: ' no piso#EE82EE'},
    // { texto: 'na parede', acao: ' na parede#FF7F50'},
    // { texto: 'no teto', acao: ' no teto#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    
    // { texto: 'Projétil', acao: 'Projétil de arma de fogo#32CD32'},
    // { texto: 'deformado', acao: ' deformado#FA8072'},
    // { texto: 'íntegro', acao: ' íntegro#FA8072'},
    // { texto: 'encamisado', acao: ' encamisado#FA8072'},
    // { texto: 'semi-encamisado', acao: ' semi-encamisado#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'na parede', acao: ' na parede#FF7F50'},
    // { texto: 'no teto', acao: ' no teto#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    
    // { texto: 'Estojo', acao: 'Estojo de munição#32CD32'},
    // { texto: 'deflagrado', acao: ' deflagrado#FA8072'},
    // { texto: 'percutido', acao: ' percutido#FA8072'},
    // { texto: 'picotado', acao: ' picotado#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    
    // { texto: 'Marca de tiro', acao: 'Marca de impacto de projétil de arma de fogo#32CD32'},
    // { texto: 'no piso', acao: ' no piso#FA8072'},
    // { texto: 'na parede', acao: ' na parede#FA8072'},
    // { texto: 'no teto', acao: ' no teto#FA8072'},
    // { texto: 'em móveis', acao: ' em móveis#FA8072'},
    // { texto: 'em objetos', acao: ' em objetos#FA8072'},
    
    // { texto: 'Pegada', acao: 'Pegada#32CD32'},
    // { texto: 'em sangue', acao: ' em sangue#FA8072'},
    // { texto: 'em poeira', acao: ' em poeira#FA8072'},
    // { texto: 'em terra', acao: ' em terra#FA8072'},
    // { texto: 'em lama', acao: ' em lama#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    
    // { texto: 'Impressão papilar', acao: 'Impressão papilar#32CD32'},
    // { texto: 'em sangue', acao: ' em sangue#FA8072'},
    // { texto: 'em poeira', acao: ' em poeira#FA8072'},
    // { texto: 'em gordura', acao: ' em gordura#FA8072'},
    // { texto: 'em superfície lisa', acao: ' em superfície lisa#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'na parede', acao: ' na parede#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    
    // { texto: 'Fio de cabelo', acao: 'Fio de cabelo#32CD32'},
    // { texto: 'no piso', acao: ' no piso#FA8072'},
    // { texto: 'em móveis', acao: ' em móveis#FA8072'},
    // { texto: 'em objetos', acao: ' em objetos#FA8072'},
    
    // { texto: 'Mancha', acao: 'Mancha#32CD32'},
    // { texto: 'de líquido', acao: ' de líquido#FA8072'},
    // { texto: 'de gordura', acao: ' de gordura#FA8072'},
    // { texto: 'de fluido corporal', acao: ' de fluido corporal#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'na parede', acao: ' na parede#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},
    

    
    // { texto: 'Marca de ferramenta', acao: 'Marca de ferramenta#32CD32'},
    // { texto: 'de corte', acao: ' de corte#FA8072'},
    // { texto: 'de pressão', acao: ' de pressão#FA8072'},
    // { texto: 'de alavanca', acao: ' de alavanca#FA8072'},
    // { texto: 'no piso', acao: ' no piso#FF7F50'},
    // { texto: 'na parede', acao: ' na parede#FF7F50'},
    // { texto: 'em móveis', acao: ' em móveis#FF7F50'},
    // { texto: 'em objetos', acao: ' em objetos#FF7F50'},

    
    { texto: 'LIMPAR', acao: 'LIMPAR#FFFFFF'}



];


var opcoesDeLocal = [
    //{ texto: 'Via pública', acao: 'Via pública.' },

    //CORES:
    //Textos Prontos: #32CD32
    //
    
    { texto: 'Via pública', acao: 'Via pública.#32CD32'},
    
    { texto: 'Bar', acao: 'edificação do tipo estabelecimento comercial, unido de vizinhos em ambos os lados, erguido recuado e ao nível geral da via pública, vedado do passeio público por muro de alvenaria/gradeamento metálico. Internamente era composto por um salão principal, contendo balcão mesas, cadeiras e bancos, bem como geladeiras e prateleiras.#32CD32'},

    
    { texto: 'Residência', acao: 'edificação do tipo residência,#E9967A'},
    { texto: 'Comércio', acao: 'edificação do tipo estabelecimento comercial,#E9967A'},
    { texto: 'Indústria', acao: 'edificação do tipo industrial,#E9967A'},
    { texto: 'Complexo', acao: 'complexo dotado de diversas edificações,#E9967A'},

    { texto: 'Alvenaria', acao: ' em alvenaria,#FA8072'},
    { texto: 'Madeira', acao: ' em madeira,#FA8072'},
    { texto: 'Metal', acao: ' em metal,#FA8072'},
    { texto: 'Vidro e Metal', acao: ' em vidro e metal,#FA8072'},
    
    { texto: 'Unido', acao: ' unido de vizinhos em ambos os lados,#FF7F50'},
    { texto: 'Geminado E', acao: ' geminado de vizinhos à esquerda,#FF7F50'},
    { texto: 'Geminado D', acao: ' geminado de vizinhos à direita,#FF7F50'},
    { texto: 'Isolado Ambos', acao: ' isolado de vizinhos em ambos os lados,#FF7F50'},
    { texto: 'Isolado E', acao: ' isolado de vizinhos à esquerda,#FF7F50'},
    { texto: 'Isolado D', acao: ' isolado de vizinhos à direita,#FF7F50'},

    { texto: 'Alinhado Acima', acao: ' erguido alinhado e acima do nível geral da via pública,#FF69B4'},
    { texto: 'Recuado Acima', acao: ' erguido recuado e acima do nível geral da via pública,#FF69B4'},
    { texto: 'Alinhado Abaixo', acao: ' erguido alinhado e abaixo do nível geral da via pública,#FF69B4'},
    { texto: 'Recuado Abaixo', acao: ' erguido recuado e abaixo do nível geral da via pública,#FF69B4'},
    { texto: 'Alinhado Ao Nível', acao: ' erguido alinhado e ao nível geral da via pública,#FF69B4'},
    { texto: 'Recuado Ao Nível', acao: ' erguido recuado e ao nível geral da via pública,#FF69B4'},

    { texto: 'Ved Muro', acao: ' vedada do passeio público por muro de alvenaria, medindo aproximadamente XX metros em seu ponto mais baixo,#FF6347'},
    { texto: 'Ved Grade', acao: ' vedada do passeio público por gradeamento metálico, medindo aproximadamente XX metros em seu ponto mais baixo,#FF6347'},
    { texto: 'Ved Cerca', acao: ' vedada do passeio público por cerca metálica, medindo aproximadamente XX metros em seu ponto mais baixo,#FF6347'},
    { texto: 'Não vedada', acao: ' não vedada do passeio público#FF6347'},

//?    { texto: 'Altura', acao: ' medindo aproximadamente XX m em seu ponto mais baixo,#FF6347'},
    
    { texto: 'Portão social', acao: ' cujo acesso principal era portão social,#DA70D6'},
    { texto: 'Portão basculante', acao: ' cujo acesso principal era portão metálico basculante,#DA70D6'},
    { texto: 'Portão deslizante lateral', acao: ' cujo acesso principal era portão metálico de deslizamento lateral,#DA70D6'},
    { texto: 'Portão metálico folha única', acao: ' cujo acesso principal era portão metálico,#DA70D6'},
    { texto: 'Portão de madeira folha única', acao: ' cujo acesso principal era portão madeira,#DA70D6'},
    { texto: 'Portão metálico folha dupla', acao: ' cujo acesso principal era portão metálico,#DA70D6'},
    { texto: 'Portão de madeira folha dupla', acao: ' cujo acesso principal era portão madeira,#DA70D6'},

    { texto: 'Acionamento eletrônico', acao: ' com acionamento eletrônico,#BA55D3'},
    { texto: 'Portaria 24h', acao: ' com portaria 24h,#BA55D3'},
    { texto: 'Cerca elétrica', acao: ' com cerca elétrica,#BA55D3'},
  
    { texto: 'Ofício IIRGD', acao: 'Senhor Delegado,\r\n\tPor meio deste, encaminho a V. Sa., XX(XX) lâminas com fragmentos de impressões dígito-papilares e mídia ótica dentro do envelope lacrado para fins de pesquisa criminal, relacionado com a ocorrência abaixo discriminada:\r\nNATUREZA: Furto Qualificado; DATA: 10/07/2023; B.O.: JA6438/2023; Delegacia: 3DP Americana/SP; Laudo: 225712/2023; LOCAL: R. Emilio Menezes, 01, Americana/SP; Lacre: SPTC5978546 SOLICITANTE: Dr. Regina Aparecida Castilho Cunha \r\nAtenciosamente,\r\n#FFFFFF'}, // corrigir texto

    { texto: 'Ofício Local Fechado', acao: 'Em atenção à requisição de perícia com as referências epigrafadas, sirvo do presente para informar a vossa senhoria que este perito não teve êxito na localização do endereço Delegacia de Sumaré - Plantão, Sumaré/SP, bem como não conseguiu contato com a Paulo Sérgio Bruscagin através do telefone 3465-1352 ou no endereço Av. Comendador Thomaz Fortunato, 3151, Chácara Letônia, Americana/SP, em tentativas consecutivas nos dias 19 de novembro de 2020 e 20 de novembro de 2020; desta forma o exame pericial deixou de ser realizado.#FFFFFF'}, // corrigir texto
    //ofícios?
    
    {texto: 'LIMPAR', acao: 'LIMPAR#FFFFFF'},
    {texto: 'Tratava-se de ', acao: 'Tratava-se de #FFFFFF'}


];
var opcoesDeMaquinas = [
    { texto: 'Máquinas Antigas', acao: 'No exame do interior do referido estabelecimento comercial ofereceu interesse pericial a região posterior do salão, onde foram encontradas XXXXX máquinas montadas em gabinetes feitos de madeira e metal que ostentavam inscrições tais como "HALLOWEEN" e "MULTIJOGOS", apoiadas sobre o piso.\r\n Esses equipamentos eram dotados de botoeiras, monitor de vídeo, além de noteiros (compartimento destinado a receber cédulas monetárias) e não apresentavam número de série ou de identificação de seu fabricante.' }, //verificar portugues

    { texto: 'Totem Brasil 1', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totem Brasil montadas em gabinetes em madeira, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "Proibido o acesso a sites que contenham: 1º Conteúdo pornográfico ou relacionado com pedofilia; 2º Que violem direitos de terceiros ou violem a lei vigente; 3º Jogos de azar que tenham ou envolvam prêmios em dinheiro."' }, // ok
    
    { texto: 'Terminal de Internet', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Terminal de Internet/Totem Brasil montadas em gabinetes em madeira, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "Proibido o acesso a sites que contenham: 1º Conteúdo pornográfico ou relacionado com pedofilia; 2º Que violem direitos de terceiros ou violem a lei vigente; 3º Jogos de azar que tenham ou envolvam prêmios em dinheiro."' }, // ok
    
    { texto: 'Totem Brasil II', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totem Brasil II, montadas em gabinetes em metal, da cor predominante preta. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "Proibido o acesso a sites que contenham: 1º Conteúdo pornográfico ou relacionado com pedofilia; 2º Que violem direitos de terceiros ou violem a lei vigente; 3º Jogos de azar que tenham ou envolvam prêmios em dinheiro.".' }, // verif ort

    { texto: 'Totens de Internet - REALWEB', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totens de Internet montadas em gabinetes em metal, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "AVISO IMPORTANTE AO USUÁRIO Proibido o acesso de: Pornografia - Pedofilia - Jogos de Azar - Apologia ao Terrorismo - Obs: Não nos resposabilizamos por dados pessoais utilizados durante o acesso.".' }, //verificar ortografia
    
    { texto: 'Totem de Internet', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totens de Internet montadas em gabinetes em metal, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "AVISO IMPORTANTE AO USUÁRIO Proibido o acesso de: Pornografia - Pedofilia - Jogos de Azar - Apologia ao Terrorismo - Obs: Não nos resposabilizamos por dados pessoais utilizados durante o acesso.".' }, //verificar ortografia

    { texto: 'Kiosk', acao: 'No salão principal, ocultas da vista externa, acostadas junto à parede da edificação, foram localizadas XXXXX máquinas computadorizadas, de denominação aparente Totens de Internet montadas em gabinetes em metal, da cor predominante azul. A partir do exame visual externo, foi possível observar que as máquinas eram dotadas de noteiros (destinado à inserção de cédulas em Reais), teclado, monitor de vídeo "touch screen" e conexão para internet. \r\n As referidas máquinas ainda continham plaqueta frontal com a seguinte inscrição "AVISO IMPORTANTE DE USO: O acesso a sites que remetam: Pedofilia, pornografia, jogos de azar ou equivalentes é proibido. Obs: Não nos resposabilizamos por dados pessoais utilizados durante o acesso.".' }, // verifica orto
    
    { texto: 'World Link', acao: 'Kiosk Net.' },

    { texto: 'Real Web', acao: 'Real Web.' },
    { texto: 'Positivo', acao: 'Quando da chegada desta equipe pericial, os noteiros encontravam-se fechados e as máquinas desligadas. Quando solicitado o funcionamento destas, as máquinas exibiram em suas telas jogo eletrônico. As máquinas foram abertas, encontrando-se a quantia total de R$XXX,00, a qual foi entregue em mãos ao representante da Polícia Civil. Os noteiros foram removidos de seus gabinetes e inutilizados no próprio local. Os dispositivos de armazenamento, a saber, XXXXX cartões de memória, XXXXX discos rígidos, XXXXX pendrives, XXXXX placas contendo memória programável (EPROM) foram removidos e acondicionados em embalagem plástica lacrada sob o número SPTC LACRE.\r\nConsiderações Finais\r\nFoi realizado o exame de funcionamento das referidas máquinas no local, sendo que XXXXX máquinas possuíam jogo eletrônico sorteador de resultados, na qual, o ganho ou perda independe da habilidade física ou mental do agente, ou seja, depende exclusivamente da sorte ("Jogo de Azar").'},
    
    { texto: 'Negativo', acao: 'Durante o exame, esse relator acessou tela que solicitava a inserção de senha para prosseguimento, no entanto, a mesma não foi fornecida pelo responsável e a continuação do exame in loco ficou prejudicada. Não foi possível acessar o histórico de acesso dos navegadores das máquinas.\r\nConsiderações Finais\r\nPor último, cumpre-se consignar que XXXXX máquinas World Link/Totem Brasil possuíam, no momento dos exames periciais, acesso à internet. Dessa forma, não foi possível descartar a hipótese que outrora as máquinas poderiam estar sendo usadas para acessar sites/servidores contendo jogos sorteadores de resultado envolvendo a perda e ganho de dinheiro.\r\nApesar de não ter sido possível constatar o jogo de azar, essas máquinas possuem semelhanças e componentes eletrônicos de mesmas características de outras máquinas que apresentaram esse tipo de jogo em outras ocasiões.\r\nAtendendo a OS-03/2022 - NPC Americana, que revogou a OS-01/2022, os dispositivos de armazenamento, os noteiros e valores porventura existentes nas máquinas deixaram de ser retirados ou apreendidos.' },
    
    {texto: 'LIMPAR', acao: 'LIMPAR'}
];

