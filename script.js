const AXIS_WHATSAPP = "5516997424912";

const plans = [
  {
    id: "essencial",
    name: "Plano Essencial",
    price: "R$ 399,90/mês",
    items: [
      "8 posts mensais, entre imagens ou vídeos",
      "Artes profissionais alinhadas à identidade da marca",
      "Gestão completa do perfil e publicação dos conteúdos",
      "Criação e gestão de anúncios",
      "Relatórios simples e objetivos",
      "Sem contrato de fidelização"
    ]
  },
  {
    id: "estrategico",
    name: "Plano Estratégico",
    price: "R$ 549,90/mês",
    items: [
      "12 posts mensais planejados para alcance, autoridade e conversão",
      "Gestão completa das redes sociais",
      "Presença no Google ou LinkedIn",
      "Tráfego pago estratégico",
      "Planejamento mensal e reunião estratégica",
      "Sem contrato de fidelização"
    ]
  },
  {
    id: "autoridade",
    name: "Plano Autoridade",
    price: "R$ 969,90/mês",
    items: [
      "16+ conteúdos por mês, com limite de até 25 artes",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Administração de site e páginas estratégicas",
      "Crescimento, escala e acompanhamento estratégico",
      "Sem contrato de fidelização"
    ]
  },
  {
    id: "autoridade-landing",
    name: "Autoridade + Landing Page",
    price: "R$ 1.119,99/mês",
    items: [
      "16+ conteúdos por mês, com limite de até 25 artes",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Criação de landing pages para captação de leads",
      "Crescimento, escala e acompanhamento estratégico",
      "Contrato de fidelização de 1 ano"
    ]
  },
  {
    id: "autoridade-site",
    name: "Autoridade + Site",
    price: "R$ 1.219,90/mês",
    items: [
      "16+ conteúdos por mês, com limite de até 25 artes",
      "Gestão completa do Instagram",
      "Posicionamento de marca",
      "Criação e administração de site e páginas estratégicas",
      "Crescimento, escala e acompanhamento estratégico",
      "Contrato de fidelização de 1 ano"
    ]
  }
];

let selectedPlan = null;

const plansEl = document.getElementById("plans");
const selectedPlanBox = document.getElementById("selectedPlanBox");
const selectedPlanName = document.getElementById("selectedPlanName");
const selectedPlanPrice = document.getElementById("selectedPlanPrice");
const selectedPlanItems = document.getElementById("selectedPlanItems");
const formSection = document.getElementById("formSection");
const choosePlanBtn = document.getElementById("choosePlanBtn");
const backBtn = document.getElementById("backBtn");
const clientForm = document.getElementById("clientForm");
const successBox = document.getElementById("successBox");

const onlyDigits = value => (value || "").replace(/\D/g, "");

function formatCPF(value) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCNPJ(value) {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatDocument(value) {
  const digits = onlyDigits(value);
  return digits.length <= 11 ? formatCPF(digits) : formatCNPJ(digits);
}

function formatCEP(value) {
  return onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCPF(cpf) {
  cpf = onlyDigits(cpf);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function isValidCNPJ(cnpj) {
  cnpj = onlyDigits(cnpj);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const calc = (base, weights) => {
    const sum = base.split("").reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const digit1 = calc(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  const digit2 = calc(cnpj.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
}

function isValidDocument(value) {
  const digits = onlyDigits(value);
  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || "").trim());
}

function setFieldError(name, message = "") {
  const input = clientForm.elements[name];
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (error) error.textContent = message;
  if (input) input.classList.toggle("invalid", Boolean(message));
}

function clearErrors() {
  ["nome", "documento", "cep", "endereco", "cidade", "whatsapp", "email"].forEach(name => setFieldError(name));
}

function validateForm(data) {
  clearErrors();
  let valid = true;

  if ((data.nome || "").trim().length < 3) {
    setFieldError("nome", "Informe o nome completo ou razão social.");
    valid = false;
  }
  if (!isValidDocument(data.documento)) {
    setFieldError("documento", "Informe um CPF ou CNPJ válido.");
    valid = false;
  }
  if (onlyDigits(data.cep).length !== 8) {
    setFieldError("cep", "Informe um CEP válido com 8 números.");
    valid = false;
  }
  if ((data.endereco || "").trim().length < 8) {
    setFieldError("endereco", "Informe rua, número e complemento, se houver.");
    valid = false;
  }
  if (!/^[A-Za-zÀ-ÿ\s]+\/[A-Z]{2}$/.test((data.cidade || "").trim())) {
    setFieldError("cidade", "Use o formato Cidade/UF. Ex: Araraquara/SP.");
    valid = false;
  }
  const phoneDigits = onlyDigits(data.whatsapp);
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    setFieldError("whatsapp", "Informe um WhatsApp válido com DDD.");
    valid = false;
  }
  if (!isValidEmail(data.email)) {
    setFieldError("email", "Informe um e-mail válido.");
    valid = false;
  }
  return valid;
}

async function fillAddressByCep() {
  const cepInput = clientForm.elements.cep;
  const cep = onlyDigits(cepInput.value);
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) return;

    if (!clientForm.elements.endereco.value.trim()) {
      clientForm.elements.endereco.value = `${data.logradouro || ""}${data.bairro ? `, ${data.bairro}` : ""}`.trim();
    }
    if (!clientForm.elements.cidade.value.trim() && data.localidade && data.uf) {
      clientForm.elements.cidade.value = `${data.localidade}/${data.uf}`;
    }
  } catch (error) {
    console.warn("Não foi possível buscar o CEP automaticamente.", error);
  }
}

function renderPlans() {
  plansEl.innerHTML = plans.map(plan => `
    <article class="plan" data-id="${plan.id}">
      <h3>${plan.name}</h3>
      <strong>${plan.price}</strong>
    </article>
  `).join("");

  document.querySelectorAll(".plan").forEach(card => {
    card.addEventListener("click", () => selectPlan(card.dataset.id));
  });
}

function selectPlan(id) {
  selectedPlan = plans.find(plan => plan.id === id);
  document.querySelectorAll(".plan").forEach(card => card.classList.toggle("active", card.dataset.id === id));
  selectedPlanName.textContent = selectedPlan.name;
  selectedPlanPrice.textContent = selectedPlan.price;
  selectedPlanItems.innerHTML = selectedPlan.items.map(item => `<li>${item}</li>`).join("");
  selectedPlanBox.hidden = false;
  successBox.hidden = true;
}

choosePlanBtn.addEventListener("click", () => {
  if (!selectedPlan) return alert("Selecione um plano antes de continuar.");
  formSection.hidden = false;
  formSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

backBtn.addEventListener("click", () => {
  formSection.hidden = true;
  selectedPlanBox.scrollIntoView({ behavior: "smooth", block: "start" });
});

clientForm.elements.documento.addEventListener("input", event => {
  event.target.value = formatDocument(event.target.value);
});
clientForm.elements.cep.addEventListener("input", event => {
  event.target.value = formatCEP(event.target.value);
});
clientForm.elements.cep.addEventListener("blur", fillAddressByCep);
clientForm.elements.whatsapp.addEventListener("input", event => {
  event.target.value = formatPhone(event.target.value);
});

clientForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedPlan) return alert("Selecione um plano antes de enviar.");

  const data = Object.fromEntries(new FormData(clientForm).entries());
  if (!validateForm(data)) {
    alert("Revise os campos destacados antes de enviar.");
    return;
  }

  const message = `Olá! Tenho interesse em contratar a AXIS 1 e seguem meus dados para elaboração do contrato.\n\n` +
    `Plano escolhido: ${selectedPlan.name}\n` +
    `Investimento: ${selectedPlan.price}\n\n` +
    `Razão social / Nome: ${data.nome}\n` +
    `CPF/CNPJ: ${data.documento}\n` +
    `CEP: ${data.cep}\n` +
    `Endereço: ${data.endereco}\n` +
    `Cidade/UF: ${data.cidade}\n` +
    `WhatsApp: ${data.whatsapp}\n` +
    `E-mail: ${data.email}\n` +
    `${data.observacoes ? `Observações: ${data.observacoes}\n` : ""}\n` +
    `Aguardo os próximos passos.`;

  const url = `https://wa.me/${AXIS_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  successBox.hidden = false;
  successBox.scrollIntoView({ behavior: "smooth", block: "center" });
});

renderPlans();
