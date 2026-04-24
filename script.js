const WHATSAPP_NUMBER = "5516997424912";

const plans = {
  essencial: {
    name: "Essencial",
    price: "R$ 399,90",
    slug: "essencial",
    positioning: "Ideal para empresas que precisam manter presença profissional nas redes sociais com conteúdo, organização e campanhas básicas de atração.",
    features: [
      "8 posts mensais, entre imagens ou vídeos",
      "Artes profissionais alinhadas à identidade da marca",
      "Criação de textos com copy estratégica",
      "Padronização visual do perfil",
      "Publicação e organização do conteúdo",
      "Criação e gestão de anúncios",
      "Relatórios simples, claros e objetivos",
      "Sem contrato de fidelização"
    ],
    note: "Plano sem fidelização. O cliente pode solicitar cancelamento conforme as regras do contrato."
  },
  estrategico: {
    name: "Estratégico",
    price: "R$ 549,90",
    slug: "estrategico",
    positioning: "Plano para empresas que querem presença digital mais forte, conteúdo estratégico, tráfego pago e melhor posicionamento para atrair clientes.",
    features: [
      "12 posts mensais",
      "Conteúdos planejados para alcance, autoridade e conversão",
      "Gestão completa das redes sociais",
      "Presença no Google ou LinkedIn",
      "Tráfego pago estratégico",
      "Calendário mensal de conteúdo",
      "Análise de métricas e relatórios objetivos",
      "Reunião estratégica mensal"
    ],
    note: "Plano sem fidelização. Pagamento pode ser feito em valor cheio ou dividido em 2x no mês."
  },
  autoridade: {
    name: "Autoridade",
    price: "R$ 969,90",
    slug: "autoridade",
    positioning: "Plano para marcas que precisam crescer com mais volume de conteúdo, posicionamento forte e acompanhamento estratégico contínuo.",
    features: [
      "Mais de 16 conteúdos por mês, entre imagens e vídeos",
      "Máximo de 25 artes mensais",
      "Planejamento, roteiros e ajustes constantes",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Administração de site e páginas estratégicas",
      "Estratégias de crescimento e escala",
      "Acompanhamento estratégico com reuniões e análises"
    ],
    note: "Plano sem fidelização. Pagamento pode ser feito em valor cheio ou dividido em 2x no mês."
  },
  autoridadeLanding: {
    name: "Autoridade + Landing Page",
    price: "R$ 1.119,99",
    slug: "autoridade-landing-page",
    positioning: "Plano para marcas que querem conteúdo, posicionamento, tráfego e landing pages voltadas para captação de leads e conversão.",
    features: [
      "Mais de 16 conteúdos por mês, entre imagens e vídeos",
      "Máximo de 25 artes mensais",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Criação e cuidado de landing pages estratégicas",
      "Campanhas voltadas para captação de leads",
      "Crescimento e escala com base em dados",
      "Acompanhamento estratégico contínuo"
    ],
    note: "Plano com contrato de fidelização de 12 meses. Pagamento pode ser feito em valor cheio ou dividido em 2x no mês."
  },
  autoridadeSites: {
    name: "Autoridade + Site",
    price: "R$ 1.219,90",
    slug: "autoridade-sites",
    positioning: "Plano completo para marcas que precisam de presença digital forte, conteúdo estratégico, campanhas e estrutura de site voltada para conversão.",
    features: [
      "Mais de 16 conteúdos por mês, entre imagens e vídeos",
      "Máximo de 25 artes mensais",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Cuidado e criação de páginas estratégicas no site",
      "Estratégias para captação de leads e campanhas",
      "Otimizações constantes com base em dados",
      "Reuniões, análises e direcionamento contínuo"
    ],
    note: "Plano com contrato de fidelização de 12 meses. Pagamento pode ser feito em valor cheio ou dividido em 2x no mês."
  }
};

const els = {
  planSelect: document.getElementById("planSelect"),
  clientName: document.getElementById("clientName"),
  contractUrl: document.getElementById("contractUrl"),
  saveConfig: document.getElementById("saveConfig"),
  heroPlan: document.getElementById("heroPlan"),
  heroPrice: document.getElementById("heroPrice"),
  planName: document.getElementById("planName"),
  planPrice: document.getElementById("planPrice"),
  planPositioning: document.getElementById("planPositioning"),
  featuresList: document.getElementById("featuresList"),
  contractNote: document.getElementById("contractNote"),
  contractButton: document.getElementById("contractButton"),
  whatsappButton: document.getElementById("whatsappButton"),
  whatsappTop: document.getElementById("whatsappTop")
};

function init() {
  Object.entries(plans).forEach(([key, plan]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${plan.name} — ${plan.price}/mês`;
    els.planSelect.appendChild(option);
  });

  const savedUrl = localStorage.getItem("axis1_contract_url") || "";
  els.contractUrl.value = savedUrl;

  const params = new URLSearchParams(window.location.search);
  const planFromUrl = params.get("plano");
  if (planFromUrl) {
    const foundKey = Object.keys(plans).find(key => plans[key].slug === planFromUrl || key === planFromUrl);
    if (foundKey) els.planSelect.value = foundKey;
  } else {
    els.planSelect.value = "estrategico";
  }

  els.planSelect.addEventListener("change", renderPlan);
  els.clientName.addEventListener("input", renderPlan);
  els.contractUrl.addEventListener("input", () => {
    localStorage.setItem("axis1_contract_url", els.contractUrl.value.trim());
    renderPlan();
  });
  els.saveConfig.addEventListener("click", () => {
    localStorage.setItem("axis1_contract_url", els.contractUrl.value.trim());
    els.saveConfig.textContent = "Link salvo ✓";
    setTimeout(() => els.saveConfig.textContent = "Salvar link", 1600);
    renderPlan();
  });

  renderPlan();
}

function renderPlan() {
  const plan = plans[els.planSelect.value];
  const client = els.clientName.value.trim();
  const contractBase = normalizeUrl(els.contractUrl.value.trim());

  els.heroPlan.textContent = plan.name;
  els.heroPrice.textContent = `${plan.price}/mês`;
  els.planName.textContent = plan.name;
  els.planPrice.innerHTML = `${plan.price}<span>/mês</span>`;
  els.planPositioning.textContent = plan.positioning;
  els.contractNote.textContent = plan.note;

  els.featuresList.innerHTML = "";
  plan.features.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    els.featuresList.appendChild(li);
  });

  const contractLink = contractBase
    ? `${contractBase}?plano=${encodeURIComponent(plan.slug)}${client ? `&cliente=${encodeURIComponent(client)}` : ""}`
    : `#`;
  els.contractButton.href = contractLink;
  els.contractButton.title = contractBase ? "Abrir contrato" : "Preencha o link do gerador de contratos ao lado";

  const message = client
    ? `Olá! Segue a proposta do plano ${plan.name} para ${client}. Posso te ajudar com alguma dúvida?`
    : `Olá! Segue a proposta do plano ${plan.name}. Posso te ajudar com alguma dúvida?`;

  const whatsUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  els.whatsappButton.href = whatsUrl;
  els.whatsappTop.href = whatsUrl;
}

function normalizeUrl(url) {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) + "/" : url + "/";
}

init();
