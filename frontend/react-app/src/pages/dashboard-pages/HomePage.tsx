import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen animate-in fade-in duration-1000">
{/* Main Content Area */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg p-[4px] bg-gradient-to-r from-[#ff0a0a] via-[#ed2df0] to-[#1100ff]">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-4xl flex justify-center mb-4 font-bold text-gray-900 bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198] bg-clip-text text-transparent">
                Bem Vindo(a/e) de Volta!
              </h2>
              <p className="text-lg text-gray-700 text-center mb-6">
                ao
              </p>
              <h1 className="text-6xl font-bold text-primary space-y-2 mb-6 text-center">
              UBS 
              <span className="bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198] bg-clip-text text-transparent">
                BRAN
                </span>
            </h1>
            <h3 className="text-2xl font-semibold text-UBS-black mb-6 mb-12 text-center">O que você gostaria de fazer hoje?</h3>

{/* Action buttons (responsive) */}
            <div className="flex flex-col items-center md:flex-row md:justify-between gap-4 md:gap-6 mb-6">
  {/* ALERTAS Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 hover:bg-[#b10606] hover:shadow-[0_0_10px_#ff0a0a] transition-all"
                  title="Alertas"
                  aria-label="Alertas"
                  onClick={() => navigate('/dashboard/alerts')}
                >
                  <span className="text-6xl">🚨</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Ver Alertas</h3>
                  <p className="text-xs text-gray-500">Veja e manuseie alertas em transações suspeitas</p>
                </div>
              </div>

  {/* CLIENTES Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 hover:bg-[#971e99] hover:shadow-[0_0_10px_#ed2df0] transition-all"
                  title="Clientes"
                  aria-label="Clientes"
                  onClick={() => navigate('/dashboard/clients')}
                >
                  <span className="text-6xl">👤</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Ver Clientes</h3>
                  <p className="text-xs text-gray-500">Lista e detalhes dos clientes</p>
                </div>
              </div>

  {/* TRANSACOES Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 hover:bg-[#0b0198] hover:shadow-[0_0_10px_#1100ff] transition-all"
                  title="Transações"
                  aria-label="Transações"
                  onClick={() => navigate('/dashboard/transactions')}
                >
                  <span className="text-6xl">↔️</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Ver Transações</h3>
                  <p className="text-xs text-gray-500">Veja transações recentes</p>
                </div>
              </div>
            </div>

            {/* Decorative Divider Line */}
            <div className="h-1 my-8 rounded-full bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198]"></div>

{/* How to use UBS BRAN Section */}
            <h1 className="text-xl text-black font-semibold">Como posso usar o UBS BRAN?</h1>
            <p className="mt-2 mb-4 text-gray-700">
              O UBS BRAN é uma ferramenta projetada para ajudar analistas de compliance a monitorar e gerenciar alertas de transações suspeitas de forma eficiente. Com uma interface intuitiva, você pode
               navegar facilmente entre diferentes seções, visualizar detalhes dos clientes, e acompanhar e gerar transações em tempo real.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="alertas">
                <AccordionTrigger className="text-lg text-black font-semibold group">
                  <span className="inline-block group-hover:scale-110 group-hover:text-[#780707] transition-all">Alertas</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Na tela de Alertas, você pode visualizar uma lista de todos os alertas gerados por transações suspeitas.
                  Também, você pode filtrar alertas por nível de risco, status, e ID da parte e contraparte envolvidas na transação suspeita.
                  Ao uma transação gerar um alerta de nível de ao menos risco alto, a transação será congelada e ambos a parte e contraparte envolvidas na transação têm seu Know Your Client (KYC) status atualizado.
                  Finalmente, você pode analisar os alertas individualmente e mudar seus status de análise (Pendente, Aprovado, Rejeitado).
                  Ao aprovar um alerta alto ou crítico, o sistema irá concluir a transação, mas o KYC status dos clientes continuará modificado até que uma nova análise seja feita.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="clientes">
                <AccordionTrigger className="text-lg text-black font-semibold group">
                  <span className="inline-block group-hover:scale-110 group-hover:text-[#971e99] transition-all">Clientes</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Na tela de Clientes, você pode monitorar todos os clientes da nossa base de dados. Você pode listá-los usando filtros além de poder também adicionar ou remover clientes caso seja necessário.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transacoes">
                <AccordionTrigger className="text-lg text-black font-semibold group">
                  <span className="inline-block group-hover:scale-110 group-hover:text-[#0b0198] transition-all">Transações</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Na tela de Transações, você pode visualizar todas as transações feitas por clientes e ex-clientes. Adicionalmente, utilizando filtros, você
                   pode filtrar transações por cliente, data e hora de transação, e entre outros.
                  Além disso, você é capaz de adicionar novas transações manualmente, mas não pode apagar transações já feitas.
                  Transações são relevantes para a análise de dados e organização monetária da UBS. Então é importante que transações não possam ser deletadas do sistema. Apenas com a troca
                  manual de bancos de dados que a remoção de transações pode ser feita.
                  Finalmente, transações suspeitas geram alertas automáticos que podem ser analisados na tela de Alertas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}