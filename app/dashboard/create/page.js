'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

var TEMPLATES = [
  { icon: '\uD83C\uDF74', label: 'Restaurant', prompt: 'A modern restaurant website with elegant menu section, chef story, location with map, reservation form, food gallery, and testimonials. Dark luxury theme with gold accents.' },
  { icon: '\uD83C\uDFE2', label: 'Business', prompt: 'A professional corporate website with hero section, services overview, about the team, client logos, case studies, and contact form. Clean dark theme with blue accents.' },
  { icon: '\uD83D\uDECD\uFE0F', label: 'Online Store', prompt: 'An e-commerce storefront with featured products grid, categories, product cards with prices, shopping cart, promotions banner, and newsletter signup. Modern dark theme.' },
  { icon: '\uD83D\uDCBC', label: 'Portfolio', prompt: 'A creative portfolio with large hero text, project gallery with hover effects, about section, skills/tools, testimonials, and contact form. Minimal dark design.' },
  { icon: '\uD83C\uDFE5', label: 'Medical', prompt: 'A medical practice website with services, doctor profiles with photos, appointment booking, patient testimonials, insurance info, and emergency contact. Professional blue-teal theme.' },
  { icon: '\uD83C\uDF93', label: 'Education', prompt: 'An educational platform with course catalog, enrollment CTA, instructor profiles, campus info, upcoming events, and student testimonials. Modern dark academic theme.' },
  { icon: '\uD83C\uDFE0', label: 'Real Estate', prompt: 'A real estate website with property listings grid, search filters, featured homes with prices, agent profiles, neighborhood guides, and contact form. Elegant dark theme.' },
  { icon: '\u2696\uFE0F', label: 'Law Firm', prompt: 'A law firm website with practice areas, attorney profiles, case results, client testimonials, free consultation CTA, and legal resources. Professional dark navy theme.' },
];

var STEPS = [
  { icon: '\uD83E\uDD14', label: 'Understanding your vision', sub: 'Analysing requirements...' },
  { icon: '\uD83D\uDCBB', label: 'Generating code', sub: 'AI is writing your website...' },
  { icon: '\uD83D\uDCC1', label: 'Creating repository', sub: 'Setting up GitHub repo...' },
  { icon: '\u2B06\uFE0F', label: 'Pushing code', sub: 'Uploading files...' },
  { icon: '\uD83D\uDE80', label: 'Deploying', sub: 'Building and going live...' },
  { icon: '\u2705', label: 'Complete!', sub: 'Your site is ready' },
];

export default function CreatePage() {
  var router = useRouter();
  var [name, setName] = useState('');
  var [prompt, setPrompt] = useState('');
  var [selectedTemplate, setSelectedTemplate] = useState(-1);
  var [building, setBuilding] = useState(false);
  var [step, setStep] = useState(0);
  var [error, setError] = useState('');
  var [result, setResult] = useState(null);

  function selectTemplate(idx) {
    setSelectedTemplate(idx);
    setPrompt(TEMPLATES[idx].prompt);
    if (!name) setName(TEMPLATES[idx].label.toLowerCase().replace(/\s+/g, '-') + '-site');
  }

  async function generate() {
    if (!name || !prompt) return;
    setError(''); setBuilding(true); setStep(0); setResult(null);

    try {
      setStep(1);
      var t1 = setTimeout(function() { setStep(2); }, 10000);
      var t2 = setTimeout(function() { setStep(3); }, 18000);
      var t3 = setTimeout(function() { setStep(4); }, 26000);

      var res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, prompt: prompt }),
      });

      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setStep(5);
      setResult(data);
    } catch (err) {
      setError(err.message);
      setBuilding(false);
    }
  }

  // Success screen
  if (result) return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }`}</style>
      <div style={{ textAlign: 'center', maxWidth: 480, animation: 'scaleIn 0.4s ease' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{'\u2705'}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>{name} is deploying!</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>Your website has been generated and is building now. It usually takes 2-5 minutes to go live.</p>
        {result.repository && <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, marginBottom: 28, fontFamily: "'JetBrains Mono', monospace" }}>{result.repository}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={function() { router.push('/dashboard/project/' + result.uuid); }} style={{
            padding: '13px 28px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', fontFamily: "'Outfit', sans-serif",
          }}>View Project</button>
          <button onClick={function() { router.push('/dashboard'); }} style={{
            padding: '13px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
          }}>Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <style>{`
        @keyframes breathe { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
        .template-card { padding: 16px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.01); cursor: pointer; text-align: center; transition: all 0.2s ease; }
        .template-card:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); transform: translateY(-2px); }
        .template-selected { background: rgba(56,189,168,0.06) !important; border-color: rgba(56,189,168,0.2) !important; }
        .create-input { width: 100%; padding: 15px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
        .create-input:focus { border-color: rgba(56,189,168,0.3); box-shadow: 0 0 0 3px rgba(56,189,168,0.06); }
        .create-input::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <button onClick={function() { router.push('/dashboard'); }} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'rgba(255,255,255,0.3)',
          padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit', sans-serif", marginBottom: 24,
        }}>{'\u2190'} Back</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(56,189,168,0.1), rgba(37,136,204,0.08))', border: '1px solid rgba(56,189,168,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{'\u26A1'}</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.8px' }}>Create with AI</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, margin: 0 }}>Describe your website and we will build it</p>
          </div>
        </div>

        {error && <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.1)', color: '#f87171', fontSize: 13, marginTop: 20 }}>{error}</div>}

        {building && !result ? (
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'breathe 2s ease infinite' }}>{STEPS[step].icon}</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.5px' }}>{STEPS[step].label}</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 32 }}>{STEPS[step].sub}</p>

            {/* Progress bar */}
            <div style={{ maxWidth: 320, margin: '0 auto', height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <div style={{ width: ((step + 1) / STEPS.length * 100) + '%', height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #38bda8, #2588cc)', transition: 'width 0.5s ease' }} />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {STEPS.map(function(s, i) {
                return <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= step ? '#38bda8' : 'rgba(255,255,255,0.06)', transition: 'all 0.3s' }} />;
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Templates */}
            <div style={{ marginTop: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 12 }}>Quick Templates</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {TEMPLATES.map(function(t, i) {
                  return <div key={i} className={'template-card' + (selectedTemplate === i ? ' template-selected' : '')} onClick={function() { selectTemplate(i); }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: selectedTemplate === i ? '#38bda8' : 'rgba(255,255,255,0.4)' }}>{t.label}</div>
                  </div>;
                })}
              </div>
            </div>

            {/* Form */}
            <div style={{ marginTop: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>Project Name</label>
              <input className="create-input" value={name} onChange={function(e) { setName(e.target.value); }} placeholder="my-awesome-site" />
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>Describe Your Website</label>
              <textarea className="create-input" value={prompt} onChange={function(e) { setPrompt(e.target.value); }} rows={5} style={{ resize: 'vertical', lineHeight: 1.6 }} placeholder={"Describe what you want...\n\nExample: A modern coffee shop website with a warm brown color scheme, menu with prices, about us story, location with opening hours, and a contact form."} />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 6 }}>Be specific about colors, sections, and features you want. The more detail, the better.</p>
            </div>

            <button onClick={generate} disabled={!name || !prompt} style={{
              width: '100%', padding: 18, borderRadius: 14, border: 'none', fontSize: 16, fontWeight: 700,
              cursor: name && prompt ? 'pointer' : 'not-allowed', fontFamily: "'Outfit', sans-serif",
              background: name && prompt ? 'linear-gradient(135deg, #f59e0b, #38bda8, #2588cc)' : 'rgba(255,255,255,0.03)',
              backgroundSize: name && prompt ? '200% 200%' : undefined,
              color: name && prompt ? '#060a0f' : 'rgba(255,255,255,0.15)',
              marginTop: 24, boxSizing: 'border-box',
              boxShadow: name && prompt ? '0 4px 20px rgba(56,189,168,0.2)' : 'none',
              transition: 'all 0.2s',
            }}>{'\u26A1'} Generate and Deploy</button>
          </>
        )}
      </div>
    </div>
  );
}
