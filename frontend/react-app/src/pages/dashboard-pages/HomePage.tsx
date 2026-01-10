import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
{/* Main Content Area */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bem Vindo(a/e) de Volta!</h2>

{/* Action buttons (responsive) */}
            <div className="flex flex-col items-center md:flex-row md:justify-between gap-4 md:gap-6 mb-6">
  {/* ALERTAS Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform"
                  title="Alertas"
                  aria-label="Alertas"
                >
                  <span className="text-2xl">📊</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Alertas</h3>
                  <p className="text-xs text-gray-500">Veja e manuseie alertas em transações suspeitas</p>
                </div>
              </div>

  {/* CLIENTES Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform"
                  title="Clientes"
                  aria-label="Clientes"
                >
                  <span className="text-2xl">📁</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Clientes</h3>
                  <p className="text-xs text-gray-500">Lista e detalhes dos clientes</p>
                </div>
              </div>

  {/* TRANSACOES Button */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <Button
                  variant="default"
                  className="w-40 h-40 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform"
                  title="Transações"
                  aria-label="Transações"
                >
                  <span className="text-2xl">✅</span>
                </Button>
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Transações</h3>
                  <p className="text-xs text-gray-500">Veja transações recentes</p>
                </div>
              </div>
            </div>

{/* How to use UBS BRAN Section */}
            <h1 className="text-xl text-black font-semibold">Como posso usar o UBS BRAN?</h1>
            <p className="mt-2 text-gray-700">
              O UBS BRAN é uma ferramenta projetada para ajudar analistas de compliance a monitorar e gerenciar alertas de transações suspeitas de forma eficiente. Com uma interface intuitiva, você pode navegar facilmente entre diferentes seções, visualizar detalhes dos clientes e acompanhar as transações em tempo real.
            </p>

            <h2 className="text-lg text-black mt-2 font-semibold">Alertas</h2>
            <p className="text-gray-700">
              Na tela de Alertas, você pode visualizar uma lista de todos os alertas gerados por transações suspeitas.
              Também, você pode filtrar alertas por nível de risco, status, e ID da parte e contraparte envolvidas na transação suspeita.
              Ao uma transação gerar um alerta de nível de risco alto, a transação será congelada e ambos a parte e contraparte envolvidas na transação têm seu Know Your Client (KYC) status atualizado.
              Finalmente, você pode analisar os alertas individualmente e mudar seus status de análide (pendente, em análise, aprovado, rejeitado).
              Ao aprovar um alerta alto ou crítico, o sistema irá concluir a transação, mas o KYC status dos clientes continuará modificado.
            </p>
            <h2 className="text-lg text-black mt-2 font-semibold">Clientes</h2>
            <p className="text-gray-700">
              Na tela de Clientes, você pode monitorar todos os clientes da nossa base de dados. Você pode listá-los usando filtros além de poder adicionar ou remover clientes caso seja necessário.
            </p>
            <h2 className="text-lg text-black mt-2 font-semibold">Transações</h2>
            <p className="text-gray-700">
              Na tela de Transações, você pode visualizar todas as transações feitas, usando filtros por cliente e data e hora de transação.
              Além disso, você é capaz de adicionar novas transações manualmente, mas não pode apagar transações já feitas.
              Transações são relevantes para a análise de dados e organização monetária da UBS. Então é importante que todas as transações sejam mantidas no sistema.
              Além disso, transações suspeitas geram alertas automáticos que podem ser analisados na tela de Alertas.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}