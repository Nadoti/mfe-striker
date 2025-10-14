export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Gerenciamento de produtos</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '100%', 
              height: '150px', 
              background: '#e5e7eb', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
            </div>
            <h3>Produto {item}</h3>
            <p style={{ color: '#6b7280' }}>Descrição do produto {item}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0070f3' }}>
              R$ {(item * 99.99).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

