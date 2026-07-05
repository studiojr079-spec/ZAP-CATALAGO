const fs = require('fs');
let code = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');

const regexEuQuero = /const handleEuQuero = async \(product: Product\) => {[\s\S]*?analytics\.clicks \+= 1;\s*await saveAnalytics\(analytics\);\s*}/;
const newEuQuero = `const handleEuQuero = async (product: Product) => {
    if (isPreview) {
      alert(\`[Modo de Visualização]\\nIsso direcionaria o cliente para o WhatsApp com uma mensagem sobre o produto "\${product.name}".\`);
      return;
    }

    const price = product.promoPrice || product.price;
    const message = \`Olá! Gostaria de comprar o produto:\n\n*Nome:* \${product.name}\n*Valor:* R$ \${price.toFixed(2)}\n\n(ID: \${product.id})\`;
    const whatsappUrl = \`https://wa.me/\${store.whatsapp}?text=\${encodeURIComponent(message)}\`;
    
    // Ask the user if they want to add more items or send directly
    if (window.confirm("Deseja enviar agora para o WhatsApp da loja? (Clique 'Cancelar' se desejar ver mais itens)")) {
      window.open(whatsappUrl, '_blank');
      
      const newOrder = {
        id: 'ord_' + Date.now(),
        storeId: store.id,
        items: [{
          productId: product.id,
          name: product.name,
          price: price,
          quantity: 1
        }],
        totalAmount: price,
        customerName: 'Cliente Via WhatsApp',
        customerPhone: '',
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        notes: \`Clique originado do botão "EU QUERO".\`
      };
      await saveOrder(newOrder);

      const analytics = await getAnalytics(store.id);
      analytics.clicks += 1;
      await saveAnalytics(analytics);
    }
  }`;

code = code.replace(regexEuQuero, newEuQuero);

// Now remove SKU and stock from modal
const regexModalStock = /<div className="flex flex-wrap items-center gap-2 mb-2">[\s\S]*?<\/div>\s*<\/div>\s*<h2 className="font-sans font-bold/;
code = code.replace(regexModalStock, '<h2 className="font-sans font-bold');

fs.writeFileSync('src/components/CatalogView.tsx', code);
