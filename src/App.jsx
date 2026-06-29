import { useState, useEffect } from "react";

const TRANSLATIONS = {
  pt: {
    portalTitle: "PORTAL PACKAGING",
    portalSub: "Selecione o país para acessar os materiais.",
    selectCountry: "Selecione o País",
    categories: "Categorias de Insumos",
    printGuide: "Orientações para Desenvolvimento dos Print Cards",
    files: "Arquivos",
    addLink: "Adicionar Link do Drive",
    noFiles: "Nenhum arquivo ainda.",
    open: "Abrir",
    prev: "← Anterior",
    next: "Próximo →",
    welcome: "Bem-vindo ao Portal Packaging",
    selectFolder: "Selecione a pasta",
    linkPlaceholder: "Cole o link do Google Drive aqui",
    linkName: "Nome do arquivo",
    add: "Adicionar",
    cancel: "Cancelar",
    confirmDelete: "Remover este arquivo?",
  },
  es: {
    portalTitle: "PORTAL PACKAGING",
    portalSub: "Seleccioná el país para acceder a los materiales.",
    selectCountry: "Seleccioná el País",
    categories: "Categorías de Insumos",
    printGuide: "Orientaciones para el Desarrollo de Print Cards",
    files: "Archivos",
    addLink: "Agregar Link de Drive",
    noFiles: "Ningún archivo todavía.",
    open: "Abrir",
    prev: "← Anterior",
    next: "Siguiente →",
    welcome: "Bienvenido al Portal Packaging",
    selectFolder: "Seleccioná la carpeta",
    linkPlaceholder: "Pegá el link de Google Drive aquí",
    linkName: "Nombre del archivo",
    add: "Agregar",
    cancel: "Cancelar",
    confirmDelete: "¿Eliminar este archivo?",
  }
};

const COUNTRIES = [
  { id: "Brasil",    name: "Brasil",    code: "MLB" },
  { id: "Argentina", name: "Argentina", code: "MLA" },
  { id: "Mexico",    name: "México",    code: "MLM" },
  { id: "Chile",     name: "Chile",     code: "MLC" },
  { id: "Peru",      name: "Peru",      code: "MPE" },
  { id: "Colombia",  name: "Colombia",  code: "MCO" },
  { id: "Uruguai",   name: "Uruguai",   code: "MCU" },
];

const CATEGORIES = [
  { id: "Flyers",       name: "Flyers",               icon: "📄" },
  { id: "Flyer_Design", name: "Flyer Packing Machine", icon: "🖨️" },
  { id: "Sacola_CPG",   name: "Sacola CPG",            icon: "🛍️" },
  { id: "Gift_Bag",     name: "Gift Bag",              icon: "🎁" },
  { id: "Caixas",       name: "Caixas",                icon: "📦" },
  { id: "Cintas",       name: "Cintas",                icon: "🎀" },
];

const SUBCATEGORIES = [
  { id: "Versao_Provas", name: { pt: "Versão de Provas", es: "Versión de Pruebas" }, icon: "🔍" },
  { id: "Versao_Final",  name: { pt: "Versão Final",     es: "Versión Final"      }, icon: "✅" },
];

const STEPS_PT = [
  { step:1, title:"Baixar o arquivo original", desc:"Faça o download do arquivo original disponível neste portal." },
  { step:2, title:"Verificar as dimensões", desc:"Confira as dimensões específicas de cada produto conforme indicado no arquivo original." },
  { step:3, title:"Inserir nome do fornecedor", desc:"Insira o nome do fornecedor por escrito. OBS: Não serão aceitos logotipos, somente nome por escrito." },
  { step:4, title:"Inserir dados de rastreabilidade", desc:"Insira os dados de rastreabilidade. Mesmo que sejam diferentes no momento da impressão, coloque o formato de como saem na impressão." },
  { step:5, title:"Inserir número de reciclagem", desc:"Insira o número de reciclagem no triângulo conforme o material a ser utilizado na produção." },
  { step:6, title:"Aplicar as cores", desc:"Aplique as cores conforme orientação de pantone informada na arte original." },
  { step:7, title:"Enviar para aprovação", desc:"Envie o arquivo para aprovação para: ext_talcanto@mercadolivre.com" },
];

const STEPS_ES = [
  { step:1, title:"Descargar el archivo original", desc:"Descargá el archivo original disponible en este portal." },
  { step:2, title:"Verificar las dimensiones", desc:"Verificá las dimensiones específicas de cada producto según lo indicado en el archivo original." },
  { step:3, title:"Insertar nombre del proveedor", desc:"Insertá el nombre del proveedor por escrito. OBS: No se aceptarán logotipos, solo nombre escrito." },
  { step:4, title:"Insertar datos de trazabilidad", desc:"Insertá los datos de trazabilidad. Aunque sean diferentes al momento de impresión, colocá el formato tal como salen en la impresión." },
  { step:5, title:"Insertar número de reciclaje", desc:"Insertá el número de reciclaje en el triángulo según el material a utilizar en la producción." },
  { step:6, title:"Aplicar los colores", desc:"Aplicá los colores según la orientación de pantone indicada en el arte original." },
  { step:7, title:"Enviar para aprobación", desc:"Enviá el archivo para aprobación a: ext_talcanto@mercadolivre.com" },
];

const PRINT_CARD_STEPS = {
  pt: { Brasil:STEPS_PT, Argentina:STEPS_PT, Mexico:STEPS_PT, Chile:STEPS_PT, Peru:STEPS_PT, Colombia:STEPS_PT, Uruguai:STEPS_PT },
  es: { Brasil:STEPS_ES, Argentina:STEPS_ES, Mexico:STEPS_ES, Chile:STEPS_ES, Peru:STEPS_ES, Colombia:STEPS_ES, Uruguai:STEPS_ES },
};

const STORAGE_KEY = "meli_portal_links";
function loadLinks() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveLinks(links) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(links)); } catch {}
}

const C = { yellow: "#FFE600", blue: "#2D3277", white: "#fff", bg: "#f5f5f5", border: "#e0e0e0" };

const css = {
  app:       { fontFamily: "'Segoe UI',sans-serif", minHeight: "100vh", background: C.bg },
  header:    { background: C.blue, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,.2)" },
  logo:      { background: C.yellow, borderRadius: 8, padding: "4px 14px", fontWeight: 900, fontSize: 18, color: C.blue },
  htitle:    { color: C.white, fontWeight: 700, fontSize: 16, margin: 0, flex: 1 },
  crumb:     { display: "flex", gap: 6, alignItems: "center", padding: "10px 24px", fontSize: 13, color: "#666", background: C.white, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" },
  crumbBtn:  { background: "none", border: "none", color: C.blue, cursor: "pointer", fontWeight: 600, padding: 0, fontSize: 13 },
  body:      { padding: "24px", maxWidth: 960, margin: "0 auto" },
  banner:    (bg) => ({ background: bg, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }),
  secTitle:  { fontSize: 20, fontWeight: 800, color: C.blue, marginBottom: 18 },
  grid:      { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 },
  card:      { background: C.white, borderRadius: 16, padding: "22px 14px", textAlign: "center", cursor: "pointer", border: `3px solid ${C.yellow}`, boxShadow: "0 2px 8px rgba(0,0,0,.07)", transition: "transform .15s" },
  yellowBtn: { background: C.yellow, color: C.blue, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  blueBtn:   { background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  fileArea:  { background: C.white, borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,.07)" },
  fileRow:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}`, gap: 10 },
  stepCard:  (a) => ({ background: a ? C.blue : C.white, borderRadius: 14, padding: "14px 18px", cursor: "pointer", border: a ? "none" : `2px solid ${C.border}`, marginBottom: 10, boxShadow: a ? "0 4px 16px rgba(45,50,119,.25)" : "0 1px 4px rgba(0,0,0,.05)" }),
  input:     { border: `2px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" },
  modal:     { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox:  { background: C.white, borderRadius: 18, padding: 28, width: "90%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 14 },
};

export default function App() {
  const [view, setView]             = useState("lang");
  const [lang, setLang]             = useState("pt");
  const [country, setCountry]       = useState(null);
  const [category, setCategory]     = useState(null);
  const [subcat, setSubcat]         = useState(null);
  const [links, setLinks]           = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal]   = useState(false);
  const [newName, setNewName]       = useState("");
  const [newUrl, setNewUrl]         = useState("");
  const [isAdmin, setIsAdmin]       = useState(false);

  const T           = TRANSLATIONS[lang];
  const countryObj  = COUNTRIES.find(c => c.id === country);
  const categoryObj = CATEGORIES.find(c => c.id === category);
  const subcatObj   = SUBCATEGORIES.find(s => s.id === subcat);
  const fileKey     = `${country}_${category}_${subcat}`;
  const currentFiles = links[fileKey] || [];
  const steps       = country ? (PRINT_CARD_STEPS[lang][country] || []) : [];

  useEffect(() => { setLinks(loadLinks()); }, []);

  function addLink() {
    if (!newName.trim() || !newUrl.trim()) return;
    const entry = { id: Date.now(), name: newName.trim(), url: newUrl.trim() };
    const updated = { ...links, [fileKey]: [...currentFiles, entry] };
    setLinks(updated);
    saveLinks(updated);
    setNewName(""); setNewUrl(""); setShowModal(false);
  }

  function removeLink(id) {
    const updated = { ...links, [fileKey]: currentFiles.filter(f => f.id !== id) };
    setLinks(updated);
    saveLinks(updated);
  }

  const goHome     = () => { setView("home"); setCountry(null); setCategory(null); setSubcat(null); };
  const goCountry  = () => { setView("country"); setCategory(null); setSubcat(null); };
  const goCategory = () => { setView("category"); setSubcat(null); };

  if (view === "lang") return (
    <div style={{ ...css.app, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <style>{`.ch:hover{transform:translateY(-4px)!important}`}</style>
      <div style={{ background: C.blue, borderRadius: 24, padding: "48px 40px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.2)", maxWidth: 400, width: "90%" }}>
        <div style={{ background: C.yellow, borderRadius: 12, padding: "8px 20px", fontWeight: 900, fontSize: 22, color: C.blue, display: "inline-block", marginBottom: 24 }}>MELI</div>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Portal Packaging</div>
        <div style={{ color: "#aaa", fontSize: 14, marginBottom: 32 }}>Selecione o idioma / Seleccioná el idioma</div>
        <div style={{ display: "flex", gap: 16 }}>
          <div className="ch" onClick={() => { setLang("pt"); setView("home"); }}
            style={{ background: C.yellow, borderRadius: 16, padding: "24px 28px", cursor: "pointer", flex: 1, transition: "transform .15s" }}>
            <div style={{ fontWeight: 800, color: C.blue, fontSize: 18 }}>Português</div>
          </div>
          <div className="ch" onClick={() => { setLang("es"); setView("home"); }}
            style={{ background: C.yellow, borderRadius: 16, padding: "24px 28px", cursor: "pointer", flex: 1, transition: "transform .15s" }}>
            <div style={{ fontWeight: 800, color: C.blue, fontSize: 18 }}>Español</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={css.app}>
      <style>{`.ch:hover{transform:translateY(-4px)!important}`}</style>

      <div style={css.header}>
        <div style={css.logo}>MELI</div>
        <p style={css.htitle}>{T.portalTitle}</p>
        <button onClick={() => setIsAdmin(!isAdmin)}
          style={{ background: isAdmin ? C.yellow : "rgba(255,255,255,.15)", color: isAdmin ? C.blue : C.yellow, border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginRight: 6 }}>
          {isAdmin ? "✏️ Admin" : "👁️ Visitor"}
        </button>
        <button onClick={() => setView("lang")}
          style={{ background: "rgba(255,255,255,.15)", color: C.yellow, border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {lang === "pt" ? "PT" : "ES"}
        </button>
      </div>

      {view !== "home" && (
        <div style={css.crumb}>
          <button style={css.crumbBtn} onClick={goHome}>🏠 {lang === "pt" ? "Início" : "Inicio"}</button>
          {country && <><span>›</span><button style={css.crumbBtn} onClick={goCountry}>{countryObj?.code} · {country}</button></>}
          {category && <><span>›</span><button style={css.crumbBtn} onClick={goCategory}>{categoryObj?.icon} {categoryObj?.name}</button></>}
          {subcat && <><span>›</span><span style={{ color: "#333" }}>{subcatObj?.icon} {subcatObj?.name[lang]}</span></>}
          {view === "guide" && <><span>›</span><span style={{ color: "#333" }}>📋 {T.printGuide}</span></>}
        </div>
      )}

      <div style={css.body}>

        {view === "home" && (
          <>
            <div style={css.banner(C.yellow)}>
              <span style={{ fontSize: 36 }}>📦</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.blue }}>{T.welcome}</div>
                <div style={{ color: C.blue, fontSize: 13, marginTop: 4 }}>{T.portalSub}</div>
              </div>
            </div>
            <div style={css.secTitle}>{T.selectCountry}</div>
            <div style={css.grid}>
              {COUNTRIES.map(c => (
                <div key={c.id} className="ch" style={css.card} onClick={() => { setCountry(c.id); setView("country"); }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.blue, background: C.yellow, borderRadius: 10, padding: "6px 10px", marginBottom: 8, letterSpacing: 1 }}>{c.code}</div>
                  <div style={{ fontWeight: 700, color: C.blue, fontSize: 13 }}>{c.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "country" && countryObj && (
          <>
            <div style={{ ...css.banner(C.blue), justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: C.yellow, color: C.blue, borderRadius: 10, padding: "6px 14px", fontWeight: 900, fontSize: 18 }}>{countryObj.code}</div>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 20 }}>{country}</div>
              </div>
              <button style={css.yellowBtn} onClick={() => { setActiveStep(0); setView("guide"); }}>📋 {T.printGuide}</button>
            </div>
            <div style={css.secTitle}>{T.categories}</div>
            <div style={css.grid}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="ch" style={css.card} onClick={() => { setCategory(cat.id); setView("category"); }}>
                  <div style={{ fontSize: 34, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, color: C.blue, fontSize: 13 }}>{cat.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "category" && countryObj && categoryObj && (
          <>
            <div style={css.banner(C.blue)}>
              <span style={{ fontSize: 34 }}>{categoryObj.icon}</span>
              <div>
                <div style={{ color: C.yellow, fontWeight: 800, fontSize: 18 }}>{categoryObj.name}</div>
                <div style={{ color: "#aaa", fontSize: 12 }}>{countryObj.code} · {country}</div>
              </div>
            </div>
            <div style={css.secTitle}>{T.selectFolder}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {SUBCATEGORIES.map(s => (
                <div key={s.id} className="ch" style={{ ...css.card, padding: "28px 20px" }}
                  onClick={() => { setSubcat(s.id); setView("files"); }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, color: C.blue, fontSize: 15 }}>{s.name[lang]}</div>
                  <div style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>
                    {(links[`${country}_${category}_${s.id}`] || []).length} {lang === "pt" ? "arquivo(s)" : "archivo(s)"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "files" && countryObj && categoryObj && subcatObj && (
          <>
            <div style={css.banner(C.blue)}>
              <span style={{ fontSize: 34 }}>{subcatObj.icon}</span>
              <div>
                <div style={{ color: C.yellow, fontWeight: 800, fontSize: 18 }}>{subcatObj.name[lang]}</div>
                <div style={{ color: "#aaa", fontSize: 12 }}>{categoryObj.icon} {categoryObj.name} · {countryObj.code} · {country}</div>
              </div>
            </div>
            <div style={css.fileArea}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 15 }}>{T.files} ({currentFiles.length})</div>
                {isAdmin && (
                  <button style={css.blueBtn} onClick={() => setShowModal(true)}>🔗 {T.addLink}</button>
                )}
              </div>
              {currentFiles.length === 0 ? (
                <div style={{ color: "#aaa", textAlign: "center", padding: "32px 0", fontSize: 14 }}>{T.noFiles}</div>
              ) : currentFiles.map((f) => (
                <div key={f.id} style={css.fileRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#333", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📎 {f.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <a href={f.url} target="_blank" rel="noreferrer"
                      style={{ background: C.yellow, color: C.blue, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                      🔗 {T.open}
                    </a>
                    {isAdmin && (
                      <button onClick={() => { if (window.confirm(T.confirmDelete)) removeLink(f.id); }}
                        style={{ background: "#fff0f0", color: "#e53935", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "guide" && countryObj && (
          <>
            <div style={css.banner(C.yellow)}>
              <span style={{ fontSize: 34 }}>📋</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.blue }}>{T.printGuide}</div>
                <div style={{ color: C.blue, fontSize: 12, marginTop: 2 }}>{countryObj.code} · {country}</div>
              </div>
            </div>
            {steps.map((s, i) => (
              <div key={i} style={css.stepCard(activeStep === i)} onClick={() => setActiveStep(i)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ background: C.yellow, color: C.blue, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{s.step}</div>
                  <div style={{ fontWeight: 700, color: activeStep === i ? C.yellow : C.blue, fontSize: 14 }}>{s.title}</div>
                </div>
                {activeStep === i && <div style={{ color: "#d0d4ff", fontSize: 13, marginTop: 8, marginLeft: 40, lineHeight: 1.6 }}>{s.desc}</div>}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={{ ...css.yellowBtn, opacity: activeStep === 0 ? 0.4 : 1 }} disabled={activeStep === 0} onClick={() => setActiveStep(p => Math.max(0, p - 1))}>{T.prev}</button>
              <button style={{ ...css.yellowBtn, opacity: activeStep === steps.length - 1 ? 0.4 : 1 }} disabled={activeStep === steps.length - 1} onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}>{T.next}</button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div style={css.modal} onClick={() => setShowModal(false)}>
          <div style={css.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.blue }}>🔗 {T.addLink}</div>
            <input style={css.input} placeholder={T.linkName} value={newName} onChange={e => setNewName(e.target.value)} />
            <input style={css.input} placeholder={T.linkPlaceholder} value={newUrl} onChange={e => setNewUrl(e.target.value)} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={{ ...css.yellowBtn, background: "#f0f0f0", color: "#555" }} onClick={() => setShowModal(false)}>{T.cancel}</button>
              <button style={css.blueBtn} onClick={addLink}>{T.add}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}