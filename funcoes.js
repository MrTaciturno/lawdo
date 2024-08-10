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

function fProcessaEmail(){
    var conteudoEmail = document.getElementById('cCampodeColagem').textContent;
    document.getElementById('cCampodeColagem').value = "";
    document.getElementById('cCampodeColagem').placeholder= "OK";

    console.log(conteudoEmail);

    var posProtSAEP = conteudoEmail.search   ("Local LiberadoNº");
    var posNumLaudo = conteudoEmail.search   ("Laudo:");
    
    var posTipoOrigem = conteudoEmail.search("Tipo de Origem:");
    var posCidadeOrigem = conteudoEmail.search("Cidade de Origem:");
    
    var posOrigem = conteudoEmail.search("Número do BO:");
    var posOrgaoCircunscricao = conteudoEmail.search("Órgão Circunscrição:");
    var posDPRequisitante = conteudoEmail.search("DP Requisitante:");
        
    var posMSG = conteudoEmail.search("MSG n°:");
    var posAutoridade = conteudoEmail.search("Nome do Requisitante:");
    
    var posEndereco = conteudoEmail.search("Endereço:");

    //var posEmailReq = conteudoEmail.search("Email Requisitante:");

    var posNaturezaExame = conteudoEmail.search("Natureza:");
    var posNaturezaCrime = conteudoEmail.search("Natureza Criminal da Ocorrência:");
    
    //var posDataSolicitacao = conteudoEmail.search("Solicitação:");
    var posDataFatoInfo = conteudoEmail.search("Data/Hora do Fato:");
    var posDataAcionamento = conteudoEmail.search("Protocolo Aberto");
    
    var posDataExame = conteudoEmail.search("Protocolo em Atendimento");

    
    var posLocalFatoInfo = conteudoEmail.search("Local do Fato:");
    var posLocalExameInfo = conteudoEmail.search("Local do Exame:");
    var posAcusado = conteudoEmail.search("Acusado");
    var posVitimaInfo = conteudoEmail.search("Vitíma");
    var posVitimaFatal = conteudoEmail.search("Vitíma Fatal:");
    var posPreservaInfo = conteudoEmail.search("Preservado:");
    var posPrioridade = conteudoEmail.search("Prioridade:");
    
    var posHistoricoInfo = conteudoEmail.search("Histórico:");
    //var posObjetivoExame = conteudoEmail.search("Quesitos:");

    var posQuesitos = conteudoEmail.search("Quesitos:");
    var posObs = conteudoEmail.search("Observações/Mensagem na Íntegra:");
    var posPessoasEnvolvidas = conteudoEmail.search("Pessoas Envolvidas:");

    var posVeiculoInfo = conteudoEmail.search("Veículo");

    var fullText = " "+posAcusado+" "+posAutoridade+" "+posDataFatoInfo+" "+posDataAcionamento+" "+posDataExame+" "+posLocalFatoInfo+" "+posLocalExameInfo+" "+posAcusado+" "+posVitimaInfo+" "+posVitimaFatal+" "+posPreservaInfo+" "+posPrioridade+" "+posHistoricoInfo+" "+posQuesitos+" "+posObs+" "+posPessoasEnvolvidas+" "+posVeiculoInfo;

    criaDOCX(fullText,"textinho");
    return fullText;

    //revela();
}