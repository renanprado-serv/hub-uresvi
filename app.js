// =========================================================================
// CONFIGURAÇÃO DA API (GOOGLE APPS SCRIPT)
// =========================================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwomfcB0um2GkgZ9qVkVjuOkyWSHQfBwad2HSQC6agFeym9QAxhc7cftnLLvIsmtYu7/exec';

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
  document.getElementById('badge-status-semestre').textContent = `Semestre ${state.semestreAtual} • ${state.semestreStatus}`;

  const isDir = state.user.perfil === 'DIRIGENTE';
  document.getElementById('kpi-grid').classList.toggle('hidden', !isDir);
  document.getElementById('filtro-semaforo').classList.toggle('hidden', !isDir);
  document.querySelectorAll('.col-dirigente').forEach(el => el.classList.toggle('hidden', !isDir));

  if (isDir && res.kpis) {
    document.getElementById('dash-titulo').textContent = 'Painel de Consolidação Geral — Dirigente';
    document.getElementById('kpi-total').textContent = res.kpis.totalEscolas;
    document.getElementById('kpi-regular').textContent = res.kpis.regular;
    document.getElementById('kpi-atencao').textContent = res.kpis.atencao;
    document.getElementById('kpi-critico').textContent = res.kpis.critico;
  } else {
    document.getElementById('dash-titulo').textContent = 'Minhas Escolas Vinculadas';
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

  const tbody = document.getElementById('tabela-escolas-body');
  tbody.innerHTML = filtradas.map(e => {
    const semClass = e.semaforo === 'Regular' ? 'sem-regular' : (e.semaforo === 'Atenção' ? 'sem-atencao' : 'sem-critico');
    return `
      <tr>
        <td><strong>${e.cie}</strong></td>
        <td>${e.nome}</td>
        <td>${e.municipio || '—'}</td>
        <td>${e.supervisor || '—'}</td>
        <td><span class="glass-pill-badge">${e.statusValidacao}</span></td>
        ${isDir ? `<td><strong>${e.percentual}%</strong></td>` : ''}
        ${isDir ? `<td><span class="badge-semaforo ${semClass}">${e.semaforo}</span></td>` : ''}
        <td>
          <button class="btn-ghost-glass" onclick="abrirEscola('${e.cie}')">Abrir</button>
          ${isDir ? `<button class="btn-primary-glass" onclick="imprimirDireto('${e.cie}')">PDF</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

// =========================================================================
// FORMULÁRIO DA ESCOLA (PREENCHIMENTO POR PERFIL RACI)
// =========================================================================
async function abrirEscola(cie) {
  const res = await callApi({
    action: 'getEscolaDados',
    email: state.email,
    senha: state.senha,
    cie: cie,
    semestre: state.semestreAtual
  });

  if (!res.ok) return showToast(res.error);

  state.escolaAtual = res.dados;
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('escola-view').classList.remove('hidden');

  const isRegional = ['DIRIGENTE', 'SUPERVISOR', 'PEC'].includes(state.user.perfil);
  document.getElementById('btn-voltar-dash').classList.toggle('hidden', !isRegional);
  document.getElementById('btn-imprimir-escola').classList.toggle('hidden', state.user.perfil !== 'DIRIGENTE');

  const esc = res.dados.escola;
  document.getElementById('form-escola-nome').textContent = esc.Nome_Escola;
  document.getElementById('form-escola-meta').textContent =
    `CIE: ${esc.CIE} | Município: ${esc.Municipio} | Supervisor: ${esc.Nome_Supervisor || '—'} | PEC: ${esc.Nome_PEC || '—'}`;

  const bloqueado = res.dados.semestreStatus === 'CONSOLIDADO' && state.user.perfil !== 'DIRIGENTE';
  document.getElementById('aviso-consolidado').classList.toggle('hidden', !bloqueado);
  document.getElementById('btn-salvar-escola').disabled = bloqueado;

  renderFormularioCompleto(res.dados, bloqueado);
}

function renderFormularioCompleto(dados, bloqueado) {
  const perfil = state.user.perfil;
  const container = document.getElementById('form-content-container');
  const tabs = ['tab-eixo1', 'tab-pedagogico', 'tab-clima', 'tab-adm', 'tab-links', 'tab-regional'];

  container.innerHTML = tabs.map((t, idx) => `<div id="${t}" class="tab-panel ${idx === 0 ? 'active' : ''}"></div>`).join('');

  // 1. Renderizar Blocos Numéricos
  NUMERIC_SECTIONS.forEach(sec => {
    const canEdit = !bloqueado && sec.perfisEdit.includes(perfil);
    const html = `
      <div class="glass-card form-block">
        <h3>${sec.titulo}</h3>
        <p class="block-raci">${sec.raci} ${canEdit ? '' : ' • (Somente leitura para seu perfil)'}</p>
        <div class="grid-3">
          ${sec.campos.map(c => `
            <div class="input-group">
              <label for="num_${c.id}">${c.label}</label>
              <input type="${c.type}" id="num_${c.id}" data-num="${c.id}"
                value="${dados.dadosNumericos[c.id] ?? ''}" ${canEdit ? '' : 'disabled'} />
            </div>
          `).join('')}
        </div>
      </div>`;
    document.getElementById(sec.tab).insertAdjacentHTML('beforeend', html);
  });

  // 2. Renderizar os 15 Blocos do Checklist
  CHECKLIST_BLOCKS.forEach(blk => {
    const canEdit = !bloqueado && blk.perfisEdit.includes(perfil);
    const html = `
      <div class="glass-card form-block">
        <h3>${blk.titulo}</h3>
        <p class="block-raci">Perfis autorizados: ${blk.perfisEdit.join(', ')} ${canEdit ? '' : ' • (Somente leitura)'}</p>
        ${blk.itens.map((label, i) => {
          const key = `${blk.id}_${i + 1}`;
          const val = dados.checklist[key] || { status: '', obs: '' };
          return `
            <div class="checklist-row">
              <span>${label}</span>
              <select data-chk-status="${key}" ${canEdit ? '' : 'disabled'}>
                <option value="">Selecione</option>
                <option value="Sim" ${val.status === 'Sim' ? 'selected' : ''}>Sim</option>
                <option value="Não" ${val.status === 'Não' ? 'selected' : ''}>Não</option>
              </select>
              <input type="text" placeholder="Observações..." data-chk-obs="${key}"
                value="${val.obs || ''}" ${canEdit ? '' : 'disabled'} />
            </div>`;
        }).join('')}
      </div>`;
    document.getElementById(blk.tab).insertAdjacentHTML('beforeend', html);
  });

  // 3. Aba de Links de Evidências (Drive)
  const canEditLinks = !bloqueado && ['GOE', 'CGP', 'DIRETOR', 'DIRIGENTE'].includes(perfil);
  document.getElementById('tab-links').innerHTML = `
    <div class="glass-card form-block">
      <h3>Links das Pastas de Evidências (Google Drive)</h3>
      <p class="block-raci">Cole abaixo os links compartilhados com a URE São Vicente.</p>
      <div class="form-stack">
        ${LINKS_EIXOS.map(l => `
          <div class="input-group">
            <label>${l.label}</label>
            <input type="url" placeholder="https://drive.google.com/..." data-link="${l.id}"
              value="${dados.evidenciasLinks[l.id] || ''}" ${canEditLinks ? '' : 'disabled'} />
          </div>
        `).join('')}
      </div>
    </div>`;

  // 4. Aba Gestão Regional (PEC / Supervisor / Dirigente)
  const canEditReg = !bloqueado && ['PEC', 'SUPERVISOR', 'DIRIGENTE'].includes(perfil);
  const canValidate = !bloqueado && ['SUPERVISOR', 'DIRIGENTE'].includes(perfil);
  const reg = dados.gestaoRegional || {};
  document.getElementById('tab-regional').innerHTML = `
    <div class="glass-card form-block">
      <h3>Diagnóstico Situacional, Plano de Ação e Validação</h3>
      <p class="block-raci">Preenchimento: PEC e Supervisor | Validação Final: Supervisor</p>
      <div class="form-stack">
        <div class="input-group">
          <label>Status de Validação da Escola</label>
          <select id="reg_status_validacao" ${canValidate ? '' : 'disabled'}>
            <option value="PENDENTE" ${dados.statusValidacao === 'PENDENTE' ? 'selected' : ''}>Pendente</option>
            <option value="EM_ANALISE" ${dados.statusValidacao === 'EM_ANALISE' ? 'selected' : ''}>Em Análise</option>
            <option value="COM_PENDENCIA" ${dados.statusValidacao === 'COM_PENDENCIA' ? 'selected' : ''}>Devolvido com Pendência</option>
            <option value="VALIDADO" ${dados.statusValidacao === 'VALIDADO' ? 'selected' : ''}>Validado pelo Supervisor</option>
          </select>
        </div>
        <div class="input-group">
          <label>Diagnóstico Situacional da Unidade Escolar</label>
          <textarea rows="5" id="reg_diagnostico" ${canEditReg ? '' : 'disabled'}>${reg.diagnostico || ''}</textarea>
        </div>
        <div class="input-group">
          <label>Plano de Ação e Fragilidades Identificadas</label>
          <textarea rows="5" id="reg_plano_acao" ${canEditReg ? '' : 'disabled'}>${reg.planoAcao || ''}</textarea>
        </div>
        <div class="input-group">
          <label>Encaminhamentos / Parecer da Supervisão</label>
          <textarea rows="4" id="reg_parecer" ${canValidate ? '' : 'disabled'}>${reg.parecer || ''}</textarea>
        </div>
      </div>
    </div>`;
}

async function salvarDadosEscola() {
  const dadosNumericos = {};
  document.querySelectorAll('[data-num]:not(:disabled)').forEach(el => {
    dadosNumericos[el.dataset.num] = el.value;
  });

  const checklist = {};
  document.querySelectorAll('[data-chk-status]:not(:disabled)').forEach(el => {
    const key = el.dataset.chkStatus;
    const obsEl = document.querySelector(`[data-chk-obs="${key}"]`);
    checklist[key] = { status: el.value, obs: obsEl ? obsEl.value : '' };
  });

  const evidenciasLinks = {};
  document.querySelectorAll('[data-link]:not(:disabled)').forEach(el => {
    evidenciasLinks[el.dataset.link] = el.value;
  });

  const gestaoRegional = {};
  const diag = document.getElementById('reg_diagnostico');
  const plano = document.getElementById('reg_plano_acao');
  const parecer = document.getElementById('reg_parecer');
  if (diag && !diag.disabled) gestaoRegional.diagnostico = diag.value;
  if (plano && !plano.disabled) gestaoRegional.planoAcao = plano.value;
  if (parecer && !parecer.disabled) gestaoRegional.parecer = parecer.value;

  const statusValEl = document.getElementById('reg_status_validacao');
  const statusValidacao = (statusValEl && !statusValEl.disabled) ? statusValEl.value : null;

  const res = await callApi({
    action: 'salvarEscolaDados',
    email: state.email,
    senha: state.senha,
    cie: state.escolaAtual.escola.CIE,
    semestre: state.semestreAtual,
    dados: { dadosNumericos, checklist, evidenciasLinks, gestaoRegional, statusValidacao }
  });

  if (res.ok) {
    showToast(res.mensagem);
  } else {
    showToast(res.error || 'Erro ao salvar.');
  }
}

async function consolidarSemestreAtual() {
  if (!confirm(`Deseja realmente CONSOLIDAR e BLOQUEAR o semestre ${state.semestreAtual}?`)) return;
  const res = await callApi({
    action: 'consolidarSemestre',
    email: state.email,
    senha: state.senha,
    semestre: state.semestreAtual
  });
  if (res.ok) {
    showToast(res.mensagem);
    carregarDashboard();
  } else {
    showToast(res.error);
  }
}

// =========================================================================
// RELATÓRIO DIAGNÓSTICO EM PDF (EXCLUSIVO DIRIGENTE)
// =========================================================================
async function imprimirDireto(cie) {
  const res = await callApi({
    action: 'getEscolaDados',
    email: state.email,
    senha: state.senha,
    cie: cie,
    semestre: state.semestreAtual
  });
  if (res.ok) imprimirRelatorioPDF(res.dados);
}

function imprimirRelatorioPDF(dados) {
  const esc = dados.escola;
  const num = dados.dadosNumericos || {};
  const reg = dados.gestaoRegional || {};
  const links = dados.evidenciasLinks || {};

  const printArea = document.getElementById('print-area');
  printArea.innerHTML = `
    <div class="print-header">
      <p>GOVERNO DO ESTADO DE SÃO PAULO • SECRETARIA DE ESTADO DA EDUCAÇÃO</p>
      <h1>UNIDADE REGIONAL DE ENSINO DE SÃO VICENTE</h1>
      <p><strong>Relatório Diagnóstico do Plano de Evidências Escolar — Semestre ${dados.semestre}</strong></p>
    </div>

    <div class="print-section">
      <h2>1. Identificação e Situação Geral</h2>
      <table class="print-table">
        <tr><th>Escola</th><td>${esc.Nome_Escola}</td><th>CIE</th><td>${esc.CIE}</td></tr>
        <tr><th>Município</th><td>${esc.Municipio}</td><th>Validação</th><td>${dados.statusValidacao}</td></tr>
        <tr><th>Supervisor</th><td>${esc.Nome_Supervisor || '—'}</td><th>PEC</th><td>${esc.Nome_PEC || '—'}</td></tr>
        <tr><th>Preenchimento Checklist</th><td><strong>${dados.percentual ?? 0}%</strong></td><th>Semáforo Situacional</th><td><strong>${dados.semaforo || 'Crítico'}</strong></td></tr>
      </table>
    </div>

    <div class="print-section">
      <h2>2. Indicadores Quantitativos (Atendimento, BI Educação e Prova Paulista)</h2>
      <table class="print-table">
        <tr>
          <th>Total Estudantes</th><td>${num.total_estudantes || '—'}</td>
          <th>Turmas</th><td>${num.qtd_turmas || '—'}</td>
          <th>Ed. Especial</th><td>${num.alunos_ed_especial || '—'}</td>
        </tr>
        <tr>
          <th>Frequência Geral BI</th><td>${num.bi_freq_geral || '—'}%</td>
          <th>Aprovação</th><td>${num.bi_aprovacao || '—'}%</td>
          <th>Abandono</th><td>${num.bi_abandono || '—'}%</td>
        </tr>
        <tr>
          <th>Prova Paulista Partic.</th><td>${num.pp_participacao || '—'}%</td>
          <th>LP Abaixo Básico</th><td>${num.pp_lp_abaixo || '—'}%</td>
          <th>Mat Abaixo Básico</th><td>${num.pp_mat_abaixo || '—'}%</td>
        </tr>
        <tr>
          <th>Infrequentes (Busca Ativa)</th><td>${num.ba_infrequentes || '—'}</td>
          <th>Reinseridos</th><td>${num.ba_reinseridos || '—'}</td>
          <th>Total Ocorrências</th><td>${num.oc_total || '—'}</td>
        </tr>
      </table>
    </div>

    <div class="print-section">
      <h2>3. Diagnóstico Situacional e Plano de Ação</h2>
      <p><strong>Diagnóstico:</strong><br/>${(reg.diagnostico || 'Não informado.').replace(/\n/g, '<br/>')}</p><br/>
      <p><strong>Plano de Ação:</strong><br/>${(reg.planoAcao || 'Não informado.').replace(/\n/g, '<br/>')}</p><br/>
      <p><strong>Parecer da Supervisão:</strong><br/>${(reg.parecer || 'Não informado.').replace(/\n/g, '<br/>')}</p>
    </div>

    <div class="print-section">
      <h2>4. Links das Pastas de Evidências</h2>
      <table class="print-table">
        ${LINKS_EIXOS.map(l => `<tr><th>${l.label}</th><td>${links[l.id] || 'Não informado'}</td></tr>`).join('')}
      </table>
    </div>
  `;

  window.print();
}

// Utilitários de UI
function showLoader(txt) {
  document.getElementById('loader-text').textContent = txt || 'Carregando...';
  document.getElementById('loader').classList.remove('hidden');
}
function hideLoader() { document.getElementById('loader').classList.add('hidden'); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3500);
}
