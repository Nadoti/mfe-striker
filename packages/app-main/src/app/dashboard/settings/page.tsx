export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <p>Configurações do sistema</p>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginTop: '1rem', maxWidth: '600px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Nome da Empresa
          </label>
          <input 
            type="text" 
            defaultValue="Minha Empresa"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Email
          </label>
          <input 
            type="email" 
            defaultValue="contato@empresa.com"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" defaultChecked />
            <span>Receber notificações por email</span>
          </label>
        </div>
        
        <button style={{
          background: '#0070f3',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

