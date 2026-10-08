import { useEffect, useState } from 'react'
import './App.css'

const posters = [
  {
    title: 'Oppenheimer',
    type: 'Filme',
    score: '8.9',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'The Last of Us',
    type: 'Série',
    score: '9.2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Interestelar',
    type: 'Filme',
    score: '9.0',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Noite de Cinema',
    type: 'Filme',
    score: '8.7',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85',
  },
]

const features = [
  {
    number: '01',
    title: 'Descubra',
    text: 'Encontre filmes e séries que combinam com o que você realmente gosta de assistir.',
    icon: '✦',
    image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
    expandedTitle: 'Descubra o próximo favorito',
    expandedText: 'Explore curadoria, tendências e sugestões inteligentes para encontrar histórias que realmente combinem com seu gosto. A descoberta vira uma experiência mais pessoal e emocionante.',
    tags: ['Curadoria', 'Sugestões', 'Novos títulos'],
  },
  {
    number: '02',
    title: 'Avalie',
    text: 'Dê sua nota, registre suas impressões e ajude a construir um catálogo mais útil.',
    icon: '★',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80',
    expandedTitle: 'Avalie com clareza',
    expandedText: 'Registre suas notas, opiniões e momentos marcantes do que você assistiu. A avaliação ajuda a construir uma experiência mais útil e inspirada em gosto real.',
    tags: ['Notas', 'Críticas', 'Rankings'],
  },
  {
    number: '03',
    title: 'Salve',
    text: 'Monte sua própria lista para não esquecer aquele título que você quer assistir depois.',
    icon: '＋',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    expandedTitle: 'Salve para depois',
    expandedText: 'Guarde seus favoritos, monte listas por tema e não perca aquele filme ou série que você quer assistir quando a hora certa chegar.',
    tags: ['Watchlist', 'Favoritos', 'Minha lista'],
  },
]

function Logo({ compact = false }) {
  return (
    <span className={`logo-mark ${compact ? 'logo-mark--compact' : ''}`} aria-label="TVScore">
      <span className="logo-symbol">TV</span>
      <span className="logo-name">Score</span>
    </span>
  )
}

function Reveal({ children, className = '', ...props }) {
  return <div className={`reveal ${className}`} {...props}>{children}</div>
}

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)
  
  // Estado do formulário de cadastro
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  })
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.14 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activeFeature) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveFeature(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeFeature])

  // Fechar modal de cadastro
  const fecharModalCadastro = () => {
    setIsStarted(false)
    setFormData({ nome: '', email: '', senha: '' })
    setMensagem(null)
  }

  // Lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Enviar cadastro para o backend
  const handleSubmitCadastro = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensagem(null)

    try {
      const response = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMensagem({
          tipo: 'sucesso',
          texto: 'Conta criada com sucesso! Verifique seu e-mail.'
        })
        setFormData({ nome: '', email: '', senha: '' })
        setTimeout(() => fecharModalCadastro(), 2000)
      } else {
        setMensagem({
          tipo: 'erro',
          texto: data.mensagem || 'Erro ao criar conta. Tente novamente.'
        })
      }
    } catch (erro) {
      console.error('Erro:', erro)
      setMensagem({
        tipo: 'erro',
        texto: 'Erro de conexão com o servidor. Verifique se o backend está rodando em http://localhost:3000'
      })
    } finally {
      setLoading(false)
    }
  }

  const closeFeature = () => setActiveFeature(null)

  return (
    <main className="site-shell" id="top">
      <div
        className={`feature-overlay ${activeFeature ? 'is-visible' : ''}`}
        onClick={closeFeature}
        aria-hidden={!activeFeature}
      />

      {/* Modal de Cadastro */}
      {isStarted && (
        <div className="signup-overlay" onClick={fecharModalCadastro}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="signup-close" onClick={fecharModalCadastro}>×</button>
            
            <h2>Criar conta TVScore</h2>
            <p>Comece a explorar filmes e séries incríveis</p>

            {mensagem && (
              <div className={`signup-message ${mensagem.tipo}`}>
                {mensagem.texto}
              </div>
            )}

            <form onSubmit={handleSubmitCadastro}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="signup-submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </form>

            <p className="signup-footer">Já tem conta? <a href="#login">Entrar</a></p>
          </div>
        </div>
      )}

      <nav className="navbar" aria-label="Navegação principal">
        <a className="brand" href="#top" aria-label="TVScore início">
          <Logo />
        </a>
        <div className="nav-links">
          <a href="#recursos">Recursos</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#sobre">Sobre</a>
        </div>
        <a className="login-button" href="#baixar">Entrar <span aria-hidden="true">→</span></a>
      </nav>

      <section className="hero-section">
        <div className="hero-copy hero-copy--intro">
          <p className="eyebrow"><span className="eyebrow-line" /> Seu catálogo, do seu jeito</p>
          <h1>Encontre algo <em>incrível</em> para assistir.</h1>
          <p className="hero-description">
            Avalie, descubra e salve seus filmes e séries favoritos. O TVScore ajuda você a encontrar o próximo título da sua lista.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#baixar" onClick={() => setIsStarted(true)}>
              {isStarted ? 'Vamos começar' : 'Criar minha conta'} <span aria-hidden="true">→</span>
            </a>
            <a className="text-button" href="#recursos">Conheça o TVScore <span aria-hidden="true">↓</span></a>
          </div>
          <p className="no-card">Já tem uma conta? <a href="#baixar">Entrar</a></p>
        </div>

        <div className="hero-visual" aria-label="Prévia do aplicativo TVScore">
          <div className="visual-orbit visual-orbit--one" />
          <div className="visual-orbit visual-orbit--two" />
          <div className="visual-glow" />
          <div className="app-preview">
            <div className="preview-topbar">
              <Logo compact />
              <span className="avatar">JS</span>
            </div>
            <div className="preview-welcome"><small>Olá, José!</small><strong>O que vamos assistir hoje?</strong></div>
            <div className="preview-feature">
              <img src={posters[0].image} alt="Oppenheimer" />
              <div>
                <span>DESTAQUE DA SEMANA</span>
                <strong>Oppenheimer</strong>
                <small>Uma história que vale seu tempo.</small>
                <button type="button">Ver detalhes →</button>
              </div>
            </div>
            <div className="preview-heading"><strong>Em alta</strong><span>Ver todos →</span></div>
            <div className="preview-posters">
              {posters.slice(0, 3).map((poster) => (
                <div className="mini-poster" key={poster.title}>
                  <div><img src={poster.image} alt={poster.title} /><span>★ {poster.score}</span></div>
                  <small>{poster.title}</small>
                  <em>{poster.type}</em>
                </div>
              ))}
            </div>
            <div className="preview-nav">
              <span className="active"><b>★</b>Início</span>
              <span>⌕<small>Buscar</small></span>
              <span>☰<small>Minha lista</small></span>
              <span>◉<small>Perfil</small></span>
            </div>
          </div>
          <div className="score-float"><span>★</span><strong>8.9</strong><small>avaliação média</small></div>
          <div className="floating-note"><span>+5.000</span><small>títulos disponíveis</small></div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Indicadores do TVScore">
        <div className="footer-stat"><strong>+100k</strong><span>Downloads</span></div>
        <div className="footer-stat"><strong>4,3 ★</strong><span>Avaliação</span></div>
        <div className="footer-stat"><strong>+5.000</strong><span>Títulos</span></div>
        <div className="footer-stat"><strong>24/7</strong><span>Disponível</span></div>
        <div className="footer-stat"><strong>HD</strong><span>Qualidade</span></div>
      </section>

      <section className="manifesto-section" id="sobre">
        <Reveal className="section-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> Muito mais que uma lista</p>
          <h2>Seu jeito de assistir <em>começa aqui.</em></h2>
          <p>O TVScore foi pensado para transformar a escolha do próximo filme em uma experiência simples, visual e personalizada.</p>
        </Reveal>
      </section>

      <section className="features-section" id="recursos">
        <div className="features-grid">
          {features.map((feature, index) => {
            const isOpen = activeFeature === feature.number

            return (
              <Reveal
                className={`feature-card ${isOpen ? 'is-expanded' : ''}`}
                key={feature.number}
                onClick={() => setActiveFeature(feature.number)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveFeature(feature.number)
                  }
                }}
              >
                <div className="feature-top"><span>{feature.number}</span><b>{feature.icon}</b></div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>

                <div className="feature-extra">
                  <span className="feature-extra__eyebrow">{feature.icon} {feature.title}</span>
                  <h4>{feature.expandedTitle}</h4>
                  <p>{feature.expandedText}</p>
                  <div className="feature-tags">
                    {feature.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="feature-close"
                  aria-label={`Fechar ${feature.title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    closeFeature()
                  }}
                >
                  ×
                </button>
                <span className="feature-line" style={{ '--delay': `${index * 80}ms` }} />
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <Reveal className="catalog-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Descubra seu próximo favorito</p>
          <h2>Do que está em alta ao que você <em>ainda não conhece.</em></h2>
          <p>Explore títulos, compare avaliações e encontre novas histórias sem ficar perdido em um catálogo infinito.</p>
          <a className="outline-button" href="#baixar">Explorar o TVScore <span>→</span></a>
        </Reveal>

        <Reveal className="poster-wall">
          {posters.map((poster, index) => (
            <article className={`wall-card wall-card--${index + 1}`} key={poster.title}>
              <img src={poster.image} alt={poster.title} />
              <div className="wall-overlay">
                <span>★ {poster.score}</span>
                <strong>{poster.title}</strong>
                <small>{poster.type}</small>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="download-section" id="baixar">
        <div className="download-glow" />
        <Reveal className="download-content">
          <p className="eyebrow"><span className="eyebrow-line" /> Comece agora</p>
          <h2>Seu próximo filme<br /><em>está esperando.</em></h2>
          <p>Crie sua conta, monte sua lista e descubra novas histórias com o TVScore.</p>
          <button className="primary-button primary-button--large" type="button" onClick={() => setIsStarted(true)}>
            {isStarted ? 'TVScore está pronto para você' : 'Baixe aqui'} <span aria-hidden="true">→</span>
          </button>
        </Reveal>
      </section>

      <footer className="site-footer">
        <Logo />
        <p>Encontre. Avalie. Assista.</p>
        <span>© 2026 TVScore. Projeto acadêmico.</span>
      </footer>
    </main>
  )
}

export default App
