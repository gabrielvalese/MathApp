
        // Dados vindos do servidor
        const tentativaId = 81704;
        const questoesData = [{"tipo":"objetiva","id_questao":"7373","enunciado":"<p>Um desenvolvedor est\u00e1 criando um sistema de gerenciamento de estoque&nbsp;<span style=\"font-size: 1rem;\">para uma loja de produtos eletr\u00f4nicos. Para otimizar o processo de&nbsp;<\/span><span style=\"font-size: 1rem;\">compras, o sistema deve ser integrado com o sistema de compras de&nbsp;<\/span><span style=\"font-size: 1rem;\">fornecedores, de forma que, ao identificar uma necessidade de reposi\u00e7\u00e3o&nbsp;<\/span><span style=\"font-size: 1rem;\">de estoque, o sistema possa gerar automaticamente um pedido de&nbsp;<\/span><span style=\"font-size: 1rem;\">compra para o fornecedor correspondente.&nbsp;<\/span><\/p><p><span style=\"font-size: 1rem;\">Qual o tipo de integra\u00e7\u00e3o deve ser utilizada no desenvolvimento do&nbsp;<\/span><span style=\"font-size: 1rem;\">sistema?<\/span><\/p>","alternativas":[{"key":"op1","texto":"<p>Integra\u00e7\u00e3o de arquivos.<\/p>"},{"key":"op2","texto":"<p>Integra\u00e7\u00e3o de mensagens.<\/p>"},{"key":"op3","texto":"<p>Integra\u00e7\u00e3o de servi\u00e7os web.<\/p>"},{"key":"op4","texto":"<p>Integra\u00e7\u00e3o de banco de dados.\r<\/p>"}],"gabarito":"op3","valor":"1.00"},{"tipo":"objetiva","id_questao":"7374","enunciado":"<p>Um t\u00e9cnico de qualidade respons\u00e1vel pelo planejamento e documenta\u00e7\u00e3o&nbsp;<span style=\"font-size: 1rem;\">de testes em uma nova aplica\u00e7\u00e3o web. Ao analisar os requisitos do&nbsp;<\/span><span style=\"font-size: 1rem;\">projeto, \u00e9 necess\u00e1rio selecionar um procedimento de teste adequado para&nbsp;<\/span><span style=\"font-size: 1rem;\">garantir a ader\u00eancia aos requisitos.&nbsp;<\/span><\/p><p><span style=\"font-size: 1rem;\">A abordagem realizada pelo t\u00e9cnico foi&nbsp;<\/span><\/p>","alternativas":[{"key":"op1","texto":"<p>confiar exclusivamente nos testes de unidade realizados pelos&nbsp;<span style=\"font-size: 1rem;\">desenvolvedores, sem realizar testes de sistema, integra\u00e7\u00e3o ou&nbsp;<\/span><span style=\"font-size: 1rem;\">aceita\u00e7\u00e3o.&nbsp;<\/span><\/p>"},{"key":"op2","texto":"<p>automatizar todos os testes poss\u00edveis, ignorando a necessidade de&nbsp;<span style=\"font-size: 1rem;\">testes explorat\u00f3rios e manuais, confiando inteiramente na automa\u00e7\u00e3o.<\/span><br><\/p>"},{"key":"op3","texto":"<p>realizar apenas testes manuais, sem a utiliza\u00e7\u00e3o de ferramentas&nbsp;<span style=\"font-size: 1rem;\">automatizadas, para garantir que todos os cen\u00e1rios sejam testados&nbsp;<\/span><span style=\"font-size: 1rem;\">exaustivamente pelos testadores.<\/span><span style=\"font-size: 1rem;\"><br><\/span><\/p>"},{"key":"op4","texto":"<p>implementar uma abordagem de testes combinada, utilizando testes&nbsp;<span style=\"font-size: 1rem;\">manuais e automatizados, al\u00e9m de incluir testes explorat\u00f3rios,&nbsp;<\/span><span style=\"font-size: 1rem;\">funcionais e n\u00e3o funcionais, de acordo com a necessidade do projeto.<\/span><\/p>"}],"gabarito":"op4","valor":"1.00"},{"tipo":"objetiva","id_questao":"7378","enunciado":"<p>Como parte do processo de implanta\u00e7\u00e3o de um novo sistema web para uma empresa, voc\u00ea&nbsp;<span style=\"font-size: 1rem;\">\u00e9 respons\u00e1vel por criar a documenta\u00e7\u00e3o t\u00e9cnica detalhada que ir\u00e1 guiar a equipe de&nbsp;<\/span><span style=\"font-size: 1rem;\">desenvolvimento durante a implementa\u00e7\u00e3o. Essa documenta\u00e7\u00e3o deve abranger desde a&nbsp;<\/span><span style=\"font-size: 1rem;\">arquitetura do sistema at\u00e9 os detalhes de cada m\u00f3dulo e funcionalidade.&nbsp;<\/span><\/p><p><span style=\"font-size: 1rem;\">Selecione a alternativa que indica o software que deve ser usada para criar diagramas de&nbsp;<\/span><span style=\"font-size: 1rem;\">fluxo, ilustra\u00e7\u00f5es e esquemas visuais que auxiliar\u00e3o na explica\u00e7\u00e3o da arquitetura e&nbsp;<\/span><span style=\"font-size: 1rem;\">processos do sistema.&nbsp;<\/span><\/p>","alternativas":[{"key":"op1","texto":"<p>Microsoft Project<\/p>"},{"key":"op2","texto":"<p>Microsoft Visio<\/p>"},{"key":"op3","texto":"<p>Microsoft Excel\r<\/p>"},{"key":"op4","texto":"<p>Microsoft PowerPoint<\/p>"}],"gabarito":"op2","valor":"1.00"}]; // [{id_questao, enunciado, alternativas:[{key, texto}], valor}]
        const respostasSalvas = []; // {id_questao: {alternativa_marcada, correta}} ou string legado
        const provaFinalizada = false;
        const modoProtegido = true;
        let monitorProtecaoIniciado = false;
        let heartbeatBloqueio = null;
        let ignorarEventosAte = Date.now() + 5000;
        let saindoIntencionalmente = false;
        let desbloqueioLiberadoProfessor = false;
        let aguardandoInicioProtegido = false;

        function modalInicioProtegidoAberto() {
            const modal = document.getElementById('modalInicioProtegido');
            return !!(modal && !modal.classList.contains('hidden'));
        }

        function bloquearInterfacePorSeguranca(motivo) {
            provaBloqueada = true;
            desbloqueioLiberadoProfessor = true;
            const modal = document.getElementById('modalBloqueioProtegido');
            const texto = document.getElementById('textoMotivoBloqueio');
            const btnContinuar = document.getElementById('btnContinuarBloqueio');
            if (texto && motivo) {
                texto.textContent = motivo;
            }
            if (btnContinuar) {
                btnContinuar.disabled = true;
                btnContinuar.className = 'px-4 py-2 rounded-md font-semibold bg-gray-300 text-gray-600 cursor-not-allowed';
            }
            if (modal) {
                modal.classList.remove('hidden');
            }
            const inputs = document.querySelectorAll('input, textarea, select, button');
            inputs.forEach((el) => {
                if (el.id !== 'btnConfirmarSair' && el.id !== 'btnCancelarSair' && el.id !== 'btnContinuarBloqueio') {
                    el.disabled = true;
                }
            });
        }

        function liberarRetomadaAposDesbloqueio() {
            if (!provaBloqueada) {
                return;
            }
            desbloqueioLiberadoProfessor = true;
            const texto = document.getElementById('textoMotivoBloqueio');
            const btnContinuar = document.getElementById('btnContinuarBloqueio');

            if (texto) {
                texto.textContent = 'Professor liberou sua prova. Clique no botão para retomar.';
            }

            if (btnContinuar) {
                btnContinuar.disabled = false;
                btnContinuar.className = 'px-4 py-2 rounded-md font-semibold bg-green-600 hover:bg-green-700 text-white';
            }
        }

        function desbloquearInterfacePorSeguranca() {
            provaBloqueada = false;
            const modal = document.getElementById('modalBloqueioProtegido');
            if (modal) {
                modal.classList.add('hidden');
            }
            const inputs = document.querySelectorAll('input, textarea, select, button');
            inputs.forEach((el) => {
                el.disabled = false;
            });
            if (modoProtegido && !document.fullscreenElement) {
                // Evita rebloqueio enquanto o navegador processa a transição de fullscreen.
                ignorarEventosAte = Date.now() + 10000;
                solicitarFullscreen();
            }
        }

        function reportarViolacao(tipo) {
            if (!modoProtegido || provaFinalizada || provaBloqueada) {
                return;
            }
            if (Date.now() < ignorarEventosAte) {
                return;
            }

            const formData = new URLSearchParams();
            formData.append('id_tentativa', tentativaId);
            formData.append('tipo', tipo);

            fetch('https://www.smartprova.com.br/prova/reportar_violacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.bloqueado) {
                    bloquearInterfacePorSeguranca('Aguardando desbloqueio do professor.');
                }
            })
            .catch(console.error);
        }

        function reportarViolacaoBeacon(tipo) {
            if (!modoProtegido || provaFinalizada || provaBloqueada || saindoIntencionalmente) {
                return;
            }
            if (!navigator.sendBeacon) {
                reportarViolacao(tipo);
                return;
            }

            const formData = new FormData();
            formData.append('id_tentativa', tentativaId);
            formData.append('tipo', tipo);
            navigator.sendBeacon('https://www.smartprova.com.br/prova/reportar_violacao', formData);
        }

        function solicitarFullscreen(forcar = false) {
            if (provaFinalizada) {
                return Promise.resolve(false);
            }
            if (provaBloqueada && !forcar) {
                return Promise.resolve(false);
            }
            if (!forcar && !modoProtegido) {
                return Promise.resolve(false);
            }
            if (document.fullscreenElement) {
                return Promise.resolve(true);
            }
            const el = document.documentElement;
            if (el && el.requestFullscreen) {
                return el.requestFullscreen().then(() => {
                    ignorarEventosAte = Date.now() + 3000;
                    return true;
                }).catch(() => {
                    // Sem gesto do usuário, alguns navegadores podem negar fullscreen.
                    // Mantemos a prova desbloqueada e tentamos novamente no loop de verificação.
                    ignorarEventosAte = Date.now() + 3000;
                    return false;
                });
            }
            return Promise.resolve(false);
        }

        function iniciarHeartbeatStatus() {
            if (!modoProtegido || provaFinalizada) {
                return;
            }
            heartbeatBloqueio = setInterval(() => {
                fetch('https://www.smartprova.com.br/prova/status_tentativa/' + tentativaId)
                    .then(response => response.json())
                    .then(data => {
                        if (!data || !data.ok) {
                            return;
                        }
                        if (data.status === 'finalizada' || data.status === 'expirada') {
                            return;
                        }
                        if (data.bloqueado) {
                            bloquearInterfacePorSeguranca('A prova está bloqueada. Solicite desbloqueio ao professor.');
                        } else if (provaBloqueada) {
                            liberarRetomadaAposDesbloqueio();
                        }
                    })
                    .catch(console.error);
            }, 5000);
        }

        function iniciarModoProtegido() {
            if (!modoProtegido || provaFinalizada || monitorProtecaoIniciado) {
                return;
            }
            monitorProtecaoIniciado = true;

            solicitarFullscreen();
            iniciarHeartbeatStatus();

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    reportarViolacao('visibility_hidden');
                }
            });

            window.addEventListener('blur', () => {
                reportarViolacao('window_blur');
            });

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    reportarViolacao('saiu_fullscreen');
                }
            });

            document.addEventListener('keydown', (e) => {
                const tecla = (e.key || '').toLowerCase();
                const bloqueado =
                    tecla === 'f11' ||
                    tecla === 'escape' ||
                    ((e.ctrlKey || e.metaKey) && ['t', 'n', 'w', 'r', 'l', 'p'].includes(tecla));

                if (bloqueado) {
                    e.preventDefault();
                    reportarViolacao('atalho_bloqueado_' + tecla);
                }
            });

            window.addEventListener('pagehide', () => {
                reportarViolacaoBeacon('pagehide');
            });

            window.addEventListener('beforeunload', () => {
                reportarViolacaoBeacon('beforeunload');
            });

            setInterval(() => {
                if (!document.fullscreenElement && !provaBloqueada) {
                    solicitarFullscreen();
                }
            }, 1200);
        }

        // Estado da prova (protegido contra manipulação via console)
        const estadoProva = (function() {
            let _state = {
                questaoAtual: 1,
                questoes: {},
                totalQuestoes: questoesData.length,
                tempoRestante: (function(){
                    // Usar brasilia_strtotime para converter corretamente
                    var fim = 8438;
                    return (fim > 0) ? fim : 0;
                })(),
                intervaloContador: null,
                intervaloSincronizacao: null,
                menuAberto: false
            };
            
            // Retornar interface pública com getters/setters controlados
            return {
                get questaoAtual() { return _state.questaoAtual; },
                set questaoAtual(val) { _state.questaoAtual = val; },
                get questoes() { return _state.questoes; },
                get totalQuestoes() { return _state.totalQuestoes; },
                get tempoRestante() { return _state.tempoRestante; },
                set tempoRestante(val) { 
                    // Só permite diminuir o tempo, não aumentar
                    if (val < _state.tempoRestante) _state.tempoRestante = val;
                },
                get intervaloContador() { return _state.intervaloContador; },
                set intervaloContador(val) { _state.intervaloContador = val; },
                get intervaloSincronizacao() { return _state.intervaloSincronizacao; },
                set intervaloSincronizacao(val) { _state.intervaloSincronizacao = val; },
                get menuAberto() { return _state.menuAberto; },
                set menuAberto(val) { _state.menuAberto = val; },
                forceTimeUpdate(val) { _state.tempoRestante = val; } // Apenas para sincronização com servidor
            };
        })();

        // Bloquear interface se a prova já foi finalizada
        if (provaFinalizada) {
            // Desabilitar todos os inputs de alternativas
            setTimeout(function() {
                const inputs = document.querySelectorAll('input[type="radio"][name^="alternativa"]');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.style.cursor = 'not-allowed';
                });
                
                // Ocultar botão de entregar prova
                const btnEntregar = document.getElementById('btnEntregarProva');
                if (btnEntregar) {
                    btnEntregar.style.display = 'none';
                }
                
                // Exibir mensagem de prova finalizada
                const areaQuestao = document.getElementById('area-questao');
                if (areaQuestao) {
                    const aviso = document.createElement('div');
                    aviso.className = 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4';
                    aviso.innerHTML = '<p class="font-bold">Avaliação já finalizada</p><p>Esta avaliação já foi entregue. Suas respostas não podem ser alteradas.</p>';
                    areaQuestao.insertBefore(aviso, areaQuestao.firstChild);
                }
            }, 100);
        }

        // Inicializar estado das questões com respostas salvas
        for (let i = 1; i <= estadoProva.totalQuestoes; i++) {
            const qData = questoesData[i-1];
            const qId = qData.id_questao;
            let respostaIndex = null;
            
            if (respostasSalvas[qId]) {
                const saved = respostasSalvas[qId];
                const raw = (saved && typeof saved === 'object' && 'alternativa_marcada' in saved)
                    ? saved.alternativa_marcada
                    : saved;

                if (!qData.tipo || qData.tipo === 'objetiva') {
                    // Questão objetiva: mapear resposta salva para índice da alternativa
                    const key = raw;
                    const idx = qData.alternativas.findIndex(a => a.key === key);
                    respostaIndex = (idx >= 0) ? idx : null;
                } else if (qData.tipo === 'completar') {
                    // Questão de completar: parse JSON salvo (array de strings)
                    try {
                        const parsed = (typeof raw === 'string') ? JSON.parse(raw) : raw;
                        respostaIndex = Array.isArray(parsed) ? parsed : null;
                    } catch (e) {
                        respostaIndex = null;
                    }
                } else if (qData.tipo === 'associacao') {
                    // Questão de associação: parse JSON salvo (array de índices)
                    try {
                        const parsed = (typeof raw === 'string') ? JSON.parse(raw) : raw;
                        respostaIndex = Array.isArray(parsed) ? parsed : null;
                    } catch (e) {
                        respostaIndex = null;
                    }
                }
            }
            
            estadoProva.questoes[i] = {
                visitada: false,
                resposta: respostaIndex,
                correta: null
            };
        }

        // Funções para controlar o menu lateral
        function abrirMenu() {
            document.getElementById('menuQuestoes').classList.remove('-translate-x-full');
            document.getElementById('overlay').classList.remove('hidden');
            estadoProva.menuAberto = true;
        }

        function fecharMenu() {
            document.getElementById('menuQuestoes').classList.add('-translate-x-full');
            document.getElementById('overlay').classList.add('hidden');
            estadoProva.menuAberto = false;
        }

        function toggleMenu() {
            if (estadoProva.menuAberto) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        }

        // Formatador de tempo
        function formatarTempo(segundos) {
            const horas = Math.floor(segundos / 3600);
            const minutos = Math.floor((segundos % 3600) / 60);
            const segs = segundos % 60;
            
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
        }

        // Sincronizar tempo com servidor
        function sincronizarTempoServidor() {
            fetch('https://www.smartprova.com.br/prova/obter_tempo_restante/' + tentativaId)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        // Atualizar tempo forçadamente (bypass da proteção)
                        estadoProva.forceTimeUpdate(data.tempo_restante);
                        
                        // Se o servidor diz que o tempo acabou, forçar finalização
                        if (data.tempo_restante <= 0 && !provaFinalizada) {
                            clearInterval(estadoProva.intervaloContador);
                            clearInterval(estadoProva.intervaloSincronizacao);
                            tempoEsgotado();
                        }

                        if (modoProtegido && data.bloqueado) {
                            bloquearInterfacePorSeguranca('A prova está bloqueada. Solicite desbloqueio ao professor.');
                        }
                    }
                })
                .catch(error => console.error('Erro ao sincronizar tempo:', error));
        }

        // Atualizar contador
        function atualizarContador() {
            const contadorElement = document.getElementById('contador-tempo');
            
            estadoProva.tempoRestante--;
            
            if (estadoProva.tempoRestante <= 0) {
                estadoProva.forceTimeUpdate(0);
                clearInterval(estadoProva.intervaloContador);
                clearInterval(estadoProva.intervaloSincronizacao);
                tempoEsgotado();
            }
            
            // Mudar cor quando estiver acabando o tempo
            if (estadoProva.tempoRestante <= 300) { // 5 minutos
                contadorElement.className = 'font-mono bg-red-100 text-red-700 px-2 py-1 rounded border border-red-300 min-w-[85px] text-center animate-pulse';
            } else if (estadoProva.tempoRestante <= 900) { // 15 minutos
                contadorElement.className = 'font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-300 min-w-[85px] text-center';
            }
            
            contadorElement.textContent = formatarTempo(estadoProva.tempoRestante);
        }

        // Tempo esgotado
        function tempoEsgotado() {
            document.getElementById('modalTempoEsgotado').classList.remove('hidden');
            document.getElementById('btnEntregar').disabled = true;
            document.getElementById('btnEntregar').classList.add('opacity-50', 'cursor-not-allowed');
            
            // Mostrar spinner
            showSpinner('Tempo esgotado. Processando entrega...');
            
            // Finalizar prova automaticamente via AJAX
            const formData = new URLSearchParams();
            formData.append('id_tentativa', tentativaId);
            
            fetch('https://www.smartprova.com.br/prova/finalizar_tempo_esgotado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Aguardar 2 segundos e redirecionar para página de resultado
                    setTimeout(() => {
                        window.location.href = 'https://www.smartprova.com.br/prova/finalizar/' + tentativaId;
                    }, 2000);
                } else {
                    console.error('Erro ao finalizar prova:', data.msg);
                    // Redirecionar mesmo assim
                    setTimeout(() => {
                        window.location.href = 'https://www.smartprova.com.br/prova/finalizar/' + tentativaId;
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                // Redirecionar mesmo assim
                setTimeout(() => {
                    window.location.href = 'https://www.smartprova.com.br/prova/finalizar/' + tentativaId;
                }, 3000);
            });
        }

        // Gerar botões das questões
        function gerarBotoesQuestoes() {
            const container = document.getElementById('questoes-container');
            container.innerHTML = '';
            
            for (let i = 1; i <= estadoProva.totalQuestoes; i++) {
                const questao = estadoProva.questoes[i];
                let classes = 'rounded-full px-1 py-1 text-sm font-medium transition-colors border-1 ';
                
                // Definir cor baseada no estado
                if (questao.resposta !== null) {
                    classes += 'bg-green-500 text-white border-green-600';
                } else if (questao.visitada) {
                    classes += 'bg-yellow-400 text-gray-800 border-yellow-500';
                } else {
                    classes += 'bg-gray-200 text-gray-600 border-gray-400 hover:bg-gray-200';
                }
                
                const button = document.createElement('button');
                button.className = classes;
                button.textContent = i;
                button.dataset.questao = i;
                
                button.addEventListener('click', function() {
                    carregarQuestao(parseInt(this.dataset.questao));
                    // Fechar menu automaticamente em mobile
                    if (window.innerWidth < 768) {
                        fecharMenu();
                    }
                });
                
                container.appendChild(button);
            }
        }

        // Carregar questão
        function carregarQuestao(numero) {
            estadoProva.questaoAtual = numero;
            estadoProva.questoes[numero].visitada = true;
            
            // Atualizar título
            document.getElementById('questao-titulo').textContent = `Questão ${numero}`;
            
            // Carregar conteúdo
            const container = document.getElementById('questao-conteudo');
            const qData = questoesData[numero-1];
            
            let respostaAtual = estadoProva.questoes[numero].resposta;
            
            const enunciadoHtml = qData.enunciado;
            
            // Renderizar baseado no tipo de questão
            let conteudoQuestao = '';
            
            if (!qData.tipo || qData.tipo === 'objetiva') {
                // Questão objetiva (múltipla escolha)
                const opcoesHtml = qData.alternativas.map((alt, index) => `
                    <div class="flex items-start gap-3">
                        <input 
                            type="radio" 
                            id="opcao_${numero}_${index}" 
                            name="questao${numero}" 
                            value="${index}"
                            ${respostaAtual === index ? 'checked' : ''}
                            class="h-4 w-4 md:h-4 md:w-4 text-azul-profundo mt-1"
                            onchange="marcarResposta(${numero}, ${index})"
                            data-key="${alt.key}"
                            data-idquestao="${qData.id_questao}"
                        />
                        <label for="opcao_${numero}_${index}" class="ml-0 md:ml-0 text-md md:text-base">${alt.texto}</label>
                    </div>
                `).join('');
                
                conteudoQuestao = `
                    <div class="mb-6 text-md md:text-base questao-enunciado">${enunciadoHtml}</div>
                    <div class="space-y-4 mb-8" id="opcoes-container">${opcoesHtml}</div>
                `;
                
            } else if (qData.tipo === 'completar') {
                // Questão de completar - exibir enunciado e campos numerados abaixo
                const numPalavras = qData.gabarito_array ? qData.gabarito_array.length : 0;
                const camposHtml = Array.from({length: numPalavras}, (_, index) => {
                    const valorSalvo = (respostaAtual && respostaAtual[index]) ? respostaAtual[index] : '';
                    return `
                        <div class="flex items-center gap-3 mb-4">
                            <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                ${index + 1}
                            </span>
                            <input 
                                type="text" 
                                id="palavra${index}" 
                                name="palavra${index}"
                                value="${valorSalvo}"
                                placeholder="Digite sua resposta aqui"
                                class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-lg md:text-base"
                                oninput="marcarRespostaCompletar(${numero}, ${index}, this.value)"
                                data-idquestao="${qData.id_questao}"
                                ${provaFinalizada ? 'disabled' : ''}
                            />
                        </div>
                    `;
                }).join('');
                
                conteudoQuestao = `
                    <div class="mb-6 text-md md:text-base questao-enunciado leading-relaxed">${enunciadoHtml}</div>
                    <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-purple-900 mb-4 text-base md:text-sm">Complete os espaços indicados acima:</h4>
                        ${camposHtml}
                    </div>
                `;
            } else if (qData.tipo === 'associacao') {
                // Questão de associação: para cada pergunta, um select com respostas
                const perguntas = Array.isArray(qData.perguntas) ? qData.perguntas : [];
                const respostas = Array.isArray(qData.respostas) ? qData.respostas : [];
                const selectsHtml = perguntas.map((pergunta, index) => {
                    const options = ['<option value="">Selecione...</option>']
                        .concat(respostas.map((resp, ridx) => {
                            const selected = (Array.isArray(respostaAtual) && respostaAtual[index] !== '' && parseInt(respostaAtual[index]) === ridx) ? 'selected' : '';
                            return `<option value="${ridx}" ${selected}>${resp}</option>`;
                        })).join('');
                    return `
                        <div class="flex items-center gap-3 mb-4">
                            <span class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                ${index + 1}
                            </span>
                            <div class="flex-1">
                                <div class="mb-2 text-gray-800">${pergunta}</div>
                                <select id="assoc_${index}" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                                    onchange="marcarRespostaAssociacao(${numero}, ${index}, this.value)"
                                    data-idquestao="${qData.id_questao}"
                                    ${provaFinalizada ? 'disabled' : ''}
                                >
                                    ${options}
                                </select>
                            </div>
                        </div>
                    `;
                }).join('');
                conteudoQuestao = `
                    <div class="mb-6 text-md md:text-base questao-enunciado leading-relaxed">${enunciadoHtml}</div>
                    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-blue-900 mb-4 text-base md:text-sm">Associe cada item à resposta correspondente:</h4>
                        ${selectsHtml}
                    </div>
                `;
            }

            container.innerHTML = conteudoQuestao;
            
            // Atualizar botões
            gerarBotoesQuestoes();
            atualizarPercentual();
        }

        // Marcar resposta
        function marcarResposta(questaoNumero, opcaoIndex) {
            // Bloquear marcação se a prova já foi finalizada
            if (provaFinalizada || provaBloqueada) {
                return;
            }                        

            // Atualiza estado localmente
            if (!estadoProva.questoes[questaoNumero]) {
                estadoProva.questoes[questaoNumero] = { visitada: true, resposta: null, correta: null };
            }
            estadoProva.questoes[questaoNumero].resposta = opcaoIndex;
            estadoProva.questoes[questaoNumero].visitada = true;

            // Debug: mostrar no console o estado após marcar (ajuda a depurar problemas de status)
            if (window.console && console.debug) {
                console.debug('marcarResposta:', { questaoNumero: questaoNumero, opcaoIndex: opcaoIndex, estado: estadoProva.questoes[questaoNumero] });
            }
            // Salvar resposta via AJAX
            const input = document.querySelector(`#opcao_${questaoNumero}_${opcaoIndex}`);
            if (input) {
                const alternativaKey = input.getAttribute('data-key');
                const idQuestao = parseInt(input.getAttribute('data-idquestao'));
                const formData = new URLSearchParams();
                formData.append('id_tentativa', tentativaId);
                formData.append('id_questao', idQuestao);
                formData.append('alternativa', alternativaKey);
                fetch('https://www.smartprova.com.br/prova/salvar_resposta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                }).catch(console.error);
            }
            gerarBotoesQuestoes();
            atualizarPercentual();
        }

        // Marcar resposta de questão de completar
        function marcarRespostaCompletar(questaoNumero, palavraIndex, valor) {
            // Bloquear marcação se a prova já foi finalizada
            if (provaFinalizada || provaBloqueada) {
                return;
            }
            
            // Inicializar array de respostas se não existir
            if (!Array.isArray(estadoProva.questoes[questaoNumero].resposta)) {
                const qData = questoesData[questaoNumero-1];
                const numPalavras = qData.gabarito_array ? qData.gabarito_array.length : 0;
                estadoProva.questoes[questaoNumero].resposta = Array(numPalavras).fill('');
            }
            
            // Atualizar a palavra específica
            estadoProva.questoes[questaoNumero].resposta[palavraIndex] = valor;
            
            // Salvar resposta via AJAX (enviar array JSON)
            const input = document.getElementById(`palavra${palavraIndex}`);
            if (input) {
                const idQuestao = parseInt(input.getAttribute('data-idquestao'));
                const respostaCompleta = JSON.stringify(estadoProva.questoes[questaoNumero].resposta);
                
                const formData = new URLSearchParams();
                formData.append('id_tentativa', tentativaId);
                formData.append('id_questao', idQuestao);
                formData.append('alternativa', respostaCompleta);
                formData.append('tipo', 'completar');
                
                fetch('https://www.smartprova.com.br/prova/salvar_resposta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                }).catch(console.error);
            }
            
            gerarBotoesQuestoes();
            atualizarPercentual();            
        }

        // Marcar resposta de questão de associação
        function marcarRespostaAssociacao(questaoNumero, perguntaIndex, valorSelecionado) {
            if (provaFinalizada || provaBloqueada) { return; }
            // Inicializar array de respostas se não existir
            if (!Array.isArray(estadoProva.questoes[questaoNumero].resposta)) {
                const qData = questoesData[questaoNumero-1];
                const tamanho = Array.isArray(qData.perguntas) ? qData.perguntas.length : 0;
                estadoProva.questoes[questaoNumero].resposta = Array(tamanho).fill('');
            }
            const idx = (valorSelecionado === '' ? '' : parseInt(valorSelecionado));
            estadoProva.questoes[questaoNumero].resposta[perguntaIndex] = idx;
            // Salvar via AJAX (enviar array JSON)
            const selectEl = document.getElementById(`assoc_${perguntaIndex}`);
            if (selectEl) {
                const idQuestao = parseInt(selectEl.getAttribute('data-idquestao'));
                const respostaMapa = JSON.stringify(estadoProva.questoes[questaoNumero].resposta);
                const formData = new URLSearchParams();
                formData.append('id_tentativa', tentativaId);
                formData.append('id_questao', idQuestao);
                formData.append('alternativa', respostaMapa);
                formData.append('tipo', 'associacao');
                fetch('https://www.smartprova.com.br/prova/salvar_resposta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                }).catch(console.error);
            }
            gerarBotoesQuestoes();
            atualizarPercentual();
        }

        // Atualizar percentual de realização
        function atualizarPercentual() {
            const respondidas = Object.values(estadoProva.questoes).filter(q => q.resposta !== null).length;
            const percentual = Math.round((respondidas / estadoProva.totalQuestoes) * 100);
            document.getElementById('percentual-realizacao').textContent = `${percentual}%`;
        }

        // Event Listeners
        document.getElementById('btnAbrirMenu').addEventListener('click', abrirMenu);
        document.getElementById('btnFecharMenu').addEventListener('click', fecharMenu);
        document.getElementById('overlay').addEventListener('click', fecharMenu);

        document.getElementById('btnEntregar').addEventListener('click', function() {
            if (provaBloqueada) {
                return;
            }
            // Verifica se todas as questões foram respondidas
            const respondidas = Object.values(estadoProva.questoes).filter(q => q.resposta !== null).length;
            if (respondidas === estadoProva.totalQuestoes) {
                document.getElementById('modalConfirmacao').classList.remove('hidden');
            } else {
                document.getElementById('modalAlertaEntrega').classList.remove('hidden');
            }
        });

        // Fechar modal de alerta de entrega incompleta
        document.getElementById('btnFecharAlertaEntrega').addEventListener('click', function() {
            document.getElementById('modalAlertaEntrega').classList.add('hidden');
        });

        document.getElementById('btnCancelar').addEventListener('click', function() {
            document.getElementById('modalConfirmacao').classList.add('hidden');
        });

        // Funções do Spinner Global
        const spinner = document.getElementById('global-spinner');
        const spinnerText = document.getElementById('spinner-text');
        let spinnerTimeout = null;

        function showSpinner(mensagem = 'Carregando...') {
          spinnerText.textContent = mensagem;
          spinnerTimeout = setTimeout(() => {
            spinner.classList.add('active');
          }, 100);
        }

        function hideSpinner() {
          if (spinnerTimeout) {
            clearTimeout(spinnerTimeout);
            spinnerTimeout = null;
          }
          spinner.classList.remove('active');
        }

        document.getElementById('btnConfirmar').addEventListener('click', function() {
            clearInterval(estadoProva.intervaloContador);
            showSpinner('Processando entrega e calculando nota...');
            saindoIntencionalmente = true;
            setTimeout(() => {
                window.location.href = 'https://www.smartprova.com.br/prova/finalizar/' + tentativaId;
            }, 500);
        });

        document.getElementById('btnOkTempo').addEventListener('click', function() {
            document.getElementById('modalTempoEsgotado').classList.add('hidden');
        });

        // Função para confirmar saída
        function confirmarSair() {
            document.getElementById('modalSair').classList.remove('hidden');
        }

        // Event listeners para modal de sair
        document.getElementById('btnCancelarSair').addEventListener('click', function() {
            document.getElementById('modalSair').classList.add('hidden');
        });

        document.getElementById('btnConfirmarSair').addEventListener('click', function() {
            saindoIntencionalmente = true;
            window.location.href = 'https://www.smartprova.com.br/prova/sair';
        });

        document.getElementById('btnIniciarAvaliacaoProtegida').addEventListener('click', function() {
            const btn = this;
            const texto = document.getElementById('textoInicioProtegido');

            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-not-allowed');

            solicitarFullscreen(true).then((ok) => {
                if (!ok) {
                    if (texto) {
                        texto.textContent = 'Não foi possível ativar a tela cheia. Tente novamente para iniciar.';
                    }
                    btn.disabled = false;
                    btn.classList.remove('opacity-70', 'cursor-not-allowed');
                    return;
                }

                aguardandoInicioProtegido = false;
                const modalInicio = document.getElementById('modalInicioProtegido');
                if (modalInicio) {
                    modalInicio.classList.add('hidden');
                }
                iniciarModoProtegido();

                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
            });
        });

        // Enquanto o modal inicial estiver aberto, impede navegação por teclado nas questões.
        document.addEventListener('keydown', function(e) {
            if (!aguardandoInicioProtegido || !modalInicioProtegidoAberto()) {
                return;
            }

            const btnInicio = document.getElementById('btnIniciarAvaliacaoProtegida');
            const focoNoBotaoInicio = btnInicio && document.activeElement === btnInicio;
            const tecla = e.key || '';

            if (focoNoBotaoInicio && (tecla === 'Enter' || tecla === ' ' || tecla === 'Spacebar')) {
                return;
            }

            if (tecla === 'Tab' && btnInicio) {
                e.preventDefault();
                e.stopPropagation();
                btnInicio.focus();
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        }, true);

        document.getElementById('btnContinuarBloqueio').addEventListener('click', function() {
            if (!desbloqueioLiberadoProfessor) {
                return;
            }
            solicitarFullscreen(true);
            setTimeout(() => {
                desbloquearInterfacePorSeguranca();
            }, 200);
        });

        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && estadoProva.menuAberto) {
                fecharMenu();
            }
        });

        // Inicializar a prova
        document.addEventListener('DOMContentLoaded', function() {
            gerarBotoesQuestoes();
            carregarQuestao(1);
            atualizarPercentual(); // Garante estado inicial do botão

            if (modoProtegido && !provaFinalizada) {
                if (tentativaBloqueadaInicial) {
                    iniciarModoProtegido();
                } else {
                    aguardandoInicioProtegido = true;
                    const modalInicio = document.getElementById('modalInicioProtegido');
                    if (modalInicio) {
                        modalInicio.classList.remove('hidden');
                    }
                    const btnInicio = document.getElementById('btnIniciarAvaliacaoProtegida');
                    if (btnInicio) {
                        btnInicio.focus();
                    }
                }
            }

            if (tentativaBloqueadaInicial) {
                bloquearInterfacePorSeguranca('A prova já está bloqueada. Solicite desbloqueio ao professor.');
            }

            // Iniciar contador apenas se a prova não estiver finalizada
            if (!provaFinalizada) {
                estadoProva.intervaloContador = setInterval(atualizarContador, 1000);
                atualizarContador(); // Atualizar imediatamente

                // Sincronizar tempo com servidor a cada 30 segundos
                estadoProva.intervaloSincronizacao = setInterval(sincronizarTempoServidor, 30000);
                sincronizarTempoServidor(); // Sincronizar imediatamente
            }

            // Esconder spinner quando a página terminar de carregar
            window.addEventListener('load', function() {
                hideSpinner();
            });
        });
    