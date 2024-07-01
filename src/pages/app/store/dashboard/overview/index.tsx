import { useParams } from 'react-router-dom'
export function StoreOverview() {
  const { storeId } = useParams()

  console.log(storeId)

  return (
    <div>
      <h1 className="font-bold">Página resumo</h1>
      <ul>
        <li>Nº vendas hoje</li>
        <li>Quantia faturada hoje</li>
        <li>qualquer outra estatistica</li>
      </ul>
      <hr />
      <ul>
        <li>
          Produtos com stock baixo (se abilitado) &nbsp;&nbsp;&nbsp; Avaliações
          mais recentes aos produtos
        </li>
      </ul>
    </div>
  )
}
