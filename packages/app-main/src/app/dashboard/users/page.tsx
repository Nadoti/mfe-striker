export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <p>Lista de usuários do sistema</p>
      
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>1</td>
              <td style={{ padding: '0.75rem' }}>João Silva</td>
              <td style={{ padding: '0.75rem' }}>joao@example.com</td>
              <td style={{ padding: '0.75rem' }}>✅ Ativo</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>2</td>
              <td style={{ padding: '0.75rem' }}>Maria Santos</td>
              <td style={{ padding: '0.75rem' }}>maria@example.com</td>
              <td style={{ padding: '0.75rem' }}>✅ Ativo</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>3</td>
              <td style={{ padding: '0.75rem' }}>Pedro Costa</td>
              <td style={{ padding: '0.75rem' }}>pedro@example.com</td>
              <td style={{ padding: '0.75rem' }}>❌ Inativo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

