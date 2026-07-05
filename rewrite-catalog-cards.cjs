const fs = require('fs');
let code = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');

const prodCardRegex = /<div\s+key=\{prod\.id\}\s+id=\{`product-\$\{prod\.id\}`\}[\s\S]*?<\/div>\s*<\/div>\s*\);\s*}\)\}/;

const newProdCard = `<div
                    key={prod.id}
                    id={\`product-\${prod.id}\`}
                    className="bg-white border border-gray-100/70 rounded-[18px] flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative p-[12px] text-left"
                    onClick={() => setSelectedProduct(prod)}
                  >
                    {/* 9:16 Aspect Ratio Photo occupying approx 75% height */}
                    <div className="relative aspect-[9/16] rounded-[12px] overflow-hidden bg-gray-50 mb-[10px]">
                      <img
                        src={primaryImg}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Product details below the image */}
                    <div className="flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="font-sans font-bold text-[13px] leading-[1.1] text-gray-800 line-clamp-2 mb-1.5 group-hover:text-[#FF2D7A] transition-colors">
                        {prod.name}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-end gap-1.5 mb-2.5">
                        <span className="font-sans font-black text-[16px] text-gray-900 tracking-tight">
                          R$ {priceToDisplay.toFixed(2)}
                        </span>
                        {prod.promoPrice && (
                          <span className="font-sans font-medium text-[11px] text-gray-400 line-through mb-[3px]">
                            R$ {prod.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* EU QUERO CTA Button - Brand Hot Pink styled to look like an upscale native premium app */}
                      <div className="mt-auto">
                        <button
                          id={\`buy-\${prod.id}\`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEuQuero(prod);
                          }}
                          className="w-full bg-[#FF2D7A] text-white py-2.5 rounded-[12px] font-sans font-extrabold text-[11px] tracking-wide shadow-[0_4px_12px_rgba(255,45,122,0.25)] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10M6 10H18C19.1046 10 20 10.8954 20 12V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V12C4 10.8954 4.89543 10 6 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>EU QUERO</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}`;

code = code.replace(prodCardRegex, newProdCard);

fs.writeFileSync('src/components/CatalogView.tsx', code);
