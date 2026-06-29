import { useState, useEffect, useCallback } from "react";

// ── Configuração ──────────────────────────────────────────
const ANTHROPIC_API_KEY = "SUA_API_KEY_AQUI"; // 👈 substitua pela sua key do console.anthropic.com

const GDRIVE_MCP_URL = "https://drivemcp.googleapis.com/mcp/v1";

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
  { id: "Flyers",      name: "Flyers",      icon: "📄" },
  { id: "Flyer_Design",name: "Flyer Design",icon: "🎨" },
  { id: "Sacola_CPG",  name: "Sacola CPG",  icon: "🛍️" },
  { id: "Gift_Bag",    name: "Gift Bag",    icon: "🎁" },
  { id: "Caixas",      name: "Caixas",      icon: "📦" },
  { id: "Cintas",      name: "Cintas",      icon: "🎀" },
];

const PRINT_CARD_STEPS = {
  Brasil: [
    { step: 1, title: "Acesse o arquivo original",  desc: "Baixe o template de Print Card na pasta 'Flyers' do Brasil." },
    { step: 2, title: "Verifique as dimensões",      desc: "Formato padrão Brasil: 10x15cm, resolução mínima 300dpi." },
    { step: 3, title: "Insira os dados do produto",  desc: "Preencha nome, SKU, preço e QR Code conforme o guia de marca." },
    { step: 4, title: "Aplique as cores Meli",       desc: "Use somente amarelo #FFE600 e azul #2D3277 nos elementos visuais." },
    { step: 5, title: "Envie para aprovação",        desc: "Submeta o arquivo final em PDF/X-1a para o time de Meli Brasil." },
  ],
  Argentina: [
    { step: 1, title: "Descargá el archivo original",   desc: "Bajá el template de Print Card desde la carpeta 'Flyers' de Argentina." },
    { step: 2, title: "Verificá las dimensiones",        desc: "Formato estándar Argentina: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Completá los datos del producto", desc: "Incluí nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplicá los colores Meli",         desc: "Usá solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Enviá para aprobación",           desc: "Subí el archivo final en PDF/X-1a al equipo de Meli Argentina." },
  ],
  Mexico: [
    { step: 1, title: "Descarga el archivo original",  desc: "Baja el template de Print Card desde la carpeta 'Flyers' de México." },
    { step: 2, title: "Verifica las dimensiones",       desc: "Formato estándar México: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Ingresa los datos del producto", desc: "Incluye nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplica los colores Meli",        desc: "Usa solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Envía para aprobación",          desc: "Sube el archivo final en PDF/X-1a al equipo de Meli México." },
  ],
  Chile: [
    { step: 1, title: "Descarga el archivo original",  desc: "Baja el template de Print Card desde la carpeta 'Flyers' de Chile." },
    { step: 2, title: "Verifica las dimensiones",       desc: "Formato estándar Chile: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Ingresa los datos del producto", desc: "Incluye nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplica los colores Meli",        desc: "Usa solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Envía para aprobación",          desc: "Sube el archivo final en PDF/X-1a al equipo de Meli Chile." },
  ],
  Peru: [
    { step: 1, title: "Descarga el archivo original",  desc: "Baja el template de Print Card desde la carpeta 'Flyers' de Perú." },
    { step: 2, title: "Verifica las dimensiones",       desc: "Formato estándar Perú: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Ingresa los datos del producto", desc: "Incluye nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplica los colores Meli",        desc: "Usa solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Envía para aprobación",          desc: "Sube el archivo final en PDF/X-1a al equipo de Meli Perú." },
  ],
  Colombia: [
    { step: 1, title: "Descarga el archivo original",  desc: "Baja el template de Print Card desde la carpeta 'Flyers' de Colombia." },
    { step: 2, title: "Verifica las dimensiones",       desc: "Formato estándar Colombia: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Ingresa los datos del producto", desc: "Incluye nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplica los colores Meli",        desc: "Usa solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Envía para aprobación",          desc: "Sube el archivo final en PDF/X-1a al equipo de Meli Colombia." },
  ],
  Uruguai: [
    { step: 1, title: "Descargá el archivo original",   desc: "Bajá el template de Print Card desde la carpeta 'Flyers' de Uruguay." },
    { step: 2, title: "Verificá las dimensiones",        desc: "Formato estándar Uruguay: 10x15cm, resolución mínima 300dpi." },
    { step: 3, title: "Completá los datos del producto", desc: "Incluí nombre, SKU, precio y QR Code según el manual de marca." },
    { step: 4, title: "Aplicá los colores Meli",         desc: "Usá solo amarillo #FFE600 y azul #2D3277 en los elementos visuales." },
    { step: 5, title: "Enviá para aprobación",           desc: "Subí el archivo final en PDF/X-1a al equipo de Meli Uruguay." },
  ],
};

// ── API ───────────────────────────────────────────────────
async function callClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "mcp-client-2025-04-04",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      mcp_servers: [{ type: "url", url: GDRIVE_MCP_URL, name: "gdrive" }],
      messages,
    }),
  });
  return res.json();
}

function extractJSON(data) {
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : null;
  } catch { return null; }
}

// ── Styles ────────────────────────────────────────────────
const C = { yellow: "#FFE600", blue: "#2D3277", white: "#fff", bg: "#f5f5f5", border: "#e0e0e0" };

const css = {
  app:       { fontFamily: "'Segoe UI',sans-serif", minHeight: "100vh", background: C.bg },
  header:    { background: C.blue, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,.2)" },
  logo:      { background: C.yellow, borderRadius: 8, padding: "4px 14px", fontWeight: 900, fontSize: 18, color: C.blue },
  htitle:    { color: C.white, fontWeight: 700, fontSize: 16, margin: 0, flex: 1 },
  driveBadge:{ background: "rgba(255,255,255,.15)", color: C.yellow, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  crumb:     { display: "flex", gap: 6, alignItems: "center", padding: "10px 24px", fontSize: 13, color: "#666", background: C.white, borderBottom: `1px solid ${C.border}` },
  crumbBtn:  { background: "none", border: "none", color: C.blue, cursor: "pointer", fontWeight: 600, padding: 0, fontSize: 13 },
  body:      { padding: "24px", maxWidth: 960, margin: "0 auto" },
  banner:    (bg) => ({ background: bg, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }),
  secTitle:  { fontSize: 20, fontWeight: 800, color: C.blue, marginBottom: 18 },
  grid:      { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 },
  card:      { background: C.white, borderRadius: 16, padding: "22px 14px", textAlign: "center", cursor: "pointer", border: `3px solid ${C.yellow}`, boxShadow: "0 2px 8px rgba(0,0,0,.07)", transition: "transform .15s" },
  yellowBtn: { background: C.yellow, color: C.blue, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  blueBtn:   { background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  fileArea:  { background: C.white, borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,.07)" },
  fileRow:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${C.border}` },
  stepCard:  (a) => ({ background: a ? C.blue : C.white, borderRadius: 14, padding: "14px 18px", cursor: "pointer", border: a ? "none" : `2px solid ${C.border}`, marginBottom: 10, boxShadow: a ? "0 4px 16px rgba(45,50,119,.25)" : "0 1px 4px rgba(0,0,0,.05)" }),
  spinner:   { display: "inline-block", width: 16, height: 16, border: `2px solid rgba(255,255,255,.3)`, borderTop: `2px solid ${C.yellow}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" },
};

// ── App ───────────────────────────────────────────────────
export default function App() {
  const [view, setView]               = useState("home");
  const [country, setCountry]         = useState(null);
  const [category, setCategory]       = useState(null);
  const [files, setFiles]             = useState([]);
  const [folderIds, setFolderIds]     = useState({});
  const [loading, setLoading]         = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [status, setStatus]           = useState("");
  const [activeStep, setActiveStep]   = useState(0);
  const [catFileCounts, setCatFileCounts] = useState({});

  const countryObj  = COUNTRIES.find(c => c.id === country);
  const categoryObj = CATEGORIES.find(c => c.id === category);

  async function ensureFolder(name, parentId) {
    const prompt = parentId
      ? `Use Google Drive to search for a folder named exactly "${name}" inside parent folder with ID "${parentId}". If it exists return its ID as JSON {"folderId":"..."}, if not create it with parentId "${parentId}" and return the new ID as JSON {"folderId":"..."}. Return ONLY the JSON.`
      : `Use Google Drive to search for a folder named exactly "${name}" in the root of My Drive. If it exists return its ID as JSON {"folderId":"..."}, if not create it and return the new ID as JSON {"folderId":"..."}. Return ONLY the JSON.`;
    const data = await callClaude([{ role: "user", content: prompt }]);
    return extractJSON(data)?.folderId || null;
  }

  async function getOrCreateCategoryFolder(cty, cat) {
    const key = `${cty}_${cat}`;
    if (folderIds[key]) return folderIds[key];
    setStatus(`Verificando pasta ${cty} / ${cat} no Drive...`);
    const rootId = await ensureFolder("Meli_Insumos", null);
    const ctyId  = await ensureFolder(cty, rootId);
    const catId  = await ensureFolder(cat, ctyId);
    setFolderIds(p => ({ ...p, [key]: catId }));
    return catId;
  }

  async function listFiles(folderId) {
    const data = await callClaude([{
      role: "user",
      content: `Use Google Drive to list all files (not folders) inside the folder with ID "${folderId}". Return ONLY a JSON array: [{"id":"...","name":"...","webViewLink":"...","modifiedTime":"...","size":"..."}]. If empty return [].`
    }]);
    return extractJSON(data) || [];
  }

  const loadFiles = useCallback(async (cty, cat) => {
    setLoading(true);
    setStatus("Carregando arquivos do Drive...");
    try {
      const fid  = await getOrCreateCategoryFolder(cty, cat);
      const list = await listFiles(fid);
      setFiles(list);
    } catch { setStatus("Erro ao carregar arquivos."); }
    setLoading(false);
    setStatus("");
  }, [folderIds]);

  async function loadCatCounts(cty) {
    const counts = {};
    for (const cat of CATEGORIES) {
      try {
        const fid  = await getOrCreateCategoryFolder(cty, cat.id);
        const list = await listFiles(fid);
        counts[cat.id] = list.length;
      } catch { counts[cat.id] = 0; }
    }
    setCatFileCounts(counts);
  }

  useEffect(() => {
    if (view === "category" && country && category) loadFiles(country, category);
  }, [view, country, category]);

  useEffect(() => {
    if (view === "country" && country) {
      setLoading(true);
      setStatus("Carregando contagem de arquivos...");
      loadCatCounts(country).finally(() => { setLoading(false); setStatus(""); });
    }
  }, [view, country]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus(`Enviando "${file.name}" para o Drive...`);
    try {
      const fid = await getOrCreateCategoryFolder(country, category);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const b64  = ev.target.result.split(",")[1];
        const data = await callClaude([{
          role: "user",
          content: `Use Google Drive to upload a file named "${file.name}" with base64 content "${b64}" and MIME type "${file.type || "application/octet-stream"}" to the folder with ID "${fid}". Return ONLY JSON {"success":true,"fileId":"...","name":"..."}.`
        }]);
        const j = extractJSON(data);
        if (j?.success || j?.fileId) {
          setStatus("✅ Upload concluído!");
          await loadFiles(country, category);
        } else { setStatus("⚠️ Erro no upload."); }
        setUploading(false);
        setTimeout(() => setStatus(""), 3000);
      };
      reader.readAsDataURL(file);
    } catch { setStatus("⚠️ Erro no upload."); setUploading(false); }
    e.target.value = "";
  }

  const goHome    = () => { setView("home"); setCountry(null); setCategory(null); setFiles([]); setCatFileCounts({}); };
  const goCountry = () => { setView("country"); setCategory(null); setFiles([]); };
  const steps     = country ? PRINT_CARD_STEPS[country] || [] : [];

  return (
    <div style={css.app}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .ch:hover{transform:translateY(-4px)!important}`}</style>

      {/* Header */}
      <div style={css.header}>
        <div style={css.logo}>MELI</div>
        <p style={css.htitle}>Portal de Insumos para Fornecedores</p>
        <div style={css.driveBadge}><span>💾</span> Google Drive</div>
      </div>

      {/* Breadcrumb */}
      {view !== "home" && (
        <div style={css.crumb}>
          <button style={css.crumbBtn} onClick={goHome}>🏠 Início</button>
          {country && <><span>›</span><button style={css.crumbBtn} onClick={goCountry}>{countryObj?.code} · {country}</button></>}
          {category && <><span>›</span><span style={{ color: "#333" }}>{categoryObj?.icon} {categoryObj?.name}</span></>}
          {view === "guide" && <><span>›</span><span style={{ color: "#333" }}>📋 Guia de Print Cards</span></>}
        </div>
      )}

      {/* Status */}
      {status && (
        <div style={{ background: C.blue, color: C.yellow, padding: "8px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={css.spinner} />{status}
        </div>
      )}

      <div style={css.body}>

        {/* HOME */}
        {view === "home" && (
          <>
            <div style={css.banner(C.yellow)}>
              <span style={{ fontSize: 36 }}>📦</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.blue }}>Bem-vindo ao Portal de Insumos</div>
                <div style={{ color: C.blue, fontSize: 13, marginTop: 4 }}>Arquivos sincronizados com o Google Drive. Selecione o país para começar.</div>
              </div>
            </div>
            <div style={css.secTitle}>Selecione o País</div>
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

        {/* COUNTRY */}
        {view === "country" && countryObj && (
          <>
            <div style={{ ...css.banner(C.blue), justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: C.yellow, color: C.blue, borderRadius: 10, padding: "6px 14px", fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>{countryObj.code}</div>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 20 }}>{country}</div>
              </div>
              <button style={css.yellowBtn} onClick={() => { setActiveStep(0); setView("guide"); }}>📋 Guia de Print Cards</button>
            </div>
            <div style={css.secTitle}>Categorias de Insumos</div>
            <div style={css.grid}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="ch" style={css.card} onClick={() => { setCategory(cat.id); setView("category"); }}>
                  <div style={{ fontSize: 34, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, color: C.blue, fontSize: 13 }}>{cat.name}</div>
                  <div style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>{loading ? "..." : `${catFileCounts[cat.id] ?? 0} arquivo(s)`}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CATEGORY */}
        {view === "category" && countryObj && categoryObj && (
          <>
            <div style={css.banner(C.blue)}>
              <span style={{ fontSize: 34 }}>{categoryObj.icon}</span>
              <div>
                <div style={{ color: C.yellow, fontWeight: 800, fontSize: 18 }}>{categoryObj.name}</div>
                <div style={{ color: "#aaa", fontSize: 12 }}>{countryObj.code} · {country} · Google Drive</div>
              </div>
            </div>
            <div style={css.fileArea}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 15 }}>Arquivos ({files.length})</div>
                <label style={{ ...css.blueBtn, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? <><div style={css.spinner} /> Enviando...</> : <><span>⬆️</span> Upload de Arquivo</>}
                  <input type="file" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
              {loading ? (
                <div style={{ color: "#aaa", textAlign: "center", padding: "32px 0" }}>⏳ Carregando arquivos do Drive...</div>
              ) : files.length === 0 ? (
                <div style={{ color: "#aaa", textAlign: "center", padding: "32px 0", fontSize: 14 }}>Nenhum arquivo ainda. Faça upload para começar.</div>
              ) : files.map((f, i) => (
                <div key={i} style={css.fileRow}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#333", fontSize: 14 }}>📎 {f.name}</div>
                    <div style={{ color: "#999", fontSize: 11, marginTop: 2 }}>
                      {f.size ? `${Math.round(f.size / 1024)} KB · ` : ""}{f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString("pt-BR") : ""}
                    </div>
                  </div>
                  {f.webViewLink && (
                    <a href={f.webViewLink} target="_blank" rel="noreferrer"
                      style={{ background: C.yellow, color: C.blue, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                      🔗 Abrir
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* GUIDE */}
        {view === "guide" && countryObj && (
          <>
            <div style={css.banner(C.yellow)}>
              <span style={{ fontSize: 34 }}>📋</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.blue }}>Guia de Print Cards</div>
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
              <button style={{ ...css.yellowBtn, opacity: activeStep === 0 ? 0.4 : 1 }} disabled={activeStep === 0} onClick={() => setActiveStep(p => Math.max(0, p - 1))}>← Anterior</button>
              <button style={{ ...css.yellowBtn, opacity: activeStep === steps.length - 1 ? 0.4 : 1 }} disabled={activeStep === steps.length - 1} onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}>Próximo →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}