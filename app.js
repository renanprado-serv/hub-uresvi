// =========================================================================
// CONFIGURAÇÃO DA API (GOOGLE APPS SCRIPT)
// =========================================================================
const API_URL = 'COLE_AQUI_SUA_URL_DO_APPS_SCRIPT';

// Estado global da aplicação
const state = {
  email: '',
  senha: '',
  user: null,
  semestres: [],
  semestreAtual: '',
  semestreStatus: 'ABERTO',
  escolas: [],
  escolaAtual: null
};

// =========================================================================
// ESQUEMA DOS CAMPOS NUMÉRICOS E DOS 15 BLOCOS DO CHECKLIST (MATRIZ RACI)
// =========================================================================
const NUMERIC_SECTIONS = [
  {
    tab: 'tab-eixo1',
    titulo: 'Eixo 1 — Dados de Atendimento e Recursos Humanos',
    raci: 'Responsável: GOE/Secretaria | Aprovação: Diretor',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    campos: [
      { id: 'total_estudantes', label: 'Total de Estudantes', type: 'number' },
      { id: 'alunos_ai', label: 'Anos Iniciais', type: 'number' },
      { id: 'alunos_af', label: 'Anos Finais', type: 'number' },
      { id: 'alunos_em', label: 'Ensino Médio', type: 'number' },
      { id: 'alunos_eja', label: 'EJA', type: 'number' },
      { id: 'qtd_turmas', label: 'Quantidade de Turmas', type: 'number' },
      { id: 'taxa_ocupacao', label: 'Taxa de Ocupação das Salas (%)', type: 'number' },
      { id: 'alunos_ed_especial', label: 'Público-Alvo Ed. Especial', type: 'number' },
      { id: 'docentes_efetivos', label: 'Docentes Efetivos', type: 'number' },
      { id: 'docentes_cat_o', label: 'Docentes Categoria O', type: 'number' },
      { id: 'docentes_contratados', label: 'Docentes Contratados', type: 'number' },
      { id: 'func_adm', label: 'Funcionários Administrativos', type: 'number' },
      { id: 'func_terceirizados', label: 'Funcionários Terceirizados', type: 'number' }
    ]
  },
  {
    tab: 'tab-pedagogico',
    titulo: 'Eixos 3 e 4 — Indicadores BI Educação e Prova Paulista',
    raci: 'Responsável: CGP/CGPG | Aprovação: Diretor',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    campos: [
      { id: 'bi_freq_geral', label: 'Frequência Geral BI (%)', type: 'number' },
      { id: 'bi_aprovacao', label: 'Taxa de Aprovação (%)', type: 'number' },
      { id: 'bi_reprovacao', label: 'Taxa de Reprovação (%)', type: 'number' },
      { id: 'bi_abandono', label: 'Taxa de Abandono (%)', type: 'number' },
      { id: 'bi_defasagem', label: 'Defasagem Idade/Série (%)', type: 'number' },
      { id: 'bi_recuperacao', label: 'Estudantes em Recuperação (Qtd)', type: 'number' },
      { id: 'pp_participacao', label: 'Prova Paulista — Participação (%)', type: 'number' },
      { id: 'pp_lp_abaixo', label: 'LP — Abaixo do Básico (%)', type: 'number' },
      { id: 'pp_lp_basico', label: 'LP — Básico (%)', type: 'number' },
      { id: 'pp_lp_adequado', label: 'LP — Adequado (%)', type: 'number' },
      { id: 'pp_lp_avancado', label: 'LP — Avançado (%)', type: 'number' },
      { id: 'pp_mat_abaixo', label: 'Matemática — Abaixo do Básico (%)', type: 'number' },
      { id: 'pp_mat_basico', label: 'Matemática — Básico (%)', type: 'number' },
      { id: 'pp_mat_adequado', label: 'Matemática — Adequado (%)', type: 'number' },
      { id: 'pp_mat_avancado', label: 'Matemática — Avançado (%)', type: 'number' }
    ]
  },
  {
    tab: 'tab-clima',
    titulo: 'Eixos 8 e 9 — Busca Ativa e Ocorrências Escolares',
    raci: 'Responsável: GOE/Secretaria e CGP | Aprovação: Diretor',
    perfisEdit: ['GOE', 'CGP', 'DIRETOR', 'DIRIGENTE'],
    campos: [
      { id: 'ba_infrequentes', label: 'Estudantes Infrequentes (Qtd)', type: 'number' },
      { id: 'ba_em_busca', label: 'Em Busca Ativa (Qtd)', type: 'number' },
      { id: 'ba_reinseridos', label: 'Estudantes Reinseridos (Qtd)', type: 'number' },
      { id: 'ba_pendentes', label: 'Casos Pendentes (Qtd)', type: 'number' },
      { id: 'oc_total', label: 'Total de Ocorrências no Semestre', type: 'number' },
      { id: 'oc_reincidencias', label: 'Ocorrências Reincidentes', type: 'number' }
    ]
  }
];

const CHECKLIST_BLOCKS = [
  {
    id: 'b1', tab: 'tab-eixo1', titulo: '1. Identificação e Caracterização da Escola',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Dados gerais da escola atualizados', 'Quantidade total de estudantes atualizada',
      'Quantidade de turmas por segmento', 'Quantidade de docentes',
      'Quantidade de funcionários', 'Organograma da equipe gestora atualizado',
      'Relação de estudantes elegíveis à Educação Especial'
    ]
  },
  {
    id: 'b2', tab: 'tab-pedagogico', titulo: '2. BI Educação',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Relatório de frequência geral', 'Relatório de frequência por turma',
      'Taxa de aprovação atualizada', 'Taxa de reprovação atualizada',
      'Taxa de abandono atualizada', 'Relatório de fluxo escolar',
      'Defasagem idade-série analisada', 'Plano de ação para indicadores críticos'
    ]
  },
  {
    id: 'b3', tab: 'tab-pedagogico', titulo: '3. Prova Paulista e Aprendizagem',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Resultado consolidado da Prova Paulista', 'Comparativo com a regional',
      'Comparativo com o Estado', 'Níveis de proficiência em Língua Portuguesa',
      'Níveis de proficiência em Matemática', 'Relação de estudantes abaixo do básico',
      'Plano de recomposição elaborado', 'Evidências das intervenções pedagógicas'
    ]
  },
  {
    id: 'b4', tab: 'tab-pedagogico', titulo: '4. Conselho de Classe e Série',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Cronograma anual existente', 'Atas assinadas e arquivadas',
      'Registros de encaminhamentos', 'Monitoramento dos estudantes críticos',
      'Plano de intervenção registrado'
    ]
  },
  {
    id: 'b12', tab: 'tab-pedagogico', titulo: '12. ATPCs e Formação Docente',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Cronograma anual de ATPCs', 'Pautas arquivadas', 'Listas de presença',
      'Registros das formações', 'Estudo do BI Educação realizado',
      'Estudo da Prova Paulista realizado', 'Plano de ação decorrente das ATPCs'
    ]
  },
  {
    id: 'b13', tab: 'tab-pedagogico', titulo: '13. Orientações a Professores e Funcionários',
    perfisEdit: ['CGP', 'GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Reuniões pedagógicas registradas', 'Orientações aos professores documentadas',
      'Reuniões com funcionários realizadas', 'Protocolos internos divulgados',
      'Plano de comunicação interna implementado'
    ]
  },
  {
    id: 'b5', tab: 'tab-clima', titulo: '5. Conselho de Escola',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Conselho constituído regularmente', 'Processo eleitoral documentado',
      'Calendário de reuniões atualizado', 'Atas assinadas', 'Deliberações acompanhadas'
    ]
  },
  {
    id: 'b6', tab: 'tab-clima', titulo: '6. Grêmio Estudantil',
    perfisEdit: ['CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Grêmio constituído', 'Ata de eleição arquivada', 'Estatuto atualizado',
      'Plano de ação elaborado', 'Reuniões registradas'
    ]
  },
  {
    id: 'b7', tab: 'tab-clima', titulo: '7. Busca Ativa',
    perfisEdit: ['GOE', 'CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Relação de estudantes infrequentes', 'Fichas de acompanhamento',
      'Registros de contato com famílias', 'Registros de visitas domiciliares',
      'Encaminhamentos à rede de proteção', 'Relatório de resultados da busca ativa'
    ]
  },
  {
    id: 'b8', tab: 'tab-clima', titulo: '8. Ocorrências e Clima Escolar',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Tipificação das ocorrências', 'Relatório consolidado de ocorrências',
      'Plano preventivo implementado', 'Registros de mediação de conflitos',
      'Acompanhamento de reincidências'
    ]
  },
  {
    id: 'b9', tab: 'tab-adm', titulo: '9. Prestação de Contas e Gestão Financeira',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Prestação de contas APM atualizada', 'Prestação de contas PDDE atualizada',
      'Extratos financeiros organizados', 'Balancetes arquivados',
      'Parecer do Conselho Fiscal', 'Atas de aprovação das contas'
    ]
  },
  {
    id: 'b10', tab: 'tab-adm', titulo: '10. Vida Funcional',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Quadro de pessoal atualizado', 'Relação de afastamentos', 'Relação de licenças',
      'Designações atualizadas', 'Acúmulos regularizados', 'Documentação funcional organizada'
    ]
  },
  {
    id: 'b11', tab: 'tab-adm', titulo: '11. Pasta de Evidências',
    perfisEdit: ['GOE', 'CGP', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Pasta digital organizada por eixo', 'Pasta compartilhada com Supervisor',
      'Pasta compartilhada com PEC', 'Evidências nomeadas e datadas',
      'Atualização mensal realizada'
    ]
  },
  {
    id: 'b14', tab: 'tab-adm', titulo: '14. Infraestrutura, Limpeza e Organização',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Salas organizadas', 'Secretaria organizada', 'Sala dos professores organizada',
      'Banheiros em condições adequadas', 'Cozinha organizada',
      'Ambientes acessíveis', 'Plano de manutenção registrado'
    ]
  },
  {
    id: 'b15', tab: 'tab-adm', titulo: '15. Controle da Merenda Escolar',
    perfisEdit: ['GOE', 'DIRETOR', 'DIRIGENTE'],
    itens: [
      'Estoque atualizado', 'Controle de entrada e saída', 'Produtos dentro da validade',
      'Cardápio afixado', 'Controle de refeições servidas',
      'Registros de desperdício', 'Cozinha em conformidade sanitária'
    ]
  }
];

const LINKS_EIXOS = [
  { id: 'link_pasta_geral', label: 'Link da Pasta Geral da Escola (Google Drive)' },
  { id: 'link_bi_prova', label: 'Link Evidências BI Educação e Prova Paulista' },
  { id: 'link_atpc_conselhos', label: 'Link Evidências ATPCs, Conselhos e Grêmio' },
  { id: 'link_busca_clima', label: 'Link Evidências Busca Ativa e Ocorrências' },
  { id: 'link_adm_merenda', label: 'Link Evidências Prestação de Contas, Vida Funcional e Merenda' }
];

// =========================================================================
// COMUNICAÇÃO COM A API
// =========================================================================
async function callApi(payload) {
  showLoader('Sincronizando com a URE São Vicente...');
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    hideLoader();
    return json;
  } catch (err) {
    hideLoader();
    showToast('Erro de conexão com o servidor.');
    return { ok: false, error: err.message };
  }
}

// =========================================================================
// INICIALIZAÇÃO E EVENTOS
// =========================================================================
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value.trim();
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  const res = await callApi({ action: 'login', email, senha });
  if (!res.ok) {
    errEl.textContent = res.error || 'Falha no login.';
    errEl.classList.remove('hidden');
    return;
  }

  state.email = email;
  state.senha = senha;
  state.user = res.user;
  state.semestres = res.semestres || [];
  state.semestreAtual = res.semestreAtivo;

  iniciarApp();
});

document.getElementById('btn-logout').addEventListener('click', () => location.reload());
document.getElementById('select-semestre').addEventListener('change', (e) => {
  state.semestreAtual = e.target.value;
  carregarTelaInicial();
});
document.getElementById('btn-voltar-dash').addEventListener('click', () => carregarDashboard());
document.getElementById('btn-salvar-escola').addEventListener('click', salvarDadosEscola);
document.getElementById('btn-imprimir-escola').addEventListener('click', () => imprimirRelatorioPDF(state.escolaAtual));
document.getElementById('btn-consolidar').addEventListener('click', consolidarSemestreAtual);

['filtro-busca', 'filtro-municipio', 'filtro-supervisor', 'filtro-semaforo'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderTabelaEscolas);
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function iniciarApp() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('app-view').classList.remove('hidden');
  document.getElementById('user-nome').textContent = state.user.nome;
  document.getElementById('user-perfil').textContent = state.user.perfil;

  const sel = document.getElementById('select-semestre');
  sel.innerHTML = state.semestres.map(s => `<option value="${s.Semestre}">${s.Semestre} (${s.Status})</option>`).join('');
  sel.value = state.semestreAtual;

  if (state.user.perfil === 'DIRIGENTE') {
    document.getElementById('btn-consolidar').classList.remove('hidden');
  }

  carregarTelaInicial();
}

function carregarTelaInicial() {
  const p = state.user.perfil;
  if (['DIRIGENTE', 'SUPERVISOR', 'PEC'].includes(p)) {
    carregarDashboard();
  } else {
    abrirEscola(state.user.cie);
  }
}

// =========================================================================
// DASHBOARD (DIRIGENTE, SUPERVISOR E PEC)
// =========================================================================
async function carregarDashboard() {
  document.getElementById('escola-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');

  const res = await callApi({
    action: 'getDashboard',
    email: state.email,
    senha: state.senha,
    semestre: state.semestreAtual
  });

  if (!res.ok) return showToast(res.error);

  state.escolas = res.escolas || [];
  state.semestreStatus = res.semestreInfo?.Status || 'ABERTO';

  const isDir = state.user.perfil === 'DIRIGENTE';
  document.getElementById('kpi-grid').classList.toggle('hidden', !isDir);
  document.getElementById('filtro-semaforo').classList.toggle('hidden', !isDir);

  if (isDir && res.kpis) {
    document.getElementById('kpi-total').textContent = res.kpis.totalEscolas;
    document.getElementById('kpi-regular').textContent = res.kpis.regular;
    document.getElementById('kpi-atencao').textContent = res.kpis.atencao;
    document.getElementById('kpi-critico').textContent = res.kpis.critico;
  }

  popularFiltrosDashboard();
  renderTabelaEscolas();
}

function popularFiltrosDashboard() {
  const munis = [...new Set(state.escolas.map(e => e.municipio).filter(Boolean))].sort();
  const sups = [...new Set(state.escolas.map(e => e.supervisor).filter(Boolean))].sort();

  document.getElementById('filtro-municipio').innerHTML =
    '<option value="">Todos os Municípios</option>' + munis.map(m => `<option value="${m}">${m}</option>`).join('');
  document.getElementById('filtro-supervisor').innerHTML =
    '<option value="">Todos os Supervisores</option>' + sups.map(s => `<option value="${s}">${s}</option>`).join('');
}

function renderTabelaEscolas() {
  const busca = document.getElementById('filtro-busca').value.toLowerCase();
  const muni = document.getElementById('filtro-municipio').value;
  const sup = document.getElementById('filtro-supervisor').value;
  const sem = document.getElementById('filtro-semaforo').value;
  const isDir = state.user.perfil === 'DIRIGENTE';

  const filtradas = state.escolas.filter(e => {
    const matchBusca = !busca || e.nome.toLowerCase().includes(busca) || String(e.cie).includes(busca);
    const matchMuni = !muni || e.municipio === muni;
    const matchSup = !sup || e.supervisor === sup;
    const matchSem = !isDir || !sem || e.semaforo === sem;
    return matchBusca && matchMuni && matchSup && matchSem;
  });

  const container = document.getElementById('lista-escolas-cards');
  if (!filtradas.length) {
    container.innerHTML = `<div class="glass-card" style="padding:28px;text-align:center;color:#64748b;">Nenhuma unidade escolar encontrada.</div>`;
    return;
  }

  container.innerHTML = filtradas.map(e => {
    const semClass = e.semaforo === 'Regular' ? 'sem-regular' : (e.semaforo === 'Atenção' ? 'sem-atencao' : 'sem-critico');
    return `
      <div class="school-card">
        <div>
          <div class="school-title">${e.nome}</div>
          <div class="school-meta">CIE: ${e.cie} • ${e.municipio \vert{}\vert{} '—'} • Sup: ${e.supervisor || '—'}</div>
        </div>

        <div class="progress-box">
          ${isDir ? `
            <div class="progress-labels">
              <span>${e.percentual}% preenchido</span>
              <span>Validação: ${e.statusValidacao}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${e.percentual}%"></div>
            </div>
          ` : `
            <div><span class="badge-soft badge-blue">Status: ${e.statusValidacao}</span></div>
          `}
        </div>

        <div class="school-right">
          ${isDir ? `<span class="badge-soft ${semClass}">${e.semaforo}</span>` : ''}
          <div class="school-actions-row">
            <button class="btn-outline-blue" onclick="abrirEscola('${e.cie}')">Ver Detalhes</button>
            ${isDir ?
