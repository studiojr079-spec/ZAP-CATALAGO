import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface GreetingProps {
  name?: string;
  primaryColor?: string;
}

export default function Greeting({ name, primaryColor = '#FF2D7A' }: GreetingProps) {
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { main: `☀️ Bom dia!`, emoji: '☀️' };
    } else if (hour >= 12 && hour < 18) {
      return { main: `🌤️ Boa tarde!`, emoji: '🌤️' };
    } else {
      return { main: `🌙 Boa noite!`, emoji: '🌙' };
    }
  }, []);

  const secondaryMessage = useMemo(() => {
    const messages = [
      'Que bom ter você de volta.',
      'Vamos vender hoje?',
      'Seu catálogo está pronto para receber novos clientes.',
      'Desejamos excelentes vendas hoje!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="px-5 pt-2 pb-4 space-y-1"
    >
      <h1 
        className="text-2xl font-semibold tracking-tight leading-tight"
        style={{ color: primaryColor }}
      >
        {greetingText.main}
      </h1>
      <p className="text-base text-[#8E8E93] font-normal">
        {secondaryMessage}
      </p>
    </motion.div>
  );
}
